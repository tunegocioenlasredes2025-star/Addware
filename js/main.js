/* =====================================================================
   ADDWARE — JS principal (común a todas las páginas)
   ===================================================================== */
(function () {
  "use strict";
  const CFG = window.ADDWARE;

  /* ---------- Header sticky: sombra al hacer scroll ---------- */
  const header = document.querySelector(".header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menú mobile (burger) ---------- */
  const burger = document.querySelector(".burger");
  const navLinks = document.querySelector(".nav-links");
  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open);
    });
    navLinks.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        burger.classList.remove("open");
      })
    );
  }

  /* ---------- WhatsApp: poblar todos los links [data-wa] ---------- */
  document.querySelectorAll("[data-wa]").forEach(el => {
    const msg = el.getAttribute("data-wa") || "";
    el.setAttribute("href", window.waLink(msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  /* ---------- Botón flotante de WhatsApp ---------- */
  if (!document.querySelector(".wa-float")) {
    const a = document.createElement("a");
    a.className = "wa-float";
    a.href = window.waLink("Hola Addware! Te escribo desde la web 👋");
    a.target = "_blank"; a.rel = "noopener";
    a.setAttribute("aria-label", "Escribir por WhatsApp");
    a.innerHTML = '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 .5C7.5.5.6 7.4.6 15.9c0 2.8.7 5.4 2.1 7.8L.5 31.5l8-2.1c2.3 1.3 4.9 1.9 7.5 1.9 8.5 0 15.4-6.9 15.4-15.4S24.5.5 16 .5zm0 28.1c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.7 1.2 1.3-4.6-.3-.5a12.6 12.6 0 01-1.9-6.7C3.2 8.9 8.9 3.3 16 3.3S28.8 8.9 28.8 16 23.1 28.6 16 28.6zm7-9.4c-.4-.2-2.3-1.1-2.6-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.3-2.1-2.6-.2-.4 0-.6.2-.7.2-.2.4-.4.6-.7.2-.2.3-.4.4-.7.1-.2 0-.5 0-.7-.1-.2-.9-2.2-1.3-3-.3-.7-.6-.6-.9-.6h-.7c-.2 0-.6.1-1 .5-.3.4-1.3 1.3-1.3 3.1 0 1.8 1.3 3.6 1.5 3.8.2.2 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.2-.3-.3-.7-.4z"/></svg>';
    document.body.appendChild(a);
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("visible"));
  }

  /* ---------- Año dinámico en footer ---------- */
  document.querySelectorAll("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));

  /* ---------- Formulario de contacto → WhatsApp ---------- */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const msg =
        `Hola Addware! Soy ${f.get("nombre") || ""}.\n` +
        `Motivo: ${f.get("motivo") || "Consulta"}.\n` +
        `${f.get("mensaje") || ""}` +
        (f.get("telefono") ? `\nTel: ${f.get("telefono")}` : "");
      window.open(window.waLink(msg), "_blank", "noopener");
    });
  }
})();
