/* =====================================================================
   ADDWARE — Motor de catálogo: buscador + filtros + render
   ===================================================================== */
(function () {
  "use strict";
  const PRODUCTOS = window.PRODUCTOS || [];
  const CATEGORIAS = window.CATEGORIAS || [];
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;

  const searchInput = document.getElementById("searchInput");
  const filtersWrap = document.getElementById("filters");
  const countEl = document.getElementById("catalogCount");

  let estado = { q: "", cat: "todos" };

  const catMap = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const nombreCat = id => (catMap[id] ? catMap[id].nombre : id);
  const iconoCat = id => (catMap[id] ? catMap[id].icono : "📦");

  /* ---------- Filtros (chips) ---------- */
  function renderFiltros() {
    if (!filtersWrap) return;
    const chips = [`<button class="filter-chip active" data-cat="todos">Todos</button>`];
    CATEGORIAS.forEach(c => {
      // sólo mostrar categorías que tengan al menos un producto
      if (PRODUCTOS.some(p => p.categoria === c.id)) {
        chips.push(`<button class="filter-chip" data-cat="${c.id}"><span>${c.icono}</span>${c.nombre}</button>`);
      }
    });
    filtersWrap.innerHTML = chips.join("");
    filtersWrap.querySelectorAll(".filter-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        filtersWrap.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        estado.cat = btn.dataset.cat;
        render();
      });
    });
  }

  /* ---------- Bloque de precio ---------- */
  function precioHTML(p) {
    if (!p.precio) return "";
    const lista = p.precioLista && p.precioLista !== p.precio
      ? `<span class="list">Lista <b>$${p.precioLista}</b></span>` : "";
    return `<div class="prod-price"><span class="now">$${p.precio}<small>Contado / transf.</small></span>${lista}</div>`;
  }

  /* ---------- Card de producto ---------- */
  function cardHTML(p) {
    const media = p.imagen
      ? `<img src="${p.imagen}" alt="${p.nombre}" loading="lazy"
             onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'><div class=\\'ph-ico\\'>${iconoCat(p.categoria)}</div><small>FOTO PRÓXIMAMENTE</small></div>'">`
      : `<div class="placeholder"><div class="ph-ico">${iconoCat(p.categoria)}</div><small>FOTO PRÓXIMAMENTE</small></div>`;

    const url = window.urlProducto(p);
    const id = window.productoId(p);
    return `
      <article class="prod-card reveal">
        <a class="prod-media" href="${url}" aria-label="Ver ${p.nombre}">
          <span class="prod-cat">${nombreCat(p.categoria)}</span>
          ${media}
        </a>
        <div class="prod-body">
          ${p.marca ? `<span class="prod-marca">${p.marca}</span>` : ""}
          <a class="prod-title" href="${url}"><h3>${p.nombre}</h3></a>
          <p>${p.descripcion || ""}</p>
          ${precioHTML(p)}
          <div class="prod-actions">
            <button class="btn btn--primary btn--add" style="flex:1" data-add="${id}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              Agregar
            </button>
            <a class="btn btn--wa" aria-label="Consultar por WhatsApp" target="_blank" rel="noopener" href="${window.waProducto(p.nombre)}">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor"><path d="M16 .5C7.5.5.6 7.4.6 15.9c0 2.8.7 5.4 2.1 7.8L.5 31.5l8-2.1c2.3 1.3 4.9 1.9 7.5 1.9 8.5 0 15.4-6.9 15.4-15.4S24.5.5 16 .5z"/></svg>
            </a>
          </div>
          <a class="prod-detail-link" href="${url}">Ver más información →</a>
        </div>
      </article>`;
  }

  /* ---------- Filtrado + render ---------- */
  function filtrar() {
    const q = estado.q.trim().toLowerCase();
    return PRODUCTOS.filter(p => {
      const okCat = estado.cat === "todos" || p.categoria === estado.cat;
      const okQ = !q ||
        [p.nombre, p.marca, nombreCat(p.categoria), p.descripcion]
          .filter(Boolean).join(" ").toLowerCase().includes(q);
      return okCat && okQ;
    });
  }

  function render() {
    const items = filtrar();
    if (countEl) {
      countEl.textContent = items.length === PRODUCTOS.length
        ? `${items.length} producto${items.length !== 1 ? "s" : ""}`
        : `${items.length} de ${PRODUCTOS.length} producto${PRODUCTOS.length !== 1 ? "s" : ""}`;
    }

    if (!items.length) {
      grid.innerHTML = `
        <div class="no-results" style="grid-column:1/-1">
          <div class="big">🔍</div>
          <h3>No encontramos productos</h3>
          <p>Probá con otra palabra o consultanos directo por WhatsApp.</p>
          <a class="btn btn--wa" style="margin-top:18px" target="_blank" rel="noopener"
             href="${window.waLink('Hola Addware! Busco un producto que no veo en la web, ¿me ayudan?')}">
             Consultar por WhatsApp</a>
        </div>`;
      return;
    }

    grid.innerHTML = items.map(cardHTML).join("");
    // re-activar scroll reveal sobre las nuevas cards
    grid.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
  }

  /* ---------- Eventos ---------- */
  if (searchInput) {
    let t;
    searchInput.addEventListener("input", e => {
      clearTimeout(t);
      t = setTimeout(() => { estado.q = e.target.value; render(); }, 120);
    });
  }

  /* ---------- Soporte de filtro por URL (?cat=gaming) ---------- */
  const urlCat = new URLSearchParams(location.search).get("cat");
  if (urlCat && catMap[urlCat]) estado.cat = urlCat;

  renderFiltros();
  if (estado.cat !== "todos" && filtersWrap) {
    const b = filtersWrap.querySelector(`[data-cat="${estado.cat}"]`);
    if (b) { filtersWrap.querySelectorAll(".filter-chip").forEach(x => x.classList.remove("active")); b.classList.add("active"); }
  }
  render();
})();
