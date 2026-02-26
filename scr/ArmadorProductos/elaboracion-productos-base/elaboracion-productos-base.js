(function () {
  var SHEET = "Tabla-Elaboracion-ProductosBase";

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
          var monto = r["Monto"] != null ? Number(r["Monto"]) : "";
          if (monto !== "" && !isNaN(monto)) monto = monto.toFixed(2);
          var costo = r["Costo-Produccion-ProductoBase"] != null ? Number(r["Costo-Produccion-ProductoBase"]) : "";
          if (costo !== "" && !isNaN(costo)) costo = costo.toFixed(4);
          return "<tr><td>" + (r["IDElaboracion-ProductoBase"] || "") + "</td><td>" + (r["IDReceta-Base"] || "") + "</td><td>" + (r["Cantidad"] != null ? r["Cantidad"] : "") + "</td><td>" + costo + "</td><td>" + monto + "</td></tr>";
        }).join("");
      })
      .catch(function (err) {
        loading.style.display = "none";
        showMsg("Error al cargar: " + (err.message || err), "error");
      });
  });
})();
