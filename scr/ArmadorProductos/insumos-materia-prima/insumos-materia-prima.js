(function () {
  var SHEET = "Tabla-Insumo-Materia-Prima";

  function showMsg(text, type) {
    var el = document.getElementById("armador-msg");
    if (!el) return;
    el.textContent = text;
    el.className = "armador-msg " + (type === "error" ? "error" : "success");
    el.style.display = "block";
  }

  function hideMsg() {
    var el = document.getElementById("armador-msg");
    if (el) el.style.display = "none";
  }

  function renderRows(rows) {
    var tbody = document.getElementById("tabla-materia-prima-body");
    if (!tbody) return;
    tbody.innerHTML = rows
      .map(function (r) {
        var id = r["IDInsumo-MateriaPrima"] || r.IDInsumo_MateriaPrima || "";
        var precio = r["Precio-Actual"] != null ? Number(r["Precio-Actual"]) : "";
        if (precio !== "" && !isNaN(precio)) precio = precio.toFixed(2);
        return (
          "<tr>" +
          "<td>" + (id || "") + "</td>" +
          "<td>" + (r.Categoria || "") + "</td>" +
          "<td>" + (r["Nombre-Producto"] || r.Nombre_Producto || "") + "</td>" +
          "<td>" + precio + "</td>" +
          "<td>" + (r.Habilitado || "") + "</td>" +
          '<td><a href="insumos-materia-prima-edit.html#' + encodeURIComponent(id) + '" class="armador-btn armador-btn-secondary">Editar</a></td>' +
          "</tr>"
        );
      })
      .join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var loading = document.getElementById("armador-loading");
    var wrap = document.getElementById("armador-table-wrap");

    if (!window.ArmadorAPI) {
      loading.textContent = "Error: no se cargó la API (config.js y armador-api.js).";
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
