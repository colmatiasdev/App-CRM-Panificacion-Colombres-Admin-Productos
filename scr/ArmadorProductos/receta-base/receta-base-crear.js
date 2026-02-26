(function () {
  var SHEET = "Tabla-Receta-Base";

  function showMsg(text, type) {
    var el = document.getElementById("armador-msg");
    if (!el) return;
    el.textContent = text;
    el.className = "armador-msg " + (type === "error" ? "error" : "success");
    el.style.display = "block";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("form-receta-base");
    if (!form || !window.ArmadorAPI) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var payload = {};
      fd.forEach(function (value, key) { payload[key] = value; });
      ["Costo-Directo-Receta", "Tiempo-Produccion-Minutos", "Costo-Mano-Obra-Produccion", "Rendimiento-Cantidad"].forEach(function (k) {
        if (payload[k] !== "") payload[k] = parseFloat(payload[k]) || "";
      });
      ArmadorAPI.create(SHEET, payload)
        .then(function (res) {
          if (res.result === "error") { showMsg(res.error || "Error al guardar", "error"); return; }
          showMsg("Receta creada. Puede agregar detalle.", "success");
          if (res.id) setTimeout(function () { window.location.href = "receta-base-detalle.html#" + encodeURIComponent(res.id); }, 1200);
          else setTimeout(function () { window.location.href = "receta-base.html"; }, 1200);
        })
        .catch(function (err) { showMsg("Error: " + (err.message || err), "error"); });
    });
  });
})();
