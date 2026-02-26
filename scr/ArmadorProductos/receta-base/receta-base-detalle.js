(function () {
  var SHEET_DETALLE = "Tabla-Receta-Base-Detalle";
  var SHEET_INSUMOS = "Tabla-Insumo-Materia-Prima";

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

  function renderRows(rows) {
    var tbody = document.getElementById("tabla-detalle-body");
    if (!tbody) return;
    tbody.innerHTML = rows
      .map(function (r) {
        var imp = r["Importe"] != null ? Number(r["Importe"]) : "";
        if (imp !== "" && !isNaN(imp)) imp = imp.toFixed(2);
        var precio = r["Precio-Equivalencia-x-Unidad"] != null ? Number(r["Precio-Equivalencia-x-Unidad"]) : "";
        if (precio !== "" && !isNaN(precio)) precio = precio.toFixed(4);
        return (
          "<tr>" +
          "<td>" + (r["Nombre-Insumo"] || r["IDInsumo-MateriaPrima"] || "") + "</td>" +
          "<td>" + (r["Cantidad"] != null ? r["Cantidad"] : "") + "</td>" +
          "<td>" + (r["Unidad-Medida"] || "") + "</td>" +
          "<td>" + precio + "</td>" +
          "<td>" + imp + "</td>" +
          "<td></td></tr>"
        );
      })
      .join("");
  }

  var idReceta = getQueryId();

  document.addEventListener("DOMContentLoaded", function () {
    var loading = document.getElementById("armador-loading");
    var wrap = document.getElementById("armador-table-wrap");
    var label = document.getElementById("receta-id-label");
    var btnNueva = document.getElementById("btn-nueva-linea");

    if (!idReceta) {
      loading.textContent = "Falta id de receta en la URL.";
      return;
    }
    if (label) label.textContent = "Receta: " + idReceta;
    if (btnNueva) btnNueva.href = "receta-base-detalle-crear.html#" + encodeURIComponent(idReceta);

    if (!window.ArmadorAPI) {
      loading.textContent = "Error: no se cargó la API.";
      return;
    }

    window.ArmadorAPI.list(SHEET_DETALLE, { idRecetaBase: idReceta })
      .then(function (rows) {
        loading.style.display = "none";
        wrap.style.display = "block";
        renderRows(rows);
      })
      .catch(function (err) {
        loading.style.display = "none";
        showMsg("Error al cargar: " + (err.message || err), "error");
      });
  });
})();
