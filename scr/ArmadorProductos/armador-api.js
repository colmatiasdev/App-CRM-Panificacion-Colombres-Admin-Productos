/**
 * API Armador de Productos – Costos y Recetas.
 * Usa APP_CONFIG.appsScriptArmadorProductosUrl (scr/Configuracion/config.js).
 */
(function (global) {
  function getBaseUrl() {
    return (global.APP_CONFIG && global.APP_CONFIG.appsScriptArmadorProductosUrl) || "";
  }

  function buildParams(obj) {
    return Object.entries(obj)
      .filter(function (e) { return e[1] != null && e[1] !== ""; })
      .map(function (e) { return encodeURIComponent(e[0]) + "=" + encodeURIComponent(String(e[1])); })
      .join("&");
  }

  /**
   * GET list: action=list, sheetName=..., y opcionales idRecetaBase, idCostoProducto, idCostoProductoUnitario, idPacking.
   * @param {string} sheetName
   * @param {Object} [filtros] - idRecetaBase, idCostoProducto, idCostoProductoUnitario, idPacking
   * @returns {Promise<Array>}
   */
  function list(sheetName, filtros) {
    var url = getBaseUrl();
    if (!url) return Promise.reject(new Error("APP_CONFIG.appsScriptArmadorProductosUrl no definido"));
    var params = { action: "list", sheetName: sheetName };
    if (filtros) {
      if (filtros.idRecetaBase) params.idRecetaBase = filtros.idRecetaBase;
      if (filtros.idCostoProducto) params.idCostoProducto = filtros.idCostoProducto;
      if (filtros.idCostoProductoUnitario) params.idCostoProductoUnitario = filtros.idCostoProductoUnitario;
      if (filtros.idPacking) params.idPacking = filtros.idPacking;
    }
    var query = buildParams(params);
    return fetch(url + (url.indexOf("?") >= 0 ? "&" : "?") + query, { method: "GET" })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.result === "error") return Promise.reject(new Error(data.error || "Error en API"));
        var rows = data.rows || [];
        var headers = data.headers || [];
        if (headers.length && rows.length && Array.isArray(rows[0])) {
          return rows.map(function (row) {
            var obj = {};
            headers.forEach(function (h, i) { obj[h] = row[i]; });
            return obj;
          });
        }
        return Array.isArray(data) ? data : rows;
      });
  }

  /**
   * Cargar listado de valores desde COMPONENTE-COMBOS (columna).
   * @param {string} columna - ej. Combo-Tipo-Productos, Combo-Comercio-Sucursal
   * @returns {Promise<Array<string>>}
   */
  function listados(columna) {
    var url = getBaseUrl();
    if (!url) return Promise.reject(new Error("APP_CONFIG.appsScriptArmadorProductosUrl no definido"));
    var params = { action: "listados", sheetName: "COMPONENTE-COMBOS", columna: columna };
    var query = buildParams(params);
    return fetch(url + (url.indexOf("?") >= 0 ? "&" : "?") + query, { method: "GET" })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.result === "error") return Promise.reject(new Error(data.error || "Error en API"));
        return Array.isArray(data.values) ? data.values : (data.rows || data.data || []);
      });
  }

  /**
   * POST create. Body: JSON con columnas de la tabla.
   * @param {string} sheetName
   * @param {Object} payload
   * @returns {Promise<Object>}
   */
  function create(sheetName, payload) {
    var url = getBaseUrl();
    if (!url) return Promise.reject(new Error("APP_CONFIG.appsScriptArmadorProductosUrl no definido"));
    var body = Object.assign({ action: "create", sheetName: sheetName }, payload);
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json(); });
  }

  /**
   * POST update. Body: JSON con al menos la PK y columnas a actualizar.
   * @param {string} sheetName
   * @param {Object} payload
   * @returns {Promise<Object>}
   */
  function update(sheetName, payload) {
    var url = getBaseUrl();
    if (!url) return Promise.reject(new Error("APP_CONFIG.appsScriptArmadorProductosUrl no definido"));
    var body = Object.assign({ action: "update", sheetName: sheetName }, payload);
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json(); });
  }

  /**
   * POST delete (baja física o lógica según backend).
   * @param {string} sheetName
   * @param {Object} payload - al menos la PK
   * @returns {Promise<Object>}
   */
  function remove(sheetName, payload) {
    var url = getBaseUrl();
    if (!url) return Promise.reject(new Error("APP_CONFIG.appsScriptArmadorProductosUrl no definido"));
    var body = Object.assign({ action: "delete", sheetName: sheetName }, payload);
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json(); });
  }

  global.ArmadorAPI = {
    list: list,
    listados: listados,
    create: create,
    update: update,
    remove: remove,
    getBaseUrl: getBaseUrl
  };
})(typeof window !== "undefined" ? window : this);
