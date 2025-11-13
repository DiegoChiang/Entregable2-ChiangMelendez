# Las Trufas de Andrea — Mini e-commerce

Este proyecto es una pequeña aplicación web de catálogo y compra de trufas artesanales. Permite explorar distintos sabores, agregarlos a un carrito de compras, elegir el tipo de entrega, seleccionar el medio de pago y ver una pantalla de confirmación del pedido, todo usando **HTML, CSS y JavaScript vanilla** en el navegador.

---

## Tecnologías utilizadas

- **HTML5** para la estructura de las páginas.
- **CSS3** (archivo único de estilos) para el diseño y layout responsivo.
- **JavaScript vanilla** para la lógica de negocio y la interacción:
  - Renderizado dinámico del catálogo.
  - Gestión del carrito de compras.
  - Cálculo de totales y envío.
  - Navegación entre vistas (catálogo → carrito → checkout → éxito).
- **localStorage** para persistir carrito, preferencias de entrega y pedidos.

---

## Estructura del proyecto

- `index.html`  
  Página principal del **catálogo**. Muestra el listado de trufas, filtros por categoría, buscador y acceso rápido al carrito.   

- `carrito.html`  
  Página del **carrito de compras**. Muestra los productos agregados, permite cambiar cantidades, eliminar productos, vaciar el carrito y ver los totales con envío estimado.   

- `checkout.html`  
  Página de **checkout**. Incluye formulario para tipo de entrega (recojo o delivery), dirección (si aplica), medio de pago y un resumen de la compra con subtotal, envío y total.   

- `exito.html`  
  Página de **confirmación de pedido**. Muestra el ID del pedido, el total pagado, el tipo de entrega, la dirección (si corresponde) y el detalle de productos comprados.   

- `data/data.js`  
  Definición del catálogo (`CATALOGO`), incluyendo sabores, categoría (clásicas / especiales), imagen y precios por presentación (4, 10 y 20 unidades). :contentReference[oaicite:4]{index=4}  

- `js/catalogo.js`  
  Lógica del **catálogo**:
  - Render de tarjetas de producto (imagen, nombre, categoría, selector de presentación y cantidad).
  - Cálculo de precio según presentación.
  - Manejo de filtros por categoría y búsqueda por texto.
  - Agregado de productos al carrito y actualización del contador de items. :contentReference[oaicite:5]{index=5}  

- `js/carrito.js`  
  Lógica del **carrito**:
  - Render dinámico de filas con imagen, nombre, presentación, cantidad, precio unitario y subtotal.
  - Inputs numéricos para cambiar la cantidad.
  - Botones para eliminar un producto o vaciar el carrito completo.
  - Cálculo de subtotal, descuento (actualmente 0), envío estimado y total.
  - Estado vacío cuando no hay productos. :contentReference[oaicite:6]{index=6}  

- `js/checkout.js`  
  Lógica del **checkout**:
  - Llenado del resumen de compra a partir del carrito.
  - Cálculo del costo de envío según tipo de entrega (recojo: S/ 0, delivery: S/ 8).
  - Validación básica de dirección y distrito cuando se elige delivery.
  - Construcción del objeto de pedido (ID, fecha, items, totales, datos de entrega y medio de pago).
  - Persistencia del pedido actual, historial de pedidos y preferencias de entrega, limpieza del carrito y redirección a la página de éxito.   

- `js/exito.js`  
  Lógica de la **pantalla de éxito**:
  - Recupera el `pedidoActual` desde localStorage; si no existe, toma el último del historial.
  - Muestra ID del pedido, total pagado, tipo de entrega y dirección (o mensaje de recojo en local).
  - Renderiza una tabla con los productos comprados. :contentReference[oaicite:8]{index=8}  

- `js/storage.js`  
  Módulo de utilidades para **localStorage**:
  - Manejo centralizado de claves (`carrito`, `preferenciasEntrega`, `historialPedidos`, `pedidoActual`).
  - Funciones como `getCarrito`, `setCarrito`, `clearCarrito`, `getPrefs`, `setPrefs`, `getHistorial`, `pushHistorial`, `setPedidoActual`, `getPedidoActual`. :contentReference[oaicite:9]{index=9}  

- `css/styles.css`  
  Archivo de estilos globales para tipografía, layout, tarjetas de producto, tablas, formularios, botones, cabecera, pie de página y estados vacíos.

- `assets/img/...`  
  Imágenes utilizadas en la interfaz:
  - `logo-principal.png` y `favicon.png`.
  - `hero-trufas.jpg` para la sección principal.
  - Carpeta `trufas/` con las imágenes de cada sabor (vainilla, chocolate, oreo, chichin, nutella, manjar, etc.).   

---

## Flujo funcional

### 1. Catálogo

1. El usuario abre `index.html`.
2. Ve una grilla de productos con:
   - Imagen de la trufa.
   - Nombre y categoría.
   - Selector de presentación (4, 10 o 20 unidades).
   - Input de cantidad.
   - Precio calculado según la presentación elegida.
3. Puede:
   - Cambiar de pestaña entre **Todas**, **Clásicas** y **Especiales**.
   - Usar el buscador para filtrar por nombre o categoría.
   - Pulsar **“Agregar al carrito”** para guardar el producto en el carrito (con feedback visual).

### 2. Carrito

1. Desde el encabezado se accede a `carrito.html`.
2. Se listan todos los productos del carrito con:
   - Imagen y nombre.
   - Presentación elegida.
   - Cantidad editable.
   - Precio unitario.
   - Subtotal por línea.
3. La sección de resumen muestra:
   - Subtotal.
   - Descuento (actualmente siempre S/ 0.00).
   - Envío estimado según preferencias de entrega guardadas.
   - Total.
4. Acciones disponibles:
   - Cambiar cantidades (se recalculan subtotales y totales).
   - Eliminar un producto específico.
   - Vaciar el carrito.
   - Continuar al checkout.

### 3. Checkout

1. En `checkout.html` se muestra:
   - Formulario con opciones de entrega:
     - **Recojo en local (S/ 0)**.
     - **Delivery (S/ 8)**, que habilita campos de **Dirección** y **Distrito** con validaciones mínimas.
   - Selección de medio de pago: **Efectivo** o **Yape/Plin**.
   - Resumen de productos con subtotal, descuento, envío y total.
2. Al confirmar:
   - Si no hay productos en el carrito, se redirige al catálogo.
   - Si hay productos:
     - Se crea un objeto de pedido con:
       - ID único (formato `LTA-YYMMDD-HHMMSS`).
       - Fecha en formato ISO.
       - Items del carrito.
       - Totales (subtotal, descuento, envío, total).
       - Datos de entrega y método de pago.
     - Se guardan:
       - Preferencias de entrega.
       - Historial de pedidos.
       - Pedido actual.
     - Se limpia el carrito.
     - Se redirige a `exito.html`.   

### 4. Página de éxito

1. `exito.html` muestra:
   - Mensaje de agradecimiento.
   - ID del pedido.
   - Total pagado.
   - Tipo de entrega (Delivery o Recojo en local).
   - Dirección y distrito cuando el pedido fue delivery, o un mensaje indicando que es recojo en local.
   - Detalle en tabla de los productos (nombre, presentación, cantidad, subtotal).
2. El año en el pie de página se actualiza automáticamente según la fecha actual.   

---

## Persistencia de datos

El estado de la aplicación se mantiene entre recargas gracias a `localStorage`:

- **Carrito**: lista de productos agregados con presentación, cantidad, precio unitario y subtotal.
- **Preferencias de entrega**: tipo (recojo o delivery), dirección y distrito.
- **Historial de pedidos**: lista de todos los pedidos confirmados.
- **Pedido actual**: el último pedido confirmado, usado para completar la pantalla de éxito.

Toda la lógica de lectura/escritura se centraliza en `js/storage.js`, lo que simplifica el resto del código y evita repetir operaciones con `localStorage`.   

---

## Cómo ejecutar

1. Descarga o clona el proyecto.
2. Mantén la estructura de carpetas tal como está (HTML + `css/`, `js/`, `data/`, `assets/`).
3. Abre `index.html` en un navegador moderno.
4. Navega usando los enlaces del sitio:
   - **Catálogo** → **Carrito** → **Checkout** → **Confirmación de pedido**.

No se necesitan dependencias externas ni entorno de build: todo corre directamente en el navegador.
