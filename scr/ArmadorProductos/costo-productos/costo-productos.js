(function () {
  var SHEET = "Tabla-Costo-Productos";

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
          var id = r["IDCosto-Producto"] || "";
          var tot = r["Costo-Producto-Maestro-Total"] != null ? Number(r["Costo-Producto-Maestro-Total"]) : "";
          if (tot !== "" && !isNaN(tot)) tot = tot.toFixed(2);
          var pack = r["Costo-Packing"] != null ? Number(r["Costo-Packing"]) : "";
          if (pack !== "" && !isNaN(pack)) pack = pack.toFixed(2);
          return "<tr><td>" + id + "</td><td>" + (r["Categoria"] || "") + "</td><td>" + (r["Producto"] || "") + "</td><td>" + tot + "</td><td>" + pack + "</td><td>" + (r["Habilitado"] || "") + "</td>" +
            "<td><a href=\"costo-productos-edit.html#" + encodeURIComponent(id) + "\" class=\"armador-btn armador-btn-secondary\">Editar</a></td></tr>";
        }).join("");
      })
      .catch(function (err) {
        loading.style.display = "none";
        showMsg("Error al cargar: " + (err.message || err), "error");
      });
  });
})();
