(function () {
  var SHEET = "Tabla-Receta-Base";

  function showMsg(text, type) {
    var el = document.getElementById("armador-msg");
    if (!el) return;
    el.textContent = text;
    el.className = "armador-msg " + (type === "error" ? "error" : "success");
    el.style.display = "block";
  }

  function renderRows(rows) {
    var tbody = document.getElementById("tabla-receta-base-body");
    if (!tbody) return;
    tbody.innerHTML = rows
      .map(function (r) {
        var id = r["IDReceta-Base"] || "";
        var costo = r["Costo-Directo-Receta"] != null ? Number(r["Costo-Directo-Receta"]) : "";
        if (costo !== "" && !isNaN(costo)) costo = costo.toFixed(2);
        var rend = r["Rendimiento-Cantidad"] != null ? r["Rendimiento-Cantidad"] : "";
        return (
          "<tr>" +
          "<td>" + (id || "") + "</td>" +
          "<td>" + (r["Descripcion-Masa-Producto"] || "") + "</td>" +
          "<td>" + costo + "</td>" +
          "<td>" + rend + "</td>" +
          "<td>" +
          '<a href="receta-base-detalle.html#' + encodeURIComponent(id) + '" class="armador-btn armador-btn-secondary">Detalle</a> ' +
          '<a href="receta-base-edit.html#' + encodeURIComponent(id) + '" class="armador-btn armador-btn-secondary">Editar</a>' +
          "</td></tr>"
        );
      })
      .join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var loading = document.getElementById("armador-loading");
    var wrap = document.getElementById("armador-table-wrap");
    if (!window.ArmadorAPI) {
      loading.textContent = "Error: no se cargó la API.";
      return;
    }
    window.ArmadorAPI.list(SHEET)
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
