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
    var form = document.getElementById("form-pe");
    var selSuc = document.getElementById("Comercio-Sucursal");
    if (!window.ArmadorAPI) return;
    ArmadorAPI.listados("Combo-Comercio-Sucursal").then(function (vals) {
      selSuc.innerHTML = "<option value=\"\">—</option>" + (vals || []).map(function (v) { return "<option value=\"" + v + "\">" + v + "</option>"; }).join("");
    }).catch(function () {});

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var payload = {};
        fd.forEach(function (value, key) { payload[key] = value; });
        if (payload["Costo-Producto-Final-Actual"] !== "") payload["Costo-Producto-Final-Actual"] = parseFloat(payload["Costo-Producto-Final-Actual"]) || "";
        ArmadorAPI.create(SHEET, payload)
          .then(function (res) {
            if (res.result === "error") { showMsg(res.error || "Error al guardar", "error"); return; }
            showMsg("Producto creado.", "success");
            setTimeout(function () { window.location.href = "productos-elaborados.html"; }, 1200);
          })
          .catch(function (err) { showMsg("Error: " + (err.message || err), "error"); });
      });
    }
  });
})();
