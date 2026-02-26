(function () {
  var SHEET = "Tabla-Costos-ProductoUnitario";

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
          var id = r["IDCosto-ProductoUnitario"] || "";
          var costo = r["Costo-Elaboracion-Actual"] != null ? Number(r["Costo-Elaboracion-Actual"]) : "";
          if (costo !== "" && !isNaN(costo)) costo = costo.toFixed(2);
          return "<tr><td>" + id + "</td><td>" + (r["Nombre-Producto"] || "") + "</td><td>" + (r["IDElaboracion-ProductoBase"] || "") + "</td><td>" + costo + "</td><td>" + (r["Habilitado"] || "") + "</td>" +
            "<td><a href=\"costos-producto-unitario-edit.html#" + encodeURIComponent(id) + "\" class=\"armador-btn armador-btn-secondary\">Editar</a></td></tr>";
        }).join("");
      })
      .catch(function (err) {
        loading.style.display = "none";
        showMsg("Error al cargar: " + (err.message || err), "error");
      });
  });
})();
