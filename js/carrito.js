/* =========================
   Utilidades locales
   ========================= */
function formatMoney(n){ return `S/ ${(+n||0).toFixed(2)}`; }
function clampQty(q,min=1,max=99){ const n=Math.floor(Number(q)); return Math.min(Math.max(n||min,min),max); }
function envioEstimado(){ const prefs=getPrefs(); return (String(prefs?.tipo||"").toLowerCase()==="delivery") ? 8 : 0; }

/* =========================
   Estado y refs
   ========================= */
const elYear = document.getElementById("year");
if (elYear) elYear.textContent = new Date().getFullYear();

const tbody = document.getElementById("cart-items");
const emptyBox = document.getElementById("cart-empty");
const sumSubtotal = document.getElementById("sum-subtotal");
const sumDescuento = document.getElementById("sum-descuento");
const sumEnvio = document.getElementById("sum-envio");
const sumTotal = document.getElementById("sum-total");
const btnVaciar = document.getElementById("btn-empty-cart");

/* =========================
   Render y totales
   ========================= */
function render(){
  const list = getCarrito();
  tbody.innerHTML = "";

  if (!list.length){
    document.querySelector(".cart-table").hidden = true;
    document.querySelector(".summary").hidden = true;
    emptyBox.hidden = false;
    return;
  }

  document.querySelector(".cart-table").hidden = false;
  document.querySelector(".summary").hidden = false;
  emptyBox.hidden = true;

  const frag = document.createDocumentFragment();

  list.forEach((it, idx)=>{
    const tr = document.createElement("tr");

    const tdProd = document.createElement("td");
    tdProd.innerHTML = `<div style="display:flex;align-items:center;gap:10px">
        <img src="../${it.imagen}" alt="${it.nombre}" style="width:52px;height:52px;object-fit:cover;border-radius:8px">
        <strong>${it.nombre}</strong>
      </div>`;

    const tdPres = document.createElement("td");
    tdPres.textContent = `${it.presentacion} u`;

    const tdQty = document.createElement("td");
    const qty = document.createElement("input");
    qty.type="number"; qty.min="1"; qty.max="99"; qty.value=String(it.cantidad||1);
    tdQty.appendChild(qty);

    const tdUnit = document.createElement("td");
    tdUnit.textContent = formatMoney(it.precioUnitario);

    const tdSub = document.createElement("td");
    tdSub.textContent = formatMoney(it.subtotal);

    const tdAct = document.createElement("td");
    const rm = document.createElement("button");
    rm.className="btn"; rm.textContent="×"; rm.setAttribute("aria-label","Eliminar");
    tdAct.appendChild(rm);

    tr.append(tdProd, tdPres, tdQty, tdUnit, tdSub, tdAct);
    frag.appendChild(tr);

    qty.addEventListener("input", ()=>{
      qty.value = String(clampQty(qty.value));
    });
    qty.addEventListener("change", ()=>{
      const cart = getCarrito();
      const row = cart[idx];
      row.cantidad = clampQty(qty.value);
      row.subtotal = +(row.cantidad * row.precioUnitario).toFixed(2);
      setCarrito(cart);
      tdSub.textContent = formatMoney(row.subtotal);
      renderTotals();
    });
    rm.addEventListener("click", ()=>{
      const cart = getCarrito();
      cart.splice(idx,1);
      setCarrito(cart);
      render();
      renderTotals();
    });
  });

  tbody.appendChild(frag);
  renderTotals();
}

function renderTotals(){
  const list = getCarrito();
  const subtotal = +list.reduce((a,it)=>a+(Number(it.subtotal)||0),0).toFixed(2);
  const descuento = 0;
  const envio = envioEstimado();
  const total = +(subtotal - descuento + envio).toFixed(2);

  sumSubtotal.textContent = formatMoney(subtotal);
  sumDescuento.textContent = formatMoney(descuento);
  sumEnvio.textContent = formatMoney(envio);
  sumTotal.textContent = formatMoney(total);
}

/* =========================
   Acciones
   ========================= */
if (btnVaciar){
  btnVaciar.addEventListener("click", ()=>{
    clearCarrito();
    render();
    renderTotals();
  });
}

/* =========================
   Inicio
   ========================= */
render();