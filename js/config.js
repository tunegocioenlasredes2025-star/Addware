/* =====================================================================
   ADDWARE — Configuración central del negocio
   ---------------------------------------------------------------------
   ÚNICO lugar para editar los datos de contacto. Cambiá acá y se
   actualiza en TODO el sitio (botones de WhatsApp, footer, etc).
   ===================================================================== */

window.ADDWARE = {
  // --- Marca ---
  nombre: "ADDWARE",
  tagline: "compu & videojuegos",

  // --- WhatsApp ---
  // Formato internacional SIN signos ni espacios. AR móvil = 549 + área + número.
  // Tel publicado: +54 11 3188-0899  →  549 11 3188 0899
  // ⚠️ Verificá que este número tenga WhatsApp. Si no, reemplazalo acá.
  whatsapp: "5491131880899",
  telefonoVisible: "+54 11 3188-0899",

  // --- Ubicación ---
  direccion: "Gdor. Inocencio Arias 3080",
  localidad: "Castelar",
  partido: "Morón",
  provincia: "Buenos Aires",
  cp: "B1712",
  pais: "Argentina",
  // Coordenadas aproximadas de Gdor. Inocencio Arias 3080, Castelar
  geo: { lat: -34.6526, lng: -58.6457 },

  // --- Redes ---
  instagram: "addwareinsta",
  instagramUrl: "https://www.instagram.com/addwareinsta/",

  // --- Horarios ---
  horarios: [
    { dias: "Lunes a Viernes", horas: "10:00 a 18:00" },
    { dias: "Sábados", horas: "10:00 a 14:00" },
    { dias: "Domingos", horas: "Cerrado" }
  ],

  // --- Sitio ---
  dominio: "https://addware.com.ar", // ← cambialo cuando publiques
  email: "" // opcional, completar si tienen
};

/* Helpers globales para armar links de WhatsApp */
window.waLink = function (mensaje) {
  const texto = encodeURIComponent(mensaje || "Hola Addware, quisiera más información.");
  return `https://wa.me/${window.ADDWARE.whatsapp}?text=${texto}`;
};

window.waProducto = function (nombreProducto) {
  return window.waLink(
    `Hola, vi el producto "${nombreProducto}" en la web de Addware y quisiera más información.`
  );
};

/* ID estable por producto (derivado del nombre del archivo de imagen) */
window.productoId = function (p) {
  const base = (p && p.imagen ? p.imagen.split("/").pop().replace(/\.[a-z0-9]+$/i, "") : "");
  return base || encodeURIComponent((p && p.nombre) || "");
};
window.findProducto = function (id) {
  return (window.PRODUCTOS || []).find(p => window.productoId(p) === id);
};
window.urlProducto = function (p) {
  return "producto.html?id=" + encodeURIComponent(window.productoId(p));
};
