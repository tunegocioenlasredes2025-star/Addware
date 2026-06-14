/* =====================================================================
   ADDWARE — Página de detalle de producto (producto.html?id=...)
   ===================================================================== */
(function () {
  "use strict";
  const cont = document.getElementById("productoDetail");
  if (!cont) return;

  const CATEGORIAS = window.CATEGORIAS || [];
  const catMap = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const nombreCat = id => (catMap[id] ? catMap[id].nombre : id);
  const iconoCat = id => (catMap[id] ? catMap[id].icono : "📦");

  const id = new URLSearchParams(location.search).get("id");
  const p = window.findProducto(id);

  /* ---------- No encontrado ---------- */
  if (!p) {
    cont.innerHTML = `
      <div class="pd-notfound">
        <div class="big">🔍</div>
        <h1>Producto no encontrado</h1>
        <p style="color:var(--gris);max-width:460px;margin:12px auto 0">
          El producto que buscás no está disponible o el enlace es incorrecto.</p>
        <a class="btn btn--primary" style="margin-top:24px" href="catalogo.html">Volver al catálogo</a>
      </div>`;
    return;
  }

  /* ---------- SEO dinámico ---------- */
  document.title = `${p.nombre} | Addware Castelar`;
  const md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute("content", `${p.nombre} — ${p.descripcion || ""} Consultá por WhatsApp en Addware Castelar.`);

  const lista = p.precioLista && p.precioLista !== p.precio
    ? `<span class="list">Precio de lista / tarjeta: <b>$${p.precioLista}</b></span>` : "";

  const esConsola = p.categoria === "consolas" || p.categoria === "retro";
  const feats = [
    `<div class="pd-feat"><span class="ico">✓</span> Consultá disponibilidad y formas de pago por WhatsApp</div>`,
    `<div class="pd-feat"><span class="ico">✓</span> Retiro en el local — Gdor. Inocencio Arias 3080, Castelar</div>`,
    esConsola
      ? `<div class="pd-feat"><span class="ico">✓</span> Equipo reacondicionado y probado, con garantía</div>`
      : `<div class="pd-feat"><span class="ico">✓</span> Producto nuevo — asesoramiento técnico incluido</div>`
  ].join("");

  const media = p.imagen
    ? `<img src="${p.imagen}" alt="${p.nombre}">`
    : `<div class="placeholder"><div class="ph-ico" style="font-size:3rem">${iconoCat(p.categoria)}</div><small>FOTO PRÓXIMAMENTE</small></div>`;

  cont.innerHTML = `
    <div class="breadcrumbs" style="justify-content:flex-start">
      <a href="index.html">Inicio</a><span class="sep">/</span>
      <a href="catalogo.html">Catálogo</a><span class="sep">/</span>
      <a href="catalogo.html?cat=${p.categoria}">${nombreCat(p.categoria)}</a><span class="sep">/</span>
      <span style="color:var(--gris-claro)">${p.nombre}</span>
    </div>
    <a class="pd-back" href="catalogo.html">← Volver al catálogo</a>
    <div class="pd-grid">
      <div class="pd-media reveal visible">
        <span class="prod-cat">${nombreCat(p.categoria)}</span>
        ${media}
      </div>
      <div class="pd-info reveal visible">
        ${p.marca ? `<span class="prod-marca">${p.marca}</span>` : ""}
        <h1>${p.nombre}</h1>
        <span class="pd-chip">${iconoCat(p.categoria)} ${nombreCat(p.categoria)}</span>
        ${p.precio ? `<div class="pd-price">
          <span class="now">$${p.precio}<span>Contado / transferencia</span></span>
          ${lista}
        </div>` : ""}
        <p class="pd-desc">${p.descripcion || ""}</p>
        <div class="pd-feats">${feats}</div>
        <div class="pd-actions">
          <a class="btn btn--wa" target="_blank" rel="noopener" href="${window.waProducto(p.nombre)}">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor"><path d="M16 .5C7.5.5.6 7.4.6 15.9c0 2.8.7 5.4 2.1 7.8L.5 31.5l8-2.1c2.3 1.3 4.9 1.9 7.5 1.9 8.5 0 15.4-6.9 15.4-15.4S24.5.5 16 .5z"/></svg>
            Consultar por WhatsApp
          </a>
          <a class="btn btn--ghost" href="catalogo.html?cat=${p.categoria}">Ver más ${nombreCat(p.categoria)}</a>
        </div>
      </div>
    </div>`;

  /* ---------- Relacionados (misma categoría) ---------- */
  const rel = (window.PRODUCTOS || [])
    .filter(x => x.categoria === p.categoria && window.productoId(x) !== id)
    .slice(0, 4);

  if (rel.length) {
    const wrap = document.getElementById("relacionadosWrap");
    const grid = document.getElementById("relacionados");
    wrap.style.display = "";
    grid.innerHTML = rel.map(r => {
      const url = window.urlProducto(r);
      const rlista = r.precioLista && r.precioLista !== r.precio ? `<span class="list">Lista <b>$${r.precioLista}</b></span>` : "";
      const rmedia = r.imagen ? `<img src="${r.imagen}" alt="${r.nombre}" loading="lazy">`
        : `<div class="placeholder"><div class="ph-ico">${iconoCat(r.categoria)}</div><small>FOTO PRÓXIMAMENTE</small></div>`;
      return `<article class="prod-card reveal visible">
        <a class="prod-media" href="${url}" aria-label="Ver ${r.nombre}"><span class="prod-cat">${nombreCat(r.categoria)}</span>${rmedia}</a>
        <div class="prod-body">
          ${r.marca ? `<span class="prod-marca">${r.marca}</span>` : ""}
          <a class="prod-title" href="${url}"><h3>${r.nombre}</h3></a>
          ${r.precio ? `<div class="prod-price"><span class="now">$${r.precio}<small>Contado / transf.</small></span>${rlista}</div>` : ""}
          <a class="btn btn--wa btn--block" target="_blank" rel="noopener" href="${window.waProducto(r.nombre)}">Consultar</a>
          <a class="prod-detail-link" href="${url}">Ver más información →</a>
        </div></article>`;
    }).join("");
  }

  /* ---------- Scroll al inicio ---------- */
  window.scrollTo(0, 0);
})();
