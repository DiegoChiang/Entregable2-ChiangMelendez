/* =========================
   Storage (carrito / prefs / historial / pedidoActual)
   ========================= */
const LS_KEYS = {
  carrito: "carrito",
  prefs: "preferenciasEntrega",
  historial: "historialPedidos",
  pedido: "pedidoActual"
};

function lsGet(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function lsSet(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function getCarrito() { return lsGet(LS_KEYS.carrito, []); }
function setCarrito(list) { lsSet(LS_KEYS.carrito, list); }
function clearCarrito() { localStorage.removeItem(LS_KEYS.carrito); }

function getPrefs() { return lsGet(LS_KEYS.prefs, { tipo: "recojo", direccion: "", distrito: "" }); }
function setPrefs(p) { lsSet(LS_KEYS.prefs, p); }

function getHistorial() { return lsGet(LS_KEYS.historial, []); }
function pushHistorial(pedido) { const h = getHistorial(); h.push(pedido); lsSet(LS_KEYS.historial, h); }

function setPedidoActual(p) { lsSet(LS_KEYS.pedido, p); }
function getPedidoActual() { return lsGet(LS_KEYS.pedido, null); }
function clearPedidoActual() { localStorage.removeItem(LS_KEYS.pedido); }
