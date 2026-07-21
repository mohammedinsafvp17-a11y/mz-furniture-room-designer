# MZ Furniture — Room Designer (prototype)

A 3D drag-and-drop room customizer built with Three.js. Visitors pick furniture
from a catalog, place it in a room, rotate/move/remove pieces, change floor and
wall finishes, resize the room, and see a running price total.

## Files

- `index.html` — page markup
- `style.css` — all styling
- `script.js` — Three.js scene, furniture models, catalog, drag/orbit controls, persistence

## Run it locally in VS Code

1. Open this folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey) if you don't have it.
3. Right-click `index.html` → **Open with Live Server**.
   (You can't just double-click the file — some browsers block features like
   `localStorage` and the Google Fonts/Three.js CDN loads under a plain `file://` URL.)

That's it — no build step, no npm install. It's plain HTML/CSS/JS plus one CDN
script tag for Three.js.

## What's real vs. a placeholder right now

- **Furniture shapes** are built from simple boxes/cylinders parametrically —
  good enough to prove the interaction model, not photoreal.
- **Catalog data** (`CATALOG` array at the top of `script.js`) is hardcoded
  sample data shaped exactly like a WooCommerce Store API product.
- **"Add Room to Cart"** currently just shows a message — it doesn't touch a
  real cart yet.
- **Layout saving** uses the browser's `localStorage`, so a visitor's room
  layout persists across page reloads on their own device.

## Turning this into the real feature on your WordPress/WooCommerce site

**1. Pull in your real products**
Replace the `CATALOG` array with a `fetch()` call to your store's Store API, e.g.:
```js
const res = await fetch('/wp-json/wc/store/v1/products?category=furniture');
const products = await res.json();
```
Map each product's `id`, `name`, `prices.price`, and a custom meta field for
width/depth (you'll need to add a "dimensions" field to each product if you
don't already track it).

**2. Use real 3D models instead of boxes**
For a truly realistic look, each product needs a small `.glb` 3D model
(furniture manufacturers or 3D modelers can produce these, or a service like
Roomle/Sketchfab can help). Load them with Three.js's `GLTFLoader` instead of
the `buildSofa()`-style functions here. Store the model URL in product meta.

**3. Wire up the real cart**
Point "Add Room to Cart" at the WooCommerce Store API cart endpoint
(`/wp-json/wc/store/v1/cart/add-item`) for each placed product ID.

**4. Package it for WordPress**
The cleanest approach is a small custom plugin:
- Enqueue `style.css` and `script.js` on a specific page/shortcode only
  (not site-wide) using `wp_enqueue_script` / `wp_enqueue_style`.
- Register a shortcode like `[mz_room_designer]` that outputs the `#app` markup
  from `index.html`.
- Add an admin settings page (or just product meta boxes) so you can attach a
  3D model file and real-world dimensions to each WooCommerce product.

If you'd like, I can build out the actual WordPress plugin scaffold (PHP file
with the shortcode + enqueue calls + product meta box) as a next step — just
say the word.
