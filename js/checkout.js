/* =========================
   Utilidades locales
   ========================= */
function formatMoney(n) {
  return `S/ ${(+n || 0).toFixed(2)}`;
}
function generateOrderId() {
  const d = new Date();
  return `LTA-${d.getFullYear().toString().slice(-2)}${String(
    d.getMonth() + 1
  ).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${String(
    d.getHours()
  ).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}${String(
    d.getSeconds()
  ).padStart(2, "0")}`;
}

/* =========================
   Refs y carga inicial
   ========================= */
const elYear = document.getElementById("year");
if (elYear) elYear.textContent = new Date().getFullYear();

const form = document.getElementById("checkout-form");
const resumeBody = document.getElementById("resume-items");
const rSubtotal = document.getElementById("resume-subtotal");
const rDesc = document.getElementById("resume-descuento");
const rEnvio = document.getElementById("resume-envio");
const rTotal = document.getElementById("resume-total");

const radioRecojo = document.getElementById("entrega-recojo");
const radioDelivery = document.getElementById("entrega-delivery");
const deliveryBox = document.getElementById("delivery-fields");
const dirCalle = document.getElementById("dir-calle");
const dirDistrito = document.getElementById("dir-distrito");

/* =========================
   Helpers de errores en campos
   ========================= */
function clearFieldError(input) {
  if (!input) return;
  input.classList.remove("input-error");
  const msg = input.parentElement.querySelector(".field-error");
  if (msg) msg.remove();
}

function setFieldError(input, message) {
  if (!input) return;
  clearFieldError(input);
  input.classList.add("input-error");
  const small = document.createElement("small");
  small.className = "field-error";
  small.textContent = message;
  input.parentElement.appendChild(small);
}

/* =========================
   Render de resumen
   ========================= */
function envioPorTipo(tipo) {
  return tipo === "delivery" ? 8 : 0;
}

function renderResumen(tipoEntrega) {
  const cart = getCarrito();
  resumeBody.innerHTML = "";

  if (!cart.length) {
    form.querySelector('button[type="submit"]').disabled = true;
    return;
  }
  form.querySelector('button[type="submit"]').disabled = false;

  const frag = document.createDocumentFragment();
  cart.forEach((it) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${it.nombre}</td><td>${it.presentacion} u</td><td>${
      it.cantidad
    }</td><td>${formatMoney(it.subtotal)}</td>`;
    frag.appendChild(tr);
  });
  resumeBody.appendChild(frag);

  const subtotal = +cart
    .reduce((a, it) => a + (Number(it.subtotal) || 0), 0)
    .toFixed(2);
  const descuento = 0;
  const envio = envioPorTipo(tipoEntrega);
  const total = +(subtotal - descuento + envio).toFixed(2);

  rSubtotal.textContent = formatMoney(subtotal);
  rDesc.textContent = formatMoney(descuento);
  rEnvio.textContent = formatMoney(envio);
  rTotal.textContent = formatMoney(total);
}

/* =========================
   Eventos de entrega
   ========================= */
function applyEntregaUI() {
  const tipo = radioDelivery.checked ? "delivery" : "recojo";
  deliveryBox.hidden = tipo !== "delivery";

  if (tipo !== "delivery") {
    clearFieldError(dirCalle);
    clearFieldError(dirDistrito);
  }

  renderResumen(tipo);
}

radioRecojo.addEventListener("change", applyEntregaUI);
radioDelivery.addEventListener("change", applyEntregaUI);

/* =========================
   Submit
   ========================= */
form.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const tipo = radioDelivery.checked ? "delivery" : "recojo";

  // limpiar errores anteriores
  clearFieldError(dirCalle);
  clearFieldError(dirDistrito);

  if (tipo === "delivery") {
    const dir = (dirCalle.value || "").trim();
    const dis = (dirDistrito.value || "").trim();
    let hasError = false;

    // Primero validamos distrito (para que se resalte su casilla cuando está mal)
    if (dis.length < 3) {
      setFieldError(
        dirDistrito,
        "Ingresa un distrito de al menos 3 caracteres."
      );
      if (!hasError) {
        dirDistrito.focus();
      }
      hasError = true;
    }

    // Luego validamos dirección
    if (dir.length < 5) {
      setFieldError(
        dirCalle,
        "Ingresa una dirección de al menos 5 caracteres."
      );
      if (!hasError) {
        dirCalle.focus();
      }
      hasError = true;
    }

    if (hasError) return;
  }

  const carrito = getCarrito();
  if (!carrito.length) {
    location.href = "../index.html";
    return;
  }

  const subtotal = +carrito
    .reduce((a, it) => a + (Number(it.subtotal) || 0), 0)
    .toFixed(2);
  const descuento = 0;
  const envio = envioPorTipo(tipo);
  const total = +(subtotal - descuento + envio).toFixed(2);

  const pedido = {
    id: generateOrderId(),
    fechaISO: new Date().toISOString(),
    items: carrito,
    totales: { subtotal, descuento, envio, total },
    entrega: {
      tipo,
      direccion: tipo === "delivery" ? (dirCalle.value || "").trim() : "",
      distrito: tipo === "delivery" ? (dirDistrito.value || "").trim() : "",
    },
    pago:
      document.querySelector('input[name="pago"]:checked')?.value || "efectivo",
  };

  setPrefs({
    tipo,
    direccion: pedido.entrega.direccion,
    distrito: pedido.entrega.distrito,
  });
  setPedidoActual(pedido);
  pushHistorial(pedido);
  clearCarrito();

  location.href = "exito.html";
});

/* =========================
   Inicio
   ========================= */
(function init() {
  const prefs = getPrefs();
  if (prefs?.tipo === "delivery") radioDelivery.checked = true;
  if (prefs?.direccion) dirCalle.value = prefs.direccion;
  if (prefs?.distrito) dirDistrito.value = prefs.distrito;
  applyEntregaUI();
})();
