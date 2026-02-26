(function () {
  var SHEET = "Tabla-Costo-Productos";

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
    var names = ["IDCosto-Producto", "Categoria", "Producto", "Costo-Producto-Maestro-Total", "Costo-Packing", "Habilitado"];
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
    var form = document.getElementById("form-cp");
    var selCat = document.getElementById("Categoria");
    if (!id) { loading.textContent = "Falta id en la URL."; return; }
    if (!window.ArmadorAPI) { loading.textContent = "Error: no se cargó la API."; return; }

    ArmadorAPI.listados("Combo-Tipo-Productos").then(function (vals) {
      selCat.innerHTML = "<option value=\"\">—</option>" + (vals || []).map(function (v) { return "<option value=\"" + v + "\">" + v + "</option>"; }).join("");
    }).catch(function () {});

    ArmadorAPI.list(SHEET)
      .then(function (rows) {
        var row = rows.find(function (r) { return String(r["IDCosto-Producto"] || "").trim() === String(id).trim(); });
        loading.style.display = "none";
        if (!row) { showMsg("Registro no encontrado.", "error"); return; }
        form.style.display = "block";
        setFormValues(row);
        if (selCat) selCat.value = row["Categoria"] || "";
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
        if (payload["Costo-Producto-Maestro-Total"] !== "") payload["Costo-Producto-Maestro-Total"] = parseFloat(payload["Costo-Producto-Maestro-Total"]) || "";
        if (payload["Costo-Packing"] !== "") payload["Costo-Packing"] = parseFloat(payload["Costo-Packing"]) || "";
        payload["IDCosto-Producto"] = id;
        ArmadorAPI.update(SHEET, payload)
          .then(function (res) {
            if (res.result === "error") { showMsg(res.error || "Error al guardar", "error"); return; }
            showMsg("Registro actualizado.", "success");
            setTimeout(function () { window.location.href = "costo-productos.html"; }, 1200);
          })
          .catch(function (err) { showMsg("Error: " + (err.message || err), "error"); });
      });
    }
  });
})();
