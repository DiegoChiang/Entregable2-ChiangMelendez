/* =========================
   Utilidades locales
   ========================= */
function formatMoney(n){ return `S/ ${(+n||0).toFixed(2)}`; }
function presentLabel(x){ return `${x} u`; }
function clampQty(q, min=1, max=99){ const n=Math.floor(Number(q)); return Math.min(Math.max(n||min,min),max); }
function normalizeText(s){ return String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim(); }

/* =========================
   Estado y referencias
   ========================= */
const elYear = document.getElementById("year");
if (elYear) elYear.textContent = new Date().getFullYear();

const cardsContainer = document.getElementById("cards-container");
const tabs = document.querySelectorAll(".tab");
const searchInput = document.getElementById("search-input");
const searchClear = document.getElementById("search-clear");
const cartCount = document.getElementById("cart-count");

let filtroCat = "todas";
let filtroTexto = "";

/* =========================
   Render de catálogo
   ========================= */
function precioPorPresentacion(p, pres){ return p?.precios?.[pres] ?? 0; }

function renderProductos(lista){
  cardsContainer.setAttribute("aria-busy","true");
  cardsContainer.innerHTML = "";

  const frag = document.createDocumentFragment();

  lista.forEach(p => {
    const presKeys = Object.keys(p.precios).map(Number).sort((a,b)=>a-b);
    const presDefault = presKeys[0];

    const card = document.createElement("article");
    card.className = "card";

    const imgBox = document.createElement("div");
    imgBox.className = "card-img";
    const img = document.createElement("img");
    img.src = p.imagen;
    img.alt = `Trufa ${p.nombre}`;
    imgBox.appendChild(img);

    const body = document.createElement("div");
    body.className = "card-body";
    const h3 = document.createElement("h3");
    h3.className = "card-title";
    h3.textContent = p.nombre;
    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.textContent = `Categoría: ${p.categoria.charAt(0).toUpperCase()+p.categoria.slice(1)}`;
    body.append(h3, meta);

    const controls = document.createElement("div");
    controls.className = "controls";
    const select = document.createElement("select");
    select.setAttribute("aria-label","Presentación");
    presKeys.forEach(k=>{
      const opt=document.createElement("option");
      opt.value=k; opt.textContent=presentLabel(k);
      if(k===presDefault) opt.selected=true;
      select.appendChild(opt);
    });

    const qty = document.createElement("input");
    qty.type="number"; qty.min="1"; qty.max="99"; qty.value="1";
    qty.setAttribute("aria-label","Cantidad");

    controls.append(select, qty);

    const footer = document.createElement("div");
    footer.className = "card-footer";
    const price = document.createElement("strong");
    price.textContent = formatMoney(precioPorPresentacion(p, presDefault));
    const btn = document.createElement("button");
    btn.className = "btn btn-primary";
    btn.type = "button";
    btn.textContent = "Agregar al carrito";

    footer.append(price, btn);

    card.append(imgBox, body, controls, footer);
    frag.appendChild(card);

    select.addEventListener("change", ()=>{
      price.textContent = formatMoney(precioPorPresentacion(p, Number(select.value)));
    });

    qty.addEventListener("input", ()=>{ qty.value = String(clampQty(qty.value)); });

    btn.addEventListener("click", ()=>{
      const presentacion = Number(select.value);
      const cantidad = clampQty(qty.value);
      const unit = precioPorPresentacion(p, presentacion);
      const subtotal = +(unit * cantidad).toFixed(2);

      let carrito = getCarrito();

      const idx = carrito.findIndex(it => it.id===p.id && Number(it.presentacion)===presentacion);
      if (idx>=0){
        const it = carrito[idx];
        it.cantidad = clampQty(it.cantidad + cantidad);
        it.precioUnitario = unit;
        it.subtotal = +(it.cantidad * unit).toFixed(2);
        carrito[idx] = it;
      } else {
        carrito.push({
          id: p.id,
          nombre: p.nombre,
          categoria: p.categoria,
          imagen: p.imagen,
          presentacion,
          precioUnitario: unit,
          cantidad,
          subtotal
        });
      }
      setCarrito(carrito);
      updateCartBadge();

      btn.disabled = true;
      const old = btn.textContent;
      btn.textContent = "Agregado ✓";
      setTimeout(()=>{ btn.textContent = old; btn.disabled = false; }, 900);
    });
  });

  cardsContainer.appendChild(frag);
  cardsContainer.setAttribute("aria-busy","false");
}

/* =========================
   Filtro y búsqueda
   ========================= */
function aplicaFiltros(){
  const list = CATALOGO.filter(p=>{
    const catOK = (filtroCat==="todas") || (p.categoria===filtroCat);
    const txtOK = !filtroTexto ||
      normalizeText(p.nombre).includes(filtroTexto) ||
      normalizeText(p.categoria).includes(filtroTexto);
    return catOK && txtOK;
  });
  document.getElementById("empty-state").hidden = list.length>0;
  renderProductos(list);
}

tabs.forEach(b=>{
  b.addEventListener("click", ()=>{
    tabs.forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    filtroCat = b.dataset.filter || "todas";
    aplicaFiltros();
  });
});

if (searchInput){
  searchInput.addEventListener("input", ()=>{
    filtroTexto = normalizeText(searchInput.value);
    aplicaFiltros();
  });
}
if (searchClear){
  searchClear.addEventListener("click", ()=>{
    searchInput.value = "";
    filtroTexto = "";
    aplicaFiltros();
    searchInput.focus();
  });
}

/* =========================
   Badge carrito y carga inicial
   ========================= */
function updateCartBadge(){
  const n = getCarrito().reduce((a,it)=>a+Number(it.cantidad||0),0);
  if (cartCount) cartCount.textContent = String(n);
}
updateCartBadge();
aplicaFiltros();
