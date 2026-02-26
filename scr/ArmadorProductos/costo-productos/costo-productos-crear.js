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
    var form = document.getElementById("form-cp");
    var selCat = document.getElementById("Categoria");
    if (!window.ArmadorAPI) return;
    ArmadorAPI.listados("Combo-Tipo-Productos").then(function (vals) {
      selCat.innerHTML = "<option value=\"\">—</option>" + (vals || []).map(function (v) { return "<option value=\"" + v + "\">" + v + "</option>"; }).join("");
    }).catch(function () {});

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var payload = {};
        fd.forEach(function (value, key) { payload[key] = value; });
        if (payload["Costo-Producto-Maestro-Total"] !== "") payload["Costo-Producto-Maestro-Total"] = parseFloat(payload["Costo-Producto-Maestro-Total"]) || "";
        if (payload["Costo-Packing"] !== "") payload["Costo-Packing"] = parseFloat(payload["Costo-Packing"]) || "";
        ArmadorAPI.create(SHEET, payload)
          .then(function (res) {
            if (res.result === "error") { showMsg(res.error || "Error al guardar", "error"); return; }
            showMsg("Registro creado.", "success");
            setTimeout(function () { window.location.href = "costo-productos.html"; }, 1200);
          })
          .catch(function (err) { showMsg("Error: " + (err.message || err), "error"); });
      });
    }
  });
})();
