(function () {
  var SHEET = "Listado-Productos-Elaborados";

  function getQueryId() {
    var m = /[?&]id=([^&]+)/.exec(window.location.search);
    if (m) return decodeURIComponent(m[1]);
    var h = (window.location.hash || "").replace(/^#/, "");
    return h ? decodeURIComponent(h) : "";
  }

  function showMsg(text, type) {
    var el = document.getElementById("armador-msg");
    if (!el) return;
    el.textContent = text;
    el.className = "armador-msg " + (type === "error" ? "error" : "success");
    el.style.display = "block";
  }

  function setFormValues(row) {
    var names = ["IDProducto", "Comercio-Sucursal", "Nombre-Producto", "Costo-Producto-Final-Actual", "Habilitado", "Observaciones"];
    names.forEach(function (name) {
      var el = document.querySelector("[name=\"" + name + "\"]");
      if (!el) return;
      var val = row[name] != null ? row[name] : "";
      if (el.type === "number") el.value = val === "" ? "" : val;
      else el.value = String(val);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var id = getQueryId();
    var loading = document.getElementById("armador-loading");
    var form = document.getElementById("form-lpe");
    var selSuc = document.getElementById("Comercio-Sucursal");
    if (!id) { loading.textContent = "Falta id en la URL."; return; }
    if (!window.ArmadorAPI) { loading.textContent = "Error: no se cargó la API."; return; }

    ArmadorAPI.listados("Combo-Comercio-Sucursal").then(function (vals) {
      selSuc.innerHTML = "<option value=\"\">—</option>" + (vals || []).map(function (v) { return "<option value=\"" + v + "\">" + v + "</option>"; }).join("");
    }).catch(function () {});

    ArmadorAPI.list(SHEET)
      .then(function (rows) {
        var row = rows.find(function (r) { return String(r["IDProducto"] || "").trim() === String(id).trim(); });
        loading.style.display = "none";
        if (!row) { showMsg("Registro no encontrado.", "error"); return; }
        form.style.display = "block";
        setFormValues(row);
        if (selSuc) selSuc.value = row["Comercio-Sucursal"] || "";
      })
      .catch(function (err) {
        loading.style.display = "none";
        showMsg("Error al cargar: " + (err.message || err), "error");
      });

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var payload = {};
        fd.forEach(function (value, key) { payload[key] = value; });
        if (payload["Costo-Producto-Final-Actual"] !== "") payload["Costo-Producto-Final-Actual"] = parseFloat(payload["Costo-Producto-Final-Actual"]) || "";
        payload["IDProducto"] = id;
        ArmadorAPI.update(SHEET, payload)
          .then(function (res) {
            if (res.result === "error") { showMsg(res.error || "Error al guardar", "error"); return; }
            showMsg("Registro actualizado.", "success");
            setTimeout(function () { window.location.href = "listado-productos-elaborados.html"; }, 1200);
          })
          .catch(function (err) { showMsg("Error: " + (err.message || err), "error"); });
      });
    }
  });
})();
