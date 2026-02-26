(function () {
  var SHEET = "Listado-Productos-Elaborados";

  function showMsg(text, type) {
    var el = document.getElementById("armador-msg");
    if (!el) return;
    el.textContent = text;
    el.className = "armador-msg " + (type === "error" ? "error" : "success");
    el.style.display = "block";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var loading = document.getElementById("armador-loading");
    var wrap = document.getElementById("armador-table-wrap");
    var tbody = document.getElementById("tabla-body");
    if (!window.ArmadorAPI) {
      loading.textContent = "Error: no se cargó la API.";
      return;
    }
    window.ArmadorAPI.list(SHEET)
      .then(function (rows) {
        loading.style.display = "none";
        wrap.style.display = "block";
        tbody.innerHTML = rows.map(function (r) {
          var id = r["IDProducto"] || "";
          var costo = r["Costo-Producto-Final-Actual"] != null ? Number(r["Costo-Producto-Final-Actual"]) : "";
          if (costo !== "" && !isNaN(costo)) costo = costo.toFixed(2);
          return "<tr><td>" + (r["Orden-Lista"] != null ? r["Orden-Lista"] : "") + "</td><td>" + id + "</td><td>" + (r["Comercio-Sucursal"] || "") + "</td><td>" + (r["Nombre-Producto"] || "") + "</td><td>" + costo + "</td><td>" + (r["Habilitado"] || "") + "</td>" +
            "<td><a href=\"listado-productos-elaborados-edit.html#" + encodeURIComponent(id) + "\" class=\"armador-btn armador-btn-secondary\">Editar</a></td></tr>";
        }).join("");
      })
      .catch(function (err) {
        loading.style.display = "none";
        showMsg("Error al cargar: " + (err.message || err), "error");
      });
  });
})();
