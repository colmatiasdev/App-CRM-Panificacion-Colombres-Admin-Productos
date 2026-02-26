/**
 * Armador de Productos - Apps Script único
 * Copiar todo este archivo en el editor de Apps Script del Google Sheet correspondiente.
 * Desplegar como aplicación web: Ejecutar la app como "Yo", Quién tiene acceso "Cualquier persona".
 * Alineado a scr/arquitectura/esquema-armador-productos.json
 */

var SEPARADOR = "-";
var ALFANUM = "0123456789abcdefghijklmnopqrstuvwxyz";
var LONGITUD_ALFANUM = 12;
var LONGITUD_SUFIJO_NUM = 4;

function generarAlfanumerico(longitud) {
  longitud = longitud || LONGITUD_ALFANUM;
  var s = "";
  for (var i = 0; i < longitud; i++) {
    s += ALFANUM.charAt(Math.floor(Math.random() * ALFANUM.length));
  }
  return s;
}

function generarIdFormatoPrefijo(prefijo) {
  return prefijo + SEPARADOR + generarAlfanumerico(LONGITUD_ALFANUM);
}

function generarIdFormatoConSufijoNumerico() {
  var alfanum = generarAlfanumerico(14);
  var sufijo = "";
  for (var i = 0; i < LONGITUD_SUFIJO_NUM; i++) {
    sufijo += Math.floor(Math.random() * 10);
  }
  return "ID" + SEPARADOR + alfanum + SEPARADOR + sufijo;
}

var TABLA_A_FORMATO = {
  "Tabla-Costo-Productos": { tipo: "prefijo", prefijo: "PROD-COSTO" },
  "Tabla-Costos-ProductoUnitario": { tipo: "prefijo", prefijo: "CPU" },
  "Tabla-Elaboracion-ProductosBase": { tipo: "prefijo", prefijo: "ELAB" },
  "Tabla-Receta-Base": { tipo: "prefijo", prefijo: "REC" },
  "Tabla-Receta-Base-Detalle": { tipo: "prefijo", prefijo: "RBD" },
  "Tabla-Receta-Relleno-Detalle": { tipo: "prefijo", prefijo: "RR" },
  "Tabla-Receta-Decoracion-Detalle": { tipo: "prefijo", prefijo: "RD" },
  "Tabla-Packing": { tipo: "prefijo", prefijo: "PKG" },
  "Tabla-Packing-Detalle": { tipo: "prefijo", prefijo: "PD" },
  "Tabla-Insumo-Materia-Prima": { tipo: "prefijo", prefijo: "IMP" },
  "Tabla-Insumo-Packing": { tipo: "prefijo", prefijo: "IP" },
  "Listado-Productos-Elaborados": { tipo: "prefijo", prefijo: "PROD" },
  "Tabla-Costo-Productos-Compuesto-ProductoBase": { tipo: "sufijoNumerico" },
  "Tabla-Packing-Productos": { tipo: "sufijoNumerico" }
};

function generarIdPorTabla(nombreTabla) {
  var conf = TABLA_A_FORMATO[nombreTabla];
  if (!conf) return null;
  if (conf.tipo === "prefijo") return generarIdFormatoPrefijo(conf.prefijo);
  if (conf.tipo === "sufijoNumerico") return generarIdFormatoConSufijoNumerico();
  return null;
}

function getSheetByName(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error("Hoja no encontrada: " + name);
  return sheet;
}

function getDataRange(sheet) {
  var range = sheet.getDataRange();
  var values = range.getValues();
  if (!values || values.length < 2) return { headers: [], rows: [] };
  var headers = values[0];
  var rows = values.slice(1).filter(function (row) {
    return row.some(function (c) { return c !== null && c !== undefined && String(c).trim() !== ""; });
  });
  return { headers: headers, rows: rows };
}

function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};
  var action = (params.action || "list").toLowerCase();
  var sheetName = params.sheetName || "";
  var result = { result: "ok", action: action };

  try {
    if (!sheetName) {
      result.result = "error";
      result.error = "Falta sheetName";
      return respond(result);
    }

    if (action === "list") {
      var filterId = params.idproducto || params.idCostoProducto || params.idRecetaBase || params.idCostoProductoUnitario || params.idPacking || params.id;
      var data = listSheet(sheetName, filterId, params);
      result.headers = data.headers;
      result.rows = data.rows;
      result.count = data.rows.length;
    } else if (action === "listados") {
      var col = params.columna || "Combo-Tipo-Productos";
      result.values = listadoUnico(sheetName, col);
    } else {
      result.result = "error";
      result.error = "Acción no válida para GET: " + action;
    }
  } catch (err) {
    result.result = "error";
    result.error = err.message || String(err);
  }
  return respond(result);
}

function doPost(e) {
  var result = { result: "ok" };
  try {
    var params = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    var action = (params.action || "create").toLowerCase();
    var sheetName = params.sheetName || "";

    if (!sheetName) {
      result.result = "error";
      result.error = "Falta sheetName";
      return respond(result);
    }

    if (action === "create") {
      result.id = createRow(sheetName, params);
      result.message = "Registro creado";
    } else if (action === "update") {
      updateRow(sheetName, params);
      result.message = "Registro actualizado";
    } else if (action === "delete") {
      deleteRow(sheetName, params);
      result.message = "Registro eliminado o deshabilitado";
    } else {
      result.result = "error";
      result.error = "Acción no válida: " + action;
    }
  } catch (err) {
    result.result = "error";
    result.error = err.message || String(err);
  }
  return respond(result);
}

function listSheet(sheetName, filterId, params) {
  var sheet = getSheetByName(sheetName);
  var data = getDataRange(sheet);
  var headers = data.headers;
  var rows = data.rows;

  if (filterId && String(filterId).trim() !== "") {
    var filterKey = inferFilterColumn(sheetName, params);
    if (filterKey) {
      var colIndex = headers.indexOf(filterKey);
      if (colIndex === -1) colIndex = headers.findIndex(function (h) {
        return (h + "").toLowerCase().indexOf("id") >= 0 || (h + "").toLowerCase().indexOf("producto") >= 0;
      });
      if (colIndex >= 0) {
        rows = rows.filter(function (row) { return String(row[colIndex] || "").trim() === String(filterId).trim(); });
      }
    }
  }
  return { headers: headers, rows: rows };
}

function inferFilterColumn(sheetName, params) {
  if (params.idCostoProducto) return "IDCosto-Producto";
  if (params.idRecetaBase) return "IDReceta-Base";
  if (params.idCostoProductoUnitario) return "IDCosto-ProductoUnitario";
  if (params.idPacking) return "IDPacking";
  if (params.idproducto) return "IDCosto-Producto";
  if (params.id) return "IDProducto";
  return null;
}

function listadoUnico(sheetName, columna) {
  var sheet = getSheetByName(sheetName);
  var data = getDataRange(sheet);
  var headers = data.headers;
  var colIndex = headers.indexOf(columna);
  if (colIndex === -1) colIndex = 0;
  var set = {};
  data.rows.forEach(function (row) {
    var v = row[colIndex];
    var s = (v != null ? String(v) : "").trim();
    if (s) set[s] = true;
  });
  return Object.keys(set).sort();
}

function createRow(sheetName, payload) {
  var sheet = getSheetByName(sheetName);
  var data = getDataRange(sheet);
  var headers = data.headers;
  var tableName = sheetName;

  var pkCol = null;
  if (tableName.indexOf("Tabla-Costo-Productos-Compuesto") >= 0 || tableName === "Tabla-Packing-Productos") {
    pkCol = "ID-Unico";
  } else if (tableName === "Tabla-Costo-Productos") pkCol = "IDCosto-Producto";
  else if (tableName === "Tabla-Costos-ProductoUnitario") pkCol = "IDCosto-ProductoUnitario";
  else if (tableName === "Tabla-Elaboracion-ProductosBase") pkCol = "IDElaboracion-ProductoBase";
  else if (tableName === "Tabla-Receta-Base") pkCol = "IDReceta-Base";
  else if (tableName === "Tabla-Receta-Base-Detalle") pkCol = "IDReceta-Base-Detalle";
  else if (tableName === "Tabla-Receta-Relleno-Detalle") pkCol = "IDReceta-Relleno";
  else if (tableName === "Tabla-Receta-Decoracion-Detalle") pkCol = "IDReceta-Decoracion";
  else if (tableName === "Tabla-Packing") pkCol = "IDPacking";
  else if (tableName === "Tabla-Packing-Detalle") pkCol = "IDPacking-Detalle";
  else if (tableName === "Tabla-Insumo-Materia-Prima") pkCol = "IDInsumo-MateriaPrima";
  else if (tableName === "Tabla-Insumo-Packing") pkCol = "IDInsumo-Packing";
  else if (tableName === "Listado-Productos-Elaborados") pkCol = "IDProducto";

  if (pkCol && (!payload[pkCol] || String(payload[pkCol]).trim() === "")) {
    payload[pkCol] = generarIdPorTabla(tableName);
  }

  var ordenCol = null;
  if (tableName === "Tabla-Costo-Productos" || tableName === "Tabla-Costos-ProductoUnitario") ordenCol = "Orden";
  if (tableName === "Listado-Productos-Elaborados") ordenCol = "Orden-Lista";
  if (ordenCol && (payload[ordenCol] === undefined || payload[ordenCol] === "" || payload[ordenCol] === null)) {
    var maxOrden = 0;
    var ordenIdx = headers.indexOf(ordenCol);
    if (ordenIdx >= 0 && data.rows.length > 0) {
      data.rows.forEach(function (row) {
        var n = parseInt(row[ordenIdx], 10);
        if (!isNaN(n) && n > maxOrden) maxOrden = n;
      });
    }
    payload[ordenCol] = maxOrden + 1;
  }

  var row = [];
  headers.forEach(function (h) {
    var val = payload[h];
    if (val === undefined) val = "";
    row.push(val);
  });
  sheet.appendRow(row);
  return payload[pkCol] || row[headers.indexOf(pkCol)];
}

function updateRow(sheetName, payload) {
  var sheet = getSheetByName(sheetName);
  var data = getDataRange(sheet);
  var headers = data.headers;
  var pkCol = null;
  if (sheetName === "Tabla-Costo-Productos") pkCol = "IDCosto-Producto";
  else if (sheetName === "Tabla-Costo-Productos-Compuesto-ProductoBase" || sheetName === "Tabla-Packing-Productos") pkCol = "ID-Unico";
  else if (sheetName === "Tabla-Costos-ProductoUnitario") pkCol = "IDCosto-ProductoUnitario";
  else if (sheetName === "Tabla-Elaboracion-ProductosBase") pkCol = "IDElaboracion-ProductoBase";
  else if (sheetName === "Tabla-Receta-Base") pkCol = "IDReceta-Base";
  else if (sheetName === "Tabla-Receta-Base-Detalle") pkCol = "IDReceta-Base-Detalle";
  else if (sheetName === "Tabla-Receta-Relleno-Detalle") pkCol = "IDReceta-Relleno";
  else if (sheetName === "Tabla-Receta-Decoracion-Detalle") pkCol = "IDReceta-Decoracion";
  else if (sheetName === "Tabla-Packing") pkCol = "IDPacking";
  else if (sheetName === "Tabla-Packing-Detalle") pkCol = "IDPacking-Detalle";
  else if (sheetName === "Tabla-Insumo-Materia-Prima") pkCol = "IDInsumo-MateriaPrima";
  else if (sheetName === "Tabla-Insumo-Packing") pkCol = "IDInsumo-Packing";
  else if (sheetName === "Listado-Productos-Elaborados") pkCol = "IDProducto";

  var pkVal = pkCol ? payload[pkCol] : null;
  if (!pkVal) throw new Error("Falta clave primaria para actualizar");

  var colIdx = headers.indexOf(pkCol);
  if (colIdx < 0) throw new Error("Columna PK no encontrada: " + pkCol);

  var lastRow = sheet.getLastRow();
  for (var r = 2; r <= lastRow; r++) {
    if (String(sheet.getRange(r, colIdx + 1).getValue() || "").trim() === String(pkVal).trim()) {
      headers.forEach(function (h, i) {
        if (payload.hasOwnProperty(h)) {
          sheet.getRange(r, i + 1).setValue(payload[h] != null ? payload[h] : "");
        }
      });
      return;
    }
  }
  throw new Error("Registro no encontrado: " + pkVal);
}

function deleteRow(sheetName, payload) {
  var sheet = getSheetByName(sheetName);
  var data = getDataRange(sheet);
  var headers = data.headers;
  var pkCol = null;
  if (sheetName === "Tabla-Costo-Productos") pkCol = "IDCosto-Producto";
  else if (sheetName === "Tabla-Costo-Productos-Compuesto-ProductoBase" || sheetName === "Tabla-Packing-Productos") pkCol = "ID-Unico";
  else if (sheetName === "Tabla-Costos-ProductoUnitario") pkCol = "IDCosto-ProductoUnitario";
  else if (sheetName === "Tabla-Elaboracion-ProductosBase") pkCol = "IDElaboracion-ProductoBase";
  else if (sheetName === "Tabla-Receta-Base") pkCol = "IDReceta-Base";
  else if (sheetName === "Tabla-Receta-Base-Detalle") pkCol = "IDReceta-Base-Detalle";
  else if (sheetName === "Tabla-Receta-Relleno-Detalle") pkCol = "IDReceta-Relleno";
  else if (sheetName === "Tabla-Receta-Decoracion-Detalle") pkCol = "IDReceta-Decoracion";
  else if (sheetName === "Tabla-Packing") pkCol = "IDPacking";
  else if (sheetName === "Tabla-Packing-Detalle") pkCol = "IDPacking-Detalle";
  else if (sheetName === "Tabla-Insumo-Materia-Prima") pkCol = "IDInsumo-MateriaPrima";
  else if (sheetName === "Tabla-Insumo-Packing") pkCol = "IDInsumo-Packing";
  else if (sheetName === "Listado-Productos-Elaborados") pkCol = "IDProducto";

  var pkVal = pkCol ? payload[pkCol] : null;
  if (!pkVal) throw new Error("Falta clave primaria para eliminar");

  var colIdx = headers.indexOf(pkCol);
  var habCol = headers.indexOf("Habilitado");
  var lastRow = sheet.getLastRow();

  for (var r = 2; r <= lastRow; r++) {
    if (String(sheet.getRange(r, colIdx + 1).getValue() || "").trim() === String(pkVal).trim()) {
      if (habCol >= 0) {
        sheet.getRange(r, habCol + 1).setValue("NO");
      } else {
        sheet.deleteRow(r);
      }
      return;
    }
  }
  throw new Error("Registro no encontrado: " + pkVal);
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
