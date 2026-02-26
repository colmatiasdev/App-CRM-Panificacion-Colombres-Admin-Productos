(function () {
  var SHEET = "Tabla-Insumo-Packing";

  function showMsg(text, type) {
    var el = document.getElementById("armador-msg");
    if (!el) return;
    el.textContent = text;
    el.className = "armador-msg " + (type === "error" ? "error" : "success");
    el.style.display = "block";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("form-packing");
    if (!form || !window.ArmadorAPI) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var payload = {};
      fd.forEach(function (value, key) { payload[key] = value; });
      if (payload["Precio-Actual"] !== "") payload["Precio-Actual"] = parseFloat(payload["Precio-Actual"]) || "";
      if (payload["Presentacion-Cantidad-Medida"] !== "") payload["Presentacion-Cantidad-Medida"] = parseFloat(payload["Presentacion-Cantidad-Medida"]) || "";

      ArmadorAPI.create(SHEET, payload)
        .then(function (res) {
          if (res.result === "error") {
            showMsg(res.error || "Error al guardar", "error");
            return;
          }
          showMsg("Registro creado correctamente.", "success");
          setTimeout(function () { window.location.href = "insumos-packing.html"; }, 1200);
        })
        .catch(function (err) {
          showMsg("Error: " + (err.message || err), "error");
        });
    });
  });
})();
