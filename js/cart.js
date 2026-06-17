/* =====================================================================
   ADDWARE — Carrito de compras → pedido por WhatsApp
   Estado en localStorage (persiste entre páginas). Se autoinicializa.
   ===================================================================== */
(function () {
  "use strict";
  const KEY = "addware_cart_v1";

  const parseP = s => parseInt(String(s == null ? "0" : s).replace(/\D/g, ""), 10) || 0;
  const fmt = n => n.toLocaleString("es-AR");
  const prod = id => (window.findProducto ? window.findProducto(id) : null);

  let cart = load();
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save() { localStorage.setItem(KEY, JSON.stringify(cart)); }

  const count = () => cart.reduce((a, i) => a + i.qty, 0);
  const total = () => cart.reduce((a, i) => { const p = prod(i.id); return a + (p ? parseP(p.precio) : 0) * i.qty; }, 0);

  function add(id, qty) {
    qty = qty || 1;
    const it = cart.find(i => i.id === id);
    if (it) it.qty += qty; else cart.push({ id: id, qty: qty });
    save(); render(); bump(); toast("Agregado al carrito ✔");
  }
  function setQty(id, q) {
    const it = cart.find(i => i.id === id); if (!it) return;
    it.qty = q; if (it.qty <= 0) cart = cart.filter(i => i.id !== id);
    save(); render();
  }
  function remove(id) { cart = cart.filter(i => i.id !== id); save(); render(); }
  function clear() { cart = []; save(); render(); }

  /* ---------- Mensaje de WhatsApp ---------- */
  function waOrder() {
    const lines = cart.map((i, idx) => {
      const p = prod(i.id); if (!p) return "";
      return `${idx + 1}) ${p.nombre}\n    ${i.qty} x $${fmt(parseP(p.precio))} = $${fmt(parseP(p.precio) * i.qty)}`;
    }).filter(Boolean);
    const msg =
      "¡Hola Addware! 🛒 Quiero hacer este pedido:\n\n" +
      lines.join("\n") +
      `\n\n*TOTAL: $${fmt(total())}* (precio contado / transferencia)\n\n` +
      "Mi nombre es: \nForma de pago: \n¿Retiro en local o envío?: ";
    return window.waLink(msg);
  }

  /* ===================== UI ===================== */
  let drawer, overlay, badgeEl, btnEl, toastEl, itemsEl, totalEl, checkoutEl, countPill;

  function buildUI() {
    // Botón de carrito en la nav (dentro de .nav-actions junto al burger)
    const nav = document.querySelector(".nav");
    if (nav) {
      let actions = nav.querySelector(".nav-actions");
      if (!actions) {
        actions = document.createElement("div");
        actions.className = "nav-actions";
        const burger = nav.querySelector(".burger");
        nav.appendChild(actions);
        if (burger) actions.appendChild(burger); // mover burger adentro
      }
      btnEl = document.createElement("button");
      btnEl.className = "cart-btn";
      btnEl.setAttribute("aria-label", "Abrir carrito");
      btnEl.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>' +
        '<span class="cart-badge hidden">0</span>';
      actions.insertBefore(btnEl, actions.firstChild);
      badgeEl = btnEl.querySelector(".cart-badge");
      btnEl.addEventListener("click", open);
    }

    // Overlay + Drawer
    overlay = document.createElement("div");
    overlay.className = "cart-overlay";
    overlay.addEventListener("click", close);

    drawer = document.createElement("aside");
    drawer.className = "cart-drawer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-label", "Carrito de compras");
    drawer.innerHTML =
      '<div class="cart-head"><h3>🛒 Tu pedido <span class="count-pill"></span></h3>' +
      '<button class="cart-close" aria-label="Cerrar">&times;</button></div>' +
      '<div class="cart-items"></div>' +
      '<div class="cart-foot">' +
      '  <div class="cart-total"><b>Total</b><span>$0</span></div>' +
      '  <p class="note">Precio contado / transferencia. El pedido se confirma por WhatsApp.</p>' +
      '  <a class="btn btn--wa btn--block cart-checkout" target="_blank" rel="noopener">Finalizar pedido por WhatsApp</a>' +
      '  <button class="cart-clear">Vaciar carrito</button>' +
      "</div>";

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    itemsEl = drawer.querySelector(".cart-items");
    totalEl = drawer.querySelector(".cart-total span");
    checkoutEl = drawer.querySelector(".cart-checkout");
    countPill = drawer.querySelector(".count-pill");
    drawer.querySelector(".cart-close").addEventListener("click", close);
    drawer.querySelector(".cart-clear").addEventListener("click", clear);

    // Delegación: +/- / quitar
    itemsEl.addEventListener("click", e => {
      const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]"), rem = e.target.closest("[data-rem]");
      if (inc) { const id = inc.dataset.inc; const it = cart.find(i => i.id === id); setQty(id, (it ? it.qty : 0) + 1); }
      else if (dec) { const id = dec.dataset.dec; const it = cart.find(i => i.id === id); setQty(id, (it ? it.qty : 0) - 1); }
      else if (rem) { remove(rem.dataset.rem); }
    });

    // Toast
    toastEl = document.createElement("div");
    toastEl.className = "cart-toast";
    document.body.appendChild(toastEl);

    // Botones "Agregar al carrito" de toda la página
    document.body.addEventListener("click", e => {
      const a = e.target.closest("[data-add]");
      if (a) { e.preventDefault(); add(a.getAttribute("data-add")); }
    });

    // Cerrar con ESC
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }

  function open() { render(); overlay.classList.add("open"); drawer.classList.add("open"); document.body.style.overflow = "hidden"; }
  function close() { overlay.classList.remove("open"); drawer.classList.remove("open"); document.body.style.overflow = ""; }

  let bumpT;
  function bump() { if (!btnEl) return; btnEl.classList.add("bump"); clearTimeout(bumpT); bumpT = setTimeout(() => btnEl.classList.remove("bump"), 400); }

  let toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.innerHTML = '<span class="ico">●</span>' + msg;
    toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("show"), 1800);
  }

  /* ---------- Render ---------- */
  function render() {
    const c = count();
    if (badgeEl) { badgeEl.textContent = c; badgeEl.classList.toggle("hidden", c === 0); }
    if (!drawer) return;
    if (countPill) countPill.textContent = c ? `${c} item${c !== 1 ? "s" : ""}` : "";

    if (!cart.length) {
      itemsEl.innerHTML =
        '<div class="cart-empty"><div class="big">🛒</div><h3>Tu carrito está vacío</h3>' +
        '<p style="color:var(--gris);margin-top:6px">Agregá productos del catálogo para armar tu pedido.</p>' +
        '<a class="btn btn--primary" href="catalogo.html">Ver catálogo</a></div>';
      totalEl.textContent = "$0";
      checkoutEl.classList.add("is-disabled");
      checkoutEl.removeAttribute("href");
      checkoutEl.style.opacity = ".5"; checkoutEl.style.pointerEvents = "none";
      return;
    }

    itemsEl.innerHTML = cart.map(i => {
      const p = prod(i.id);
      if (!p) return "";
      const unit = parseP(p.precio);
      const media = p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}">` : "🖥️";
      return `<div class="cart-item">
        <div class="ci-img">${media}</div>
        <div class="ci-info">
          <strong>${p.nombre}</strong>
          <span class="ci-unit">$${fmt(unit)} c/u</span>
          <div class="ci-qty">
            <button data-dec="${i.id}" aria-label="Restar">−</button>
            <span>${i.qty}</span>
            <button data-inc="${i.id}" aria-label="Sumar">+</button>
          </div>
        </div>
        <div class="ci-right">
          <button class="ci-remove" data-rem="${i.id}" aria-label="Quitar">🗑</button>
          <span class="ci-sub">$${fmt(unit * i.qty)}</span>
        </div>
      </div>`;
    }).join("");

    totalEl.textContent = "$" + fmt(total());
    checkoutEl.style.opacity = ""; checkoutEl.style.pointerEvents = "";
    checkoutEl.setAttribute("href", waOrder());
  }

  /* ---------- Init ---------- */
  buildUI();
  render();
  window.AddwareCart = { add, open, close, clear, count };
})();
