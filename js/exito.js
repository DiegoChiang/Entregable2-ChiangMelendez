// =========================
// Utilidades locales
// =========================
function formatMoney(n) {
  return `S/ ${(+n || 0).toFixed(2)}`;
}

// =========================
// Refs DOM
// =========================
const elYear      = document.getElementById("year");
const elOrderId   = document.getElementById("order-id");
const elTotal     = document.getElementById("ok-total");
const elEntrega   = document.getElementById("ok-entrega");
const elDireccion = document.getElementById("ok-direccion");
const tbodyItems  = document.getElementById("ok-items");

// Año en el footer
if (elYear) {
  elYear.textContent = new Date().getFullYear();
}

// =========================
// Carga de pedido y pintado
// =========================
(function initSuccessPage() {
  let pedido = getPedidoActual();

  if (!pedido) {
    const historial = getHistorial();
    if (!historial.length) {
      window.location.href = "../index.html";
      return;
    }
    pedido = historial[historial.length - 1];
  }
  if (elOrderId) {
    elOrderId.textContent = pedido.id || "—";
  }

  if (elTotal && pedido.totales) {
    elTotal.textContent = formatMoney(pedido.totales.total);
  }

  if (elEntrega && pedido.entrega) {
    elEntrega.textContent =
      pedido.entrega.tipo === "delivery"
        ? "Delivery"
        : "Recojo en local";
  }

  if (elDireccion && pedido.entrega) {
    if (pedido.entrega.tipo === "delivery") {
      const dir = [pedido.entrega.direccion, pedido.entrega.distrito]
        .filter(Boolean)
        .join(", ");
      elDireccion.textContent = dir || "—";
    } else {
      elDireccion.textContent = "Recojo en el local";
    }
  }

  if (tbodyItems) {
    tbodyItems.innerHTML = "";
    const frag = document.createDocumentFragment();

    (pedido.items || []).forEach((it) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${it.nombre}</td>
        <td>${it.presentacion} u</td>
        <td>${it.cantidad}</td>
        <td>${formatMoney(it.subtotal)}</td>
      `;
      frag.appendChild(tr);
    });

    tbodyItems.appendChild(frag);
  }
})();
