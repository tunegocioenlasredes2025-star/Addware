# Addware — Cómo cargar productos (guía rápida)

El catálogo es **automático**: vos sólo editás UN archivo y el sitio se actualiza solo
(buscador, filtros, botones de WhatsApp, productos destacados del home).

## 1) Subí las fotos
Poné las imágenes de los productos en la carpeta:

```
images/productos/
```

Nombralas claro, sin espacios ni acentos. Ejemplos:
- `teclado-redragon-kumara.jpg`
- `notebook-lenovo-i5.jpg`
- `joystick-ps5-dualsense.jpg`

## 2) Cargá el producto
Abrí `js/productos.js` y agregá un bloque por cada producto, copiando la plantilla:

```js
{
  nombre: "Teclado Mecánico Redragon Kumara",
  categoria: "perifericos",          // ver lista de categorías abajo
  marca: "Redragon",
  descripcion: "Teclado mecánico RGB switch red, ideal para gaming.",
  imagen: "images/productos/teclado-redragon-kumara.jpg"
}
```
> Si todavía no tenés la foto, dejá `imagen: ""` y se muestra un placeholder elegante
> con el texto "FOTO PRÓXIMAMENTE". No se rompe nada.

**Acordate de poner una coma `,` entre cada producto.**

## 3) Categorías válidas (campo `categoria`)
`consolas` · `retro` · `teclados` · `auriculares` · `mouse`

> Para sumar una categoría nueva (ej: `notebooks`), agregала en `window.CATEGORIAS`
> arriba de `js/productos.js` con su `id`, `nombre` e `icono`.

### Precios
Cada producto tiene dos precios:
- `precio` → contado / transferencia (el que se muestra grande)
- `precioLista` → lista / tarjeta (se muestra al lado como "Lista $…")
Escribilos sin el signo $ y con punto de miles, ej: `"precio": "84.000"`.

> Sólo aparecen como filtro las categorías que tengan al menos un producto cargado.

## 4) Datos del negocio (WhatsApp, dirección, horarios)
Está todo centralizado en `js/config.js`. Si cambia el número de WhatsApp o un horario,
se edita ahí UNA sola vez y se actualiza en todo el sitio.

> ⚠️ **Verificá el número de WhatsApp** en `config.js`. Está cargado el publicado
> (+54 11 3188-0899 → `5491131880899`). Si el WhatsApp del negocio es otro, cambialo ahí.

## 5) Publicar online
El sitio es HTML/CSS/JS puro (sin Node ni build). Se sube tal cual a:
- **Vercel** o **Netlify** (arrastrar la carpeta), o cualquier hosting.
Cuando tengas el dominio final, cambiá `dominio` en `config.js` y las URLs de
`sitemap.xml` / `robots.txt` / etiquetas canónicas.
