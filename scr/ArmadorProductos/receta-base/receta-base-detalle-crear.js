(function () {
  var SHEET = "Tabla-Receta-Base-Detalle";
  var SHEET_INSUMOS = "Tabla-Insumo-Materia-Prima";
  /** Mapeo según esquema-armador-productos.json → camposReflejo para Tabla-Receta-Base-Detalle (origen: Tabla-Insumo-Materia-Prima) */
  var CAMPOS_PROPAGADOS = [
    { origen: "Nombre-Producto", destino: "Nombre-Insumo" },
    { origen: "Tipo-Unidad-Medida", destino: "Unidad-Medida" },
    { origen: "Precio-Equivalencia-x-Unidad", destino: "Precio-Equivalencia-x-Unidad" }
  ];

  function getQueryId() {
    var m = /[?&]id=([^&]+)/.exec(window.location.search);
    if (m) return decodeURIComponent(m[1]);
    var h = (window.location.hash || "").replace(/^#/, "");
    return h ? decodeURIComponent(h) : "";
  }

  function showMsg(text, type) {
    var el = document.getElementById("armador-msg");
    if (!el) return;
    el.textContent = text;
    el.className = "armador-msg " + (type === "error" ? "error" : "success");
    el.style.display = "block";
  }

  var idReceta = getQueryId();

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("form-detalle");
    var backLink = document.getElementById("back-link");
    var cancelLink = document.getElementById("cancel-link");
    var idRecetaEl = document.getElementById("IDReceta-Base");
    if (idRecetaEl) idRecetaEl.value = idReceta || "";
    var detalleUrl = "receta-base-detalle.html#" + encodeURIComponent(idReceta);
    if (backLink) backLink.href = detalleUrl;
    if (cancelLink) cancelLink.href = detalleUrl;

    if (!idReceta) { showMsg("Falta id de receta en la URL.", "error"); return; }
    if (!window.ArmadorAPI) { showMsg("Error: no se cargó la API.", "error"); return; }

    var sel = document.getElementById("IDInsumo-MateriaPrima");
    var insumosPorId = {};
    if (sel) {
      ArmadorAPI.list(SHEET_INSUMOS).then(function (rows) {
        rows.forEach(function (r) {
          var id = r["IDInsumo-MateriaPrima"] || "";
          if (id) insumosPorId[id] = r;
        });
        sel.innerHTML = "<option value=\"\">— Seleccionar —</option>" +
          rows.map(function (r) {
            var id = r["IDInsumo-MateriaPrima"] || "";
            var nom = r["Nombre-Producto"] || id;
            return "<option value=\"" + id + "\">" + nom + "</option>";
          }).join("");

        sel.addEventListener("change", function () {
          var id = (sel.value || "").trim();
          var insumo = id ? insumosPorId[id] : null;
          CAMPOS_PROPAGADOS.forEach(function (m) {
            var el = document.getElementById(m.destino) || document.querySelector("[name=\"" + m.destino + "\"]");
            if (el) el.value = insumo && (insumo[m.origen] != null && insumo[m.origen] !== "") ? insumo[m.origen] : "";
          });
        });
      }).catch(function () { sel.innerHTML = "<option value=\"\">Error al cargar insumos</option>"; });
    }

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var payload = {};
        fd.forEach(function (value, key) { payload[key] = value; });
        if (payload["Cantidad"] !== "") payload["Cantidad"] = parseFloat(payload["Cantidad"]) || "";
        if (payload["Precio-Equivalencia-x-Unidad"] !== "") payload["Precio-Equivalencia-x-Unidad"] = parseFloat(payload["Precio-Equivalencia-x-Unidad"]) || "";
        var cant = parseFloat(payload["Cantidad"]);
        var precio = parseFloat(payload["Precio-Equivalencia-x-Unidad"]);
        if (!isNaN(cant) && !isNaN(precio)) payload["Importe"] = (cant * precio).toFixed(2);

        ArmadorAPI.create(SHEET, payload)
          .then(function (res) {
            if (res.result === "error") { showMsg(res.error || "Error al guardar", "error"); return; }
            showMsg("Línea agregada.", "success");
            setTimeout(function () { window.location.href = detalleUrl; }, 1000);
          })
          .catch(function (err) { showMsg("Error: " + (err.message || err), "error"); });
      });
    }
  });
})();
