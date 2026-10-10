#!/usr/bin/env node
/* ============================================================
   PRE-RENDERIZADO GEO/AEO — Wario Bross
   Lee los datos reales (MENU, RESENAS, DESTACADOS, CONFIG) de
   index.html y escribe el HTML estático equivalente entre los
   marcadores <!--PRERENDER:X:START--> ... <!--PRERENDER:X:END-->.

   Así los rastreadores que NO ejecutan JavaScript (GPTBot,
   ClaudeBot, PerplexityBot...) ven menú, precios, reseñas y
   horarios en el HTML. En el navegador, el JS vuelve a dibujar
   las mismas secciones desde las mismas constantes.

   Uso (desde la carpeta del proyecto):   node scripts/prerender.js
   No necesita instalar nada, solo Node.js.
============================================================= */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ARCHIVO = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(ARCHIVO, 'utf8');

/* ---------- 1) Extraer las constantes de datos del <script> ---------- */
function extraer(nombre, inicio, fin){
  const i = html.indexOf(inicio);
  if(i === -1) throw new Error('No se encontró ' + nombre);
  const j = html.indexOf(fin, i);
  if(j === -1) throw new Error('No se encontró el final de ' + nombre);
  const expr = html.slice(i + inicio.length, j + 2); /* incluye el cierre ] o } */
  return vm.runInNewContext('(' + expr + ')');
}
const CONFIG = extraer('CONFIG', 'const CONFIG = Object.freeze(', '\n});');
const MENU = extraer('MENU', 'const MENU = ', '\n];');
const RESENAS = extraer('RESENAS', 'const RESENAS = ', '\n];');
const mDest = html.match(/const DESTACADOS = (\[.*?\]);/);
if(!mDest) throw new Error('No se encontró DESTACADOS');
const DESTACADOS = vm.runInNewContext(mDest[1]);

/* ---------- 2) Utilidades ---------- */
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const formatoCOP = v => '$' + v.toLocaleString('es-CO') + ' COP';
const idProducto = (c, p) => 'p-' + c + '-' + p;

/* ---------- 3) Generadores (espejo de las funciones de render del JS) ---------- */
function chips(){
  return MENU.map((cat, i) =>
    '<a href="#cat-' + i + '" class="categoria-chip" data-cat-link>' + esc(cat.icono + ' ' + cat.categoria) + '</a>'
  ).join('');
}

function menu(){
  return MENU.map((cat, c) => {
    const sub = cat.sub ? '<p class="menu-categoria-sub">' + esc(cat.sub) + '</p>' : '';
    const items = cat.productos.map((prod, p) => {
      const media = prod.imagen
        ? '<img src="' + esc(prod.imagen) + '" alt="' + esc(prod.nombre) + '" loading="lazy" width="80" height="80">'
        : esc(cat.icono);
      const badge = prod.personas ? '<span class="producto-badge">Para ' + prod.personas + ' personas</span>' : '';
      const desc = prod.desc ? '<span class="producto-desc">' + esc(prod.desc) + '</span>' : '';
      return '<li><button type="button" class="producto-card" aria-label="Ver detalles de ' + esc(prod.nombre) + ', ' + esc(formatoCOP(prod.precio)) + '" data-producto-id="' + idProducto(c, p) + '">' +
        '<span class="producto-img">' + media + '</span>' +
        '<span class="producto-info">' + badge +
        '<span class="producto-nombre">' + esc(prod.nombre) + '</span>' + desc +
        '<span class="producto-precio">' + esc(formatoCOP(prod.precio)) + '</span></span></button></li>';
    }).join('\n');
    return '<div class="menu-categoria" id="cat-' + c + '"><div class="menu-categoria-header"><h3>' +
      esc(cat.icono + ' ' + cat.categoria) + '</h3>' + sub + '</div><ul class="menu-productos">\n' + items + '\n</ul></div>';
  }).join('\n');
}

function buscar(nombre){
  for(let c = 0; c < MENU.length; c++)
    for(let p = 0; p < MENU[c].productos.length; p++)
      if(MENU[c].productos[p].nombre === nombre) return { cat: MENU[c], prod: MENU[c].productos[p] };
  return null;
}

function destacados(){
  return DESTACADOS.map(buscar).filter(Boolean).map(h => {
    const prod = h.prod;
    const media = prod.imagen
      ? '<img src="' + esc(prod.imagen) + '" alt="' + esc(prod.nombre) + '" loading="lazy" width="400" height="300" draggable="false">'
      : esc(h.cat.icono);
    const badge = prod.personas ? '<span class="producto-badge">Para ' + prod.personas + ' personas</span>' : '';
    const desc = prod.desc ? '<span class="destacado-desc">' + esc(prod.desc) + '</span>' : '';
    return '<li><button type="button" class="destacado-card" aria-label="Ver detalles de ' + esc(prod.nombre) + ', ' + esc(formatoCOP(prod.precio)) + '">' +
      '<span class="destacado-media">' + media + '</span><span class="destacado-info">' + badge +
      '<span class="destacado-nombre">' + esc(prod.nombre) + '</span>' + desc +
      '<span class="destacado-precio">' + esc(formatoCOP(prod.precio)) + '</span></span></button></li>';
  }).join('\n');
}

function resenas(){
  return RESENAS.map(r => {
    const estrellas = r.estrellas
      ? '<p class="resena-estrellas" aria-label="' + r.estrellas + ' de 5 estrellas">' + '★'.repeat(r.estrellas) + '☆'.repeat(5 - r.estrellas) + '</p>'
      : '';
    return '<article class="resena-card"><div class="resena-cabecera"><span class="resena-avatar" aria-hidden="true">' +
      esc(r.nombre.trim().charAt(0).toUpperCase()) + '</span><div class="resena-autor"><p class="resena-nombre">' + esc(r.nombre) +
      '</p><p class="resena-meta">' + esc(r['reseñasAutor']) + '</p></div></div>' + estrellas +
      '<p class="resena-texto">' + esc(r.texto) + '</p><p class="resena-tiempo">' + esc(r.tiempo) + ' · Google</p>' +
      '<a class="resena-link" href="' + esc(r.link) + '" target="_blank" rel="noopener noreferrer">Ver reseña en Google Maps ↗</a></article>';
  }).join('\n');
}

function horarios(){
  return CONFIG.hours.map(h =>
    '<tr><th scope="row">' + esc(h.dia) + '</th><td>' + esc(h.abre + ' – ' + h.cierra) + '</td></tr>'
  ).join('\n');
}

/* ---------- 4) Reemplazar cada bloque entre sus marcadores ---------- */
function inyectar(nombre, contenido){
  const ini = '<!--PRERENDER:' + nombre + ':START-->';
  const fin = '<!--PRERENDER:' + nombre + ':END-->';
  const i = html.indexOf(ini), j = html.indexOf(fin);
  if(i === -1 || j === -1 || j < i) throw new Error('Faltan marcadores de ' + nombre + ' en index.html');
  html = html.slice(0, i + ini.length) + '\n' + contenido + '\n' + html.slice(j);
}
inyectar('CHIPS', chips());
inyectar('MENU', menu());
inyectar('DESTACADOS', destacados());
inyectar('RESENAS', resenas());
inyectar('HORARIOS', horarios());

/* ---------- 5) Verificaciones de consistencia ---------- */
let avisos = 0;
function aviso(msg){ console.warn('⚠️  ' + msg); avisos++; }

/* a) Nombres de producto únicos (el carrito y los destacados los usan como llave) */
const nombres = MENU.flatMap(c => c.productos.map(p => p.nombre));
nombres.filter((n, i) => nombres.indexOf(n) !== i).forEach(n => aviso('Nombre de producto repetido: ' + n));
DESTACADOS.filter(n => !buscar(n)).forEach(n => aviso('DESTACADOS contiene un nombre que no existe en MENU: ' + n));

/* b) JSON-LD (hasMenu) vs MENU: mismos productos y mismos precios */
const mLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if(mLd){
  const ld = JSON.parse(mLd[1]);
  const ldPrecios = new Map();
  (ld.hasMenu.hasMenuSection || []).forEach(s => (s.hasMenuItem || []).forEach(it => ldPrecios.set(it.name, it.offers.price)));
  MENU.forEach(c => c.productos.forEach(p => {
    if(!ldPrecios.has(p.nombre)) aviso('Falta en el JSON-LD: ' + p.nombre);
    else if(ldPrecios.get(p.nombre) !== p.precio) aviso('Precio distinto en JSON-LD para ' + p.nombre + ': MENU ' + p.precio + ' vs JSON-LD ' + ldPrecios.get(p.nombre));
  }));
  ldPrecios.forEach((_, n) => { if(!nombres.includes(n)) aviso('Producto en JSON-LD que ya no está en MENU: ' + n); });
}

/* c) Las imágenes referenciadas existen en la carpeta img/ (si está presente) */
const raiz = path.join(__dirname, '..');
if(fs.existsSync(path.join(raiz, 'img'))){
  MENU.forEach(c => c.productos.forEach(p => {
    if(p.imagen && !fs.existsSync(path.join(raiz, p.imagen))) aviso('Imagen no encontrada: ' + p.imagen + ' (' + p.nombre + ')');
  }));
}

fs.writeFileSync(ARCHIVO, html, 'utf8');
console.log('✅ Pre-renderizado listo: ' + MENU.length + ' categorías, ' + nombres.length + ' productos, ' +
  DESTACADOS.length + ' destacados, ' + RESENAS.length + ' reseñas, ' + CONFIG.hours.length + ' horarios.' +
  (avisos ? '  (' + avisos + ' aviso(s) arriba)' : '  Sin avisos.'));
