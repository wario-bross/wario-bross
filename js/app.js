/* ============================================================
   js/app.js — LÓGICA DE LA WEB (no contiene datos del negocio)
   Depende de las constantes de js/datos.js: CONFIG, MENU, RESENAS
   y DESTACADOS, que deben cargarse antes.
============================================================= */

/* FOOTER — DATOS DINÁMICOS */
function renderizarFooter(){
  const hoursBody=document.getElementById('footerHours');
  const year=document.getElementById('footerYear');
  if(hoursBody){hoursBody.innerHTML='';CONFIG.hours.forEach(function(item){const tr=document.createElement('tr');const th=document.createElement('th');const td=document.createElement('td');th.scope='row';th.textContent=item.dia;td.textContent=item.abre+' – '+item.cierra;tr.appendChild(th);tr.appendChild(td);hoursBody.appendChild(tr);});}
  if(year) year.textContent=new Date().getFullYear();
  document.querySelectorAll('[data-maps-link]').forEach(function(el){el.href=CONFIG.mapsUrl;});
  document.querySelectorAll('[data-phone-link]').forEach(function(el){el.href='tel:'+CONFIG.phoneHref;el.textContent=CONFIG.phoneDisplay;});
  document.querySelectorAll('[data-whatsapp-link]').forEach(function(el){el.href='https://wa.me/'+CONFIG.whatsappNumber;});
  document.querySelectorAll('[data-instagram-link]').forEach(function(el){el.href=CONFIG.instagramUrl;el.textContent=CONFIG.instagramHandle;});
}
renderizarFooter();

function formatoCOP(valor){
  return "$" + valor.toLocaleString("es-CO") + " COP";
}

/* ============================================================
   RENDER DEL MENÚ (data-driven — sin duplicar HTML)
============================================================= */
function renderizarCategoriasNav(){
  const nav = document.getElementById('menuCategoriasScroll');
  if(!nav) return;
  nav.innerHTML = ''; /* reemplaza el HTML pre-renderizado (para rastreadores) por la versión viva */
  MENU.forEach(function(cat, idx){
    const a = document.createElement('a');
    a.href = '#cat-' + idx;
    a.className = 'categoria-chip';
    a.setAttribute('data-cat-link', '');
    a.textContent = cat.icono + ' ' + cat.categoria;
    nav.appendChild(a);
  });
}

function crearMediaProducto(cat, prod, tamano){
  const media = document.createElement('span');
  media.className = 'producto-img';
  if(prod.imagen){
    const img = document.createElement('img');
    img.src = prod.imagen;
    img.alt = prod.nombre; /* alt descriptivo real: SEO/GEO de imágenes de platos */
    img.loading = 'lazy';
    img.width = tamano; img.height = tamano;
    media.appendChild(img);
  } else {
    media.textContent = cat.icono;
  }
  return media;
}

/* Id determinista por producto (categoría+índice), estable
   mientras no se reordene el array MENU. No se inventa dato
   alguno: se deriva de la posición real en el catálogo. */
function generarIdProducto(idxCat, idxProd){
  return 'p-' + idxCat + '-' + idxProd;
}

function renderizarMenu(){
  const contenedor = document.getElementById('menuCategorias');
  if(!contenedor) return;
  contenedor.innerHTML = ''; /* reemplaza el HTML pre-renderizado */

  MENU.forEach(function(cat, idxCat){
    const seccion = document.createElement('div');
    seccion.className = 'menu-categoria';
    seccion.id = 'cat-' + idxCat;

    const header = document.createElement('div');
    header.className = 'menu-categoria-header';
    const h3 = document.createElement('h3');
    h3.textContent = cat.icono + ' ' + cat.categoria;
    header.appendChild(h3);
    if(cat.sub){
      const sub = document.createElement('p');
      sub.className = 'menu-categoria-sub';
      sub.textContent = cat.sub;
      header.appendChild(sub);
    }
    seccion.appendChild(header);

    const lista = document.createElement('ul');
    lista.className = 'menu-productos';

    cat.productos.forEach(function(prod, idxProd){
      const li = document.createElement('li');
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'producto-card';
      boton.setAttribute('aria-label', 'Ver detalles de ' + prod.nombre + ', ' + formatoCOP(prod.precio));

      boton.appendChild(crearMediaProducto(cat, prod, 80));

      const info = document.createElement('span');
      info.className = 'producto-info';

      if(prod.personas){
        const badge = document.createElement('span');
        badge.className = 'producto-badge';
        badge.textContent = 'Para ' + prod.personas + ' personas';
        info.appendChild(badge);
      }
      const nombre = document.createElement('span');
      nombre.className = 'producto-nombre';
      nombre.textContent = prod.nombre;
      info.appendChild(nombre);

      if(prod.desc){
        const desc = document.createElement('span');
        desc.className = 'producto-desc';
        desc.textContent = prod.desc;
        info.appendChild(desc);
      }

      const precio = document.createElement('span');
      precio.className = 'producto-precio';
      precio.textContent = formatoCOP(prod.precio);
      info.appendChild(precio);

      boton.appendChild(info);
      const idProducto = generarIdProducto(idxCat, idxProd);
      boton.dataset.productoId = idProducto;
      boton.addEventListener('click', function(){
        abrirDetalleProducto(cat, prod, boton, idProducto);
      });

      li.appendChild(boton);
      lista.appendChild(li);
    });

    seccion.appendChild(lista);
    contenedor.appendChild(seccion);
  });
}

renderizarCategoriasNav();
renderizarMenu();

function buscarProductoPorNombre(nombre){
  for(let c = 0; c < MENU.length; c++){
    for(let p = 0; p < MENU[c].productos.length; p++){
      if(MENU[c].productos[p].nombre === nombre){
        return { cat: MENU[c], prod: MENU[c].productos[p], id: generarIdProducto(c, p) };
      }
    }
  }
  return null;
}

function crearTarjetaDestacado(hallado, esClon){
  const cat = hallado.cat, prod = hallado.prod;
  const li = document.createElement('li');
  if(esClon){ li.setAttribute('aria-hidden', 'true'); li.setAttribute('data-destacado-clon', ''); }

  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'destacado-card';
  if(esClon) boton.tabIndex = -1;
  boton.setAttribute('aria-label', 'Ver detalles de ' + prod.nombre + ', ' + formatoCOP(prod.precio));

  const media = document.createElement('span');
  media.className = 'destacado-media';
  if(prod.imagen){
    const img = document.createElement('img');
    img.src = prod.imagen; img.alt = esClon ? '' : prod.nombre; img.loading = 'lazy';
    img.width = 400; img.height = 300; img.draggable = false;
    /* Si la foto aún no está subida al repositorio, mostrar el ícono en vez de texto roto */
    img.addEventListener('error', function(){ media.textContent = cat.icono; });
    media.appendChild(img);
  } else {
    media.textContent = cat.icono;
  }
  boton.appendChild(media);

  const info = document.createElement('span');
  info.className = 'destacado-info';
  if(prod.personas){
    const badge = document.createElement('span');
    badge.className = 'producto-badge';
    badge.textContent = 'Para ' + prod.personas + ' personas';
    info.appendChild(badge);
  }
  const n = document.createElement('span');
  n.className = 'destacado-nombre'; n.textContent = prod.nombre;
  info.appendChild(n);
  if(prod.desc){
    const d = document.createElement('span');
    d.className = 'destacado-desc'; d.textContent = prod.desc;
    info.appendChild(d);
  }
  const pr = document.createElement('span');
  pr.className = 'destacado-precio'; pr.textContent = formatoCOP(prod.precio);
  info.appendChild(pr);
  boton.appendChild(info);

  boton.addEventListener('click', function(){
    abrirDetalleProducto(cat, prod, boton, hallado.id);
  });
  li.appendChild(boton);
  return li;
}

/* Carrusel continuo (derecha → izquierda) con arrastre manual.
   - Usa scroll nativo: el dedo (o el mouse arrastrando) lo mueve libremente.
   - El avance automático se pausa al tocar/arrastrar/pasar el mouse/enfocar
     y se reanuda ~1,5 s después de la última interacción.
   - Velocidad = la misma (px/s) que el carrusel de reseñas, medida en vivo.
   - 3 bloques idénticos: al llegar a un extremo se salta un bloque (invisible). */
function initCarruselDestacados(viewport, track, halladas){
  const PAUSA_MS = 1500;
  let blockW = 1, velocidad = 40, pos = 0, ultimoSet = 0, ultimoFrame = 0;
  let ultimaInteraccion = 0, arrastrando = false, hover = false, enfoque = false, visible = true, eraActivo = false;
  let inicioX = 0, inicioScroll = 0, movido = false;

  function velocidadResenas(){
    const t = document.getElementById('resenasTrack');
    if(!t) return 40;
    const raw = getComputedStyle(t).animationDuration || '';
    const seg = /ms$/.test(raw) ? parseFloat(raw) / 1000 : parseFloat(raw);
    if(!seg || seg < 1) return 40;
    return (t.offsetWidth / 2) / seg;
  }

  function armar(){
    track.innerHTML = '';
    halladas.forEach(function(h){ track.appendChild(crearTarjetaDestacado(h, false)); });
    const li0 = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 20;
    const setW = halladas.length * (li0.offsetWidth + gap);
    const copias = Math.max(1, Math.ceil(viewport.clientWidth / setW));
    blockW = setW * copias;

    track.innerHTML = '';
    for(let bloque = 0; bloque < 3; bloque++){
      for(let c = 0; c < copias; c++){
        halladas.forEach(function(h){
          /* El único juego "real" (accesible) es el del bloque central */
          track.appendChild(crearTarjetaDestacado(h, !(bloque === 1 && c === 0)));
        });
      }
    }
    velocidad = velocidadResenas();
    viewport.scrollLeft = blockW;
    pos = ultimoSet = viewport.scrollLeft;
  }

  function ahora(){ return performance.now(); }

  let frames = 0;
  function tick(t){
    const dt = Math.min(0.05, (t - ultimoFrame) / 1000);
    ultimoFrame = t;
    /* Las reseñas se dibujan después de este bloque: re-medir su velocidad
       periódicamente (≈ 1 vez por segundo) para igualarla siempre. */
    if(frames++ % 60 === 0) velocidad = velocidadResenas();
    const activo = visible && !arrastrando && !hover && !enfoque && !document.hidden &&
                   !document.body.classList.contains('bloqueo-scroll') &&
                   (ahora() - ultimaInteraccion > PAUSA_MS);
    if(activo){
      if(!eraActivo) pos = viewport.scrollLeft;
      pos += velocidad * dt;
      if(pos >= 2 * blockW) pos -= blockW;
      viewport.scrollLeft = pos;
      ultimoSet = viewport.scrollLeft;
    }
    eraActivo = activo;
    requestAnimationFrame(tick);
  }

  viewport.addEventListener('scroll', function(){
    const sl = viewport.scrollLeft;
    if(Math.abs(sl - ultimoSet) > 2) ultimaInteraccion = ahora(); /* movimiento hecho por el usuario */
    if(sl >= 2 * blockW){ viewport.scrollLeft = sl - blockW; ultimoSet = viewport.scrollLeft; }
    else if(sl < 0.2 * blockW){ viewport.scrollLeft = sl + blockW; ultimoSet = viewport.scrollLeft; }
  }, { passive: true });

  ['touchstart', 'touchend', 'wheel', 'keydown'].forEach(function(ev){
    viewport.addEventListener(ev, function(){ ultimaInteraccion = ahora(); }, { passive: true });
  });

  /* Arrastre con mouse (en táctil el scroll nativo ya funciona con el dedo) */
  viewport.addEventListener('pointerdown', function(e){
    ultimaInteraccion = ahora();
    if(e.pointerType !== 'mouse') return;
    arrastrando = true; movido = false;
    inicioX = e.clientX; inicioScroll = viewport.scrollLeft;
    viewport.classList.add('arrastrando');
  });
  window.addEventListener('pointermove', function(e){
    if(!arrastrando) return;
    const dx = e.clientX - inicioX;
    if(Math.abs(dx) > 5) movido = true;
    viewport.scrollLeft = inicioScroll - dx;
    ultimaInteraccion = ahora();
  });
  window.addEventListener('pointerup', function(){
    if(!arrastrando) return;
    arrastrando = false;
    viewport.classList.remove('arrastrando');
    ultimaInteraccion = ahora();
  });
  /* Si fue un arrastre, no abrir el producto al soltar */
  viewport.addEventListener('click', function(e){
    if(movido){ e.stopPropagation(); e.preventDefault(); movido = false; }
  }, true);

  viewport.addEventListener('pointerenter', function(e){ if(e.pointerType === 'mouse') hover = true; });
  viewport.addEventListener('pointerleave', function(e){ if(e.pointerType === 'mouse') hover = false; });
  viewport.addEventListener('focusin', function(){ enfoque = true; });
  viewport.addEventListener('focusout', function(){ enfoque = false; ultimaInteraccion = ahora(); });

  if('IntersectionObserver' in window){
    new IntersectionObserver(function(en){ visible = en[0].isIntersecting; }).observe(viewport);
  }

  let tRedim = null;
  window.addEventListener('resize', function(){
    clearTimeout(tRedim);
    tRedim = setTimeout(armar, 200);
  });

  armar();
  requestAnimationFrame(function(t){ ultimoFrame = t; requestAnimationFrame(tick); });
}

function renderizarDestacados(){
  const viewport = document.getElementById('destacadosViewport');
  const track = document.getElementById('destacadosTrack');
  if(!viewport || !track) return;
  /* nombre no encontrado: se omite en vez de mostrar datos falsos */
  const halladas = DESTACADOS.map(buscarProductoPorNombre).filter(Boolean);
  if(!halladas.length) return;

  const reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reducido){
    /* Sin movimiento automático: carrusel manual deslizable, un solo juego */
    track.innerHTML = '';
    halladas.forEach(function(h){ track.appendChild(crearTarjetaDestacado(h, false)); });
    return;
  }
  initCarruselDestacados(viewport, track, halladas);
}
renderizarDestacados();

/* ============================================================
   RENDER DE RESEÑAS + CARRUSEL CONTINUO
   El track se duplica una vez (5 reales + 5 clones = 10) para
   que la animación de -50% cree un bucle infinito sin costuras.
   Los clones se marcan aria-hidden y data-resena-clon para que
   lectores de pantalla no los anuncien dos veces, y para poder
   ocultarlos cuando el usuario prefiere movimiento reducido.
============================================================= */
function crearTarjetaResena(r, esClon){
  const card = document.createElement('article');
  card.className = 'resena-card';
  if(esClon) { card.setAttribute('aria-hidden', 'true'); card.setAttribute('data-resena-clon', ''); }

  const cabecera = document.createElement('div');
  cabecera.className = 'resena-cabecera';

  const avatar = document.createElement('span');
  avatar.className = 'resena-avatar';
  avatar.textContent = r.nombre.trim().charAt(0).toUpperCase();
  avatar.setAttribute('aria-hidden', 'true');
  cabecera.appendChild(avatar);

  const autor = document.createElement('div');
  autor.className = 'resena-autor';
  const nombre = document.createElement('p');
  nombre.className = 'resena-nombre';
  nombre.textContent = r.nombre;
  const meta = document.createElement('p');
  meta.className = 'resena-meta';
  meta.textContent = r.reseñasAutor;
  autor.appendChild(nombre);
  autor.appendChild(meta);
  cabecera.appendChild(autor);
  card.appendChild(cabecera);

  if(r.estrellas){
    const estrellas = document.createElement('p');
    estrellas.className = 'resena-estrellas';
    estrellas.setAttribute('aria-label', r.estrellas + ' de 5 estrellas');
    estrellas.textContent = '★'.repeat(r.estrellas) + '☆'.repeat(5 - r.estrellas);
    card.appendChild(estrellas);
  }

  const texto = document.createElement('p');
  texto.className = 'resena-texto';
  texto.textContent = r.texto;
  card.appendChild(texto);

  const tiempo = document.createElement('p');
  tiempo.className = 'resena-tiempo';
  tiempo.textContent = r.tiempo + ' · Google';
  card.appendChild(tiempo);

  const enlace = document.createElement('a');
  enlace.className = 'resena-link';
  enlace.href = r.link;
  enlace.target = '_blank';
  enlace.rel = 'noopener noreferrer';
  enlace.textContent = 'Ver reseña en Google Maps ↗';
  if(esClon) enlace.setAttribute('tabindex', '-1');
  card.appendChild(enlace);

  return card;
}

function renderizarResenas(){
  const track = document.getElementById('resenasTrack');
  if(!track) return;
  track.innerHTML = ''; /* reemplaza el HTML pre-renderizado */
  RESENAS.forEach(function(r){ track.appendChild(crearTarjetaResena(r, false)); });
  /* Duplicado para el bucle continuo (decorativo, oculto a lectores de pantalla) */
  RESENAS.forEach(function(r){ track.appendChild(crearTarjetaResena(r, true)); });
}
renderizarResenas();

/* ============================================================
   MODAL DE DETALLE DE PRODUCTO
   Instancia única, poblada dinámicamente. Accesible: foco
   atrapado, Escape cierra, el foco regresa al disparador.
============================================================= */
let elementoActivadorModal = null;
let productoActivoModal = null; /* { id, nombre, precio, imagen, categoria } del producto abierto en el modal */

function abrirDetalleProducto(cat, prod, elementoActivador, idProducto){
  elementoActivadorModal = elementoActivador || null;
  productoActivoModal = {
    id: idProducto || generarIdProducto(-1, -1),
    nombre: prod.nombre,
    precio: prod.precio,
    imagen: prod.imagen || '',
    categoria: cat.categoria
  };

  const media = document.getElementById('modalMedia');
  media.innerHTML = '';
  media.className = prod.imagen ? 'modal-media' : 'modal-media modal-media-fallback';
  if(prod.imagen){
    const img = document.createElement('img');
    img.src = prod.imagen;
    img.alt = prod.nombre;
    img.width = 500; img.height = 375;
    media.appendChild(img);
  } else {
    media.textContent = cat.icono;
  }

  const badge = document.getElementById('modalBadge');
  if(prod.personas){
    badge.textContent = 'Para ' + prod.personas + ' personas';
    badge.hidden = false;
  } else {
    badge.hidden = true;
  }

  document.getElementById('modalProductoNombre').textContent = prod.nombre;
  document.getElementById('modalDesc').textContent = prod.desc || '';
  document.getElementById('modalPrecio').textContent = formatoCOP(prod.precio);

  const overlay = document.getElementById('modalProducto');
  overlay.hidden = false;
  document.body.classList.add('bloqueo-scroll');

  const dialogo = overlay.querySelector('.modal-detalle');
  dialogo.focus();

  document.addEventListener('keydown', manejarTeclaModal);
}

function cerrarDetalleProducto(){
  const overlay = document.getElementById('modalProducto');
  overlay.hidden = true;
  document.body.classList.remove('bloqueo-scroll');
  document.removeEventListener('keydown', manejarTeclaModal);
  if(elementoActivadorModal){
    elementoActivadorModal.focus();
    elementoActivadorModal = null;
  }
}

function manejarTeclaModal(e){
  const overlay = document.getElementById('modalProducto');
  if(e.key === 'Escape'){
    cerrarDetalleProducto();
    return;
  }
  if(e.key === 'Tab'){
    const focosPosibles = overlay.querySelectorAll('button, a[href]');
    if(!focosPosibles.length) return;
    const primero = focosPosibles[0];
    const ultimo = focosPosibles[focosPosibles.length - 1];
    if(e.shiftKey && document.activeElement === primero){
      e.preventDefault(); ultimo.focus();
    } else if(!e.shiftKey && document.activeElement === ultimo){
      e.preventDefault(); primero.focus();
    }
  }
}

(function initModalProducto(){
  const overlay = document.getElementById('modalProducto');
  const cerrar = document.getElementById('modalCerrar');
  const agregar = document.getElementById('modalAgregarCarrito');
  if(!overlay || !cerrar) return;

  cerrar.addEventListener('click', cerrarDetalleProducto);
  overlay.addEventListener('click', function(e){
    if(e.target === overlay) cerrarDetalleProducto();
  });

  if(agregar){
    agregar.addEventListener('click', function(){
      if(!productoActivoModal) return;
      CarritoState.agregar(productoActivoModal);
      cerrarDetalleProducto();
    });
  }
})();

/* ============================================================
   RESALTAR CATEGORÍA ACTIVA DEL MENÚ SEGÚN EL SCROLL
============================================================= */
(function initCategoriaActiva(){
  const enlaces = document.querySelectorAll('[data-cat-link]');
  if(!enlaces.length) return;

  const mapa = new Map();
  enlaces.forEach(function(a){
    const id = a.getAttribute('href').replace('#','');
    const seccion = document.getElementById(id);
    if(seccion) mapa.set(seccion, a);
  });

  const headerEl = document.getElementById('header');
  const catNavEl = document.querySelector('.menu-categorias-nav');
  const offset = (headerEl ? headerEl.offsetHeight : 68) + (catNavEl ? catNavEl.offsetHeight : 0);

  const observer = new IntersectionObserver(function(entradas){
    entradas.forEach(function(entrada){
      const enlace = mapa.get(entrada.target);
      if(!enlace) return;
      if(entrada.isIntersecting){
        enlaces.forEach(function(a){ a.classList.remove('activo'); });
        enlace.classList.add('activo');
        enlace.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  }, { rootMargin: '-' + offset + 'px 0px -55% 0px', threshold: 0 });

  mapa.forEach(function(_, seccion){ observer.observe(seccion); });
})();

/* ============================================================
   NAVEGACIÓN MÓVIL (hamburguesa)
============================================================= */
(function initNavMovil(){
  const toggle = document.getElementById('headerToggle');
  const nav = document.getElementById('headerNav');
  if(!toggle || !nav) return;

  function cerrarNav(){
    nav.classList.remove('abierto');
    toggle.classList.remove('activo');
    toggle.setAttribute('aria-expanded','false');
  }
  function alternarNav(){
    const abierto = nav.classList.toggle('abierto');
    toggle.classList.toggle('activo', abierto);
    toggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  }

  toggle.addEventListener('click', alternarNav);

  nav.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', cerrarNav);
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && nav.classList.contains('abierto')){
      cerrarNav();
      toggle.focus();
    }
  });
})();

/* ============================================================
   RESALTAR ENLACE ACTIVO SEGÚN LA SECCIÓN VISIBLE
   (se activará por completo cuando las secciones tengan
   contenido real en las fases 2, 3 y 5)
============================================================= */
(function initNavActivo(){
  const enlaces = document.querySelectorAll('[data-nav-link]');
  if(!enlaces.length) return;

  const mapa = new Map();
  enlaces.forEach(function(a){
    const id = a.getAttribute('href').replace('#','');
    const seccion = document.getElementById(id);
    if(seccion) mapa.set(seccion, a);
  });

  const observer = new IntersectionObserver(function(entradas){
    entradas.forEach(function(entrada){
      const enlace = mapa.get(entrada.target);
      if(!enlace) return;
      if(entrada.isIntersecting){
        enlaces.forEach(function(a){ a.classList.remove('activo'); });
        enlace.classList.add('activo');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  mapa.forEach(function(_, seccion){ observer.observe(seccion); });
})();

/* ============================================================
   11) SISTEMA DE PEDIDOS — CARRITO + FORMULARIO + WHATSAPP
   Frontend + WhatsApp, sin backend. Fuente única de verdad:
   CarritoState. Persistencia en localStorage con validación
   de datos corruptos. Los precios usados en el mensaje final
   se calculan siempre desde CarritoState + CONFIG, nunca desde
   texto libre editable por el usuario.
============================================================= */

/* ---------- 11.1 Precios: validación y formato ---------- */

/* Formato de precio para el carrito y el mensaje de WhatsApp,
   sin sufijo "COP" (ej: $63.900). formatoCOP() se deja intacta
   porque ya se usa en el menú y el modal de producto. */
function formatoPrecio(valor){
  const numero = Number(valor);
  if(!Number.isFinite(numero) || numero < 0) return '$0';
  return '$' + Math.round(numero).toLocaleString('es-CO');
}

function precioValido(valor){
  const numero = Number(valor);
  return Number.isFinite(numero) && numero >= 0;
}

/* ---------- 11.2 Estado del carrito (única fuente de verdad) ---------- */

const CARRITO_STORAGE_KEY = 'warioBrossCart';
const CARRITO_STORAGE_VERSION = 1;

const CarritoState = (function(){
  let items = [];
  const listeners = [];

  function cargar(){
    try{
      const crudo = window.localStorage.getItem(CARRITO_STORAGE_KEY);
      if(!crudo){ items = []; return; }
      const datos = JSON.parse(crudo);
      if(!datos || datos.version !== CARRITO_STORAGE_VERSION || !Array.isArray(datos.items)){
        items = [];
        window.localStorage.removeItem(CARRITO_STORAGE_KEY);
        return;
      }
      items = datos.items.filter(function(it){
        return it && typeof it.id === 'string' && typeof it.nombre === 'string' &&
               precioValido(it.precio) &&
               Number.isInteger(it.cantidad) && it.cantidad >= 1;
      }).map(function(it){
        return {
          id: it.id,
          nombre: it.nombre,
          precio: Number(it.precio),
          imagen: typeof it.imagen === 'string' ? it.imagen : '',
          categoria: typeof it.categoria === 'string' ? it.categoria : '',
          cantidad: it.cantidad
        };
      });
      /* Sincronizar con el MENU vigente: precio, id, foto y categoría siempre
         salen del catálogo actual, nunca de lo guardado en el navegador. */
      const sync = reconciliarConMenu(items);
      items = sync.items;
      if(sync.cambio) guardar();
    } catch(err){
      /* localStorage no disponible o datos corruptos: iniciar carrito vacío de forma segura */
      items = [];
      try{ window.localStorage.removeItem(CARRITO_STORAGE_KEY); } catch(e2){ /* noop */ }
    }
  }

  /* Compara cada producto guardado con el MENU actual (por NOMBRE, que es estable
     aunque se reordene el catálogo). Si el producto ya no existe, se descarta; si
     cambió de precio/posición/foto, se actualiza; si quedan duplicados, se fusionan. */
  function reconciliarConMenu(lista){
    const porId = new Map();
    let cambio = false;
    lista.forEach(function(it){
      const h = buscarProductoPorNombre(it.nombre);
      if(!h || !precioValido(h.prod.precio)){ cambio = true; return; }
      const act = {
        id: h.id,
        nombre: h.prod.nombre,
        precio: Number(h.prod.precio),
        imagen: h.prod.imagen || '',
        categoria: h.cat.categoria,
        cantidad: it.cantidad
      };
      if(act.id !== it.id || act.precio !== it.precio || act.imagen !== it.imagen || act.categoria !== it.categoria) cambio = true;
      if(porId.has(act.id)){ porId.get(act.id).cantidad += act.cantidad; cambio = true; }
      else { porId.set(act.id, act); }
    });
    return { items: Array.from(porId.values()), cambio: cambio };
  }

  function guardar(){
    try{
      if(items.length === 0){
        window.localStorage.removeItem(CARRITO_STORAGE_KEY);
        return;
      }
      window.localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify({
        version: CARRITO_STORAGE_VERSION,
        items: items
      }));
    } catch(err){
      /* Si el almacenamiento falla (modo privado, cuota, etc.),
         el carrito sigue funcionando en memoria durante la sesión. */
    }
  }

  function notificar(){
    guardar();
    listeners.forEach(function(fn){ fn(items.slice()); });
  }

  function onChange(fn){
    if(typeof fn === 'function') listeners.push(fn);
  }

  function agregar(producto){
    if(!producto || typeof producto.id !== 'string' || !producto.id) return;
    if(!precioValido(producto.precio)) return;
    const existente = items.find(function(it){ return it.id === producto.id; });
    if(existente){
      existente.cantidad += 1;
    } else {
      items.push({
        id: producto.id,
        nombre: String(producto.nombre || ''),
        precio: Number(producto.precio),
        imagen: producto.imagen || '',
        categoria: producto.categoria || '',
        cantidad: 1
      });
    }
    notificar();
  }

  function incrementar(id){
    const it = items.find(function(x){ return x.id === id; });
    if(it){ it.cantidad += 1; notificar(); }
  }

  function decrementar(id){
    const it = items.find(function(x){ return x.id === id; });
    if(!it) return;
    if(it.cantidad > 1){
      it.cantidad -= 1;
      notificar();
    } else {
      const confirmarEliminar = window.confirm('¿Eliminar "' + it.nombre + '" del carrito?');
      if(confirmarEliminar) eliminar(id);
    }
  }

  function eliminar(id){
    items = items.filter(function(x){ return x.id !== id; });
    notificar();
  }

  function vaciar(){
    items = [];
    notificar();
  }

  function getItems(){ return items.slice(); }

  function totalUnidades(){
    return items.reduce(function(sum, it){ return sum + it.cantidad; }, 0);
  }

  function subtotal(){
    return items.reduce(function(sum, it){ return sum + (it.precio * it.cantidad); }, 0);
  }

  cargar();

  return {
    agregar: agregar,
    incrementar: incrementar,
    decrementar: decrementar,
    eliminar: eliminar,
    vaciar: vaciar,
    getItems: getItems,
    totalUnidades: totalUnidades,
    subtotal: subtotal,
    onChange: onChange
  };
})();

/* ---------- 11.3 Render del panel del carrito ---------- */

function crearFilaCarrito(item){
  const fila = document.createElement('div');
  fila.className = 'carrito-item';

  const imgWrap = document.createElement('div');
  imgWrap.className = 'carrito-item-img';
  if(item.imagen){
    const img = document.createElement('img');
    img.src = item.imagen;
    img.alt = '';
    imgWrap.appendChild(img);
  } else {
    imgWrap.textContent = '🍔';
  }

  const info = document.createElement('div');
  info.className = 'carrito-item-info';

  const nombre = document.createElement('span');
  nombre.className = 'carrito-item-nombre';
  nombre.textContent = item.nombre;

  const precioUnit = document.createElement('span');
  precioUnit.className = 'carrito-item-precio-unit';
  precioUnit.textContent = formatoPrecio(item.precio) + ' c/u';

  const qty = document.createElement('div');
  qty.className = 'carrito-item-qty';

  const btnMenos = document.createElement('button');
  btnMenos.type = 'button';
  btnMenos.textContent = '−';
  btnMenos.setAttribute('aria-label', 'Disminuir cantidad de ' + item.nombre);
  btnMenos.addEventListener('click', function(){ CarritoState.decrementar(item.id); });

  const spanQty = document.createElement('span');
  spanQty.textContent = String(item.cantidad);
  spanQty.setAttribute('aria-label', 'Cantidad: ' + item.cantidad);

  const btnMas = document.createElement('button');
  btnMas.type = 'button';
  btnMas.textContent = '+';
  btnMas.setAttribute('aria-label', 'Aumentar cantidad de ' + item.nombre);
  btnMas.addEventListener('click', function(){ CarritoState.incrementar(item.id); });

  qty.append(btnMenos, spanQty, btnMas);
  info.append(nombre, precioUnit, qty);

  const derecha = document.createElement('div');
  derecha.className = 'carrito-item-derecha';

  const subtotalSpan = document.createElement('span');
  subtotalSpan.className = 'carrito-item-subtotal';
  subtotalSpan.textContent = formatoPrecio(item.precio * item.cantidad);

  const btnEliminar = document.createElement('button');
  btnEliminar.type = 'button';
  btnEliminar.className = 'carrito-item-eliminar';
  btnEliminar.textContent = 'Eliminar';
  btnEliminar.setAttribute('aria-label', 'Eliminar ' + item.nombre + ' del carrito');
  btnEliminar.addEventListener('click', function(){ CarritoState.eliminar(item.id); });

  derecha.append(subtotalSpan, btnEliminar);
  fila.append(imgWrap, info, derecha);
  return fila;
}

function renderizarCarrito(){
  const items = CarritoState.getItems();
  const lista = document.getElementById('carritoLista');
  const vacio = document.getElementById('carritoVacio');
  const resumen = document.getElementById('carritoResumen');
  const btnTusDatos = document.getElementById('carritoTusDatos');
  if(!lista) return;

  lista.innerHTML = '';

  if(items.length === 0){
    vacio.hidden = false;
    resumen.hidden = true;
    if(btnTusDatos) btnTusDatos.disabled = true;
    /* Carrito vacío: si el usuario estaba en la vista de datos, regresarlo al carrito */
    mostrarVistaCarrito();
  } else {
    vacio.hidden = true;
    resumen.hidden = false;
    items.forEach(function(item){ lista.appendChild(crearFilaCarrito(item)); });
    document.getElementById('carritoUnidades').textContent = String(CarritoState.totalUnidades());
    document.getElementById('carritoSubtotal').textContent = formatoPrecio(CarritoState.subtotal());
    if(btnTusDatos) btnTusDatos.disabled = false;
  }

  actualizarContadorCarrito();
  actualizarResumenFormulario();
}

function actualizarContadorCarrito(){
  const total = CarritoState.totalUnidades();
  const badge = document.getElementById('carritoBadge');
  const btn = document.getElementById('btnAbrirCarrito');
  if(badge){
    badge.textContent = String(total);
    badge.hidden = total === 0;
  }
  if(btn){
    btn.setAttribute('aria-label', 'Abrir carrito, ' + total + (total === 1 ? ' producto' : ' productos'));
  }
}

/* ---------- 11.4 Apertura / cierre del panel (accesible) ---------- */

function mostrarVistaCarrito(){
  const vc = document.getElementById('carritoVista');
  const vd = document.getElementById('datosVista');
  if(vc) vc.hidden = false;
  if(vd) vd.hidden = true;
}

function mostrarVistaDatos(){
  if(CarritoState.getItems().length === 0) return;
  const vc = document.getElementById('carritoVista');
  const vd = document.getElementById('datosVista');
  if(vc) vc.hidden = true;
  if(vd) vd.hidden = false;
  actualizarResumenFormulario();
  window.setTimeout(function(){
    const primerCampo = document.getElementById('campoNombre');
    if(primerCampo) primerCampo.focus();
  }, 0);
}

function manejarTeclaCarrito(e){
  if(e.key === 'Escape'){
    cerrarCarrito();
    return;
  }
  if(e.key === 'Tab'){
    const panel = document.getElementById('carritoPanel');
    if(!panel) return;
    const vistaActiva = panel.querySelector('.carrito-vista:not([hidden])');
    if(!vistaActiva) return;
    const focosPosibles = vistaActiva.querySelectorAll('button:not([disabled]), a[href], input:not([disabled])');
    if(!focosPosibles.length) return;
    const primero = focosPosibles[0];
    const ultimo = focosPosibles[focosPosibles.length - 1];
    if(e.shiftKey && document.activeElement === primero){
      e.preventDefault(); ultimo.focus();
    } else if(!e.shiftKey && document.activeElement === ultimo){
      e.preventDefault(); primero.focus();
    }
  }
}

function abrirCarrito(){
  const overlay = document.getElementById('carritoOverlay');
  const panel = document.getElementById('carritoPanel');
  const btn = document.getElementById('btnAbrirCarrito');
  if(!overlay || !panel) return;

  mostrarVistaCarrito();
  overlay.hidden = false;
  panel.hidden = false;
  document.body.classList.add('bloqueo-scroll');
  if(btn) btn.setAttribute('aria-expanded', 'true');

  document.addEventListener('keydown', manejarTeclaCarrito);
  window.setTimeout(function(){ panel.focus(); }, 0);
}

function cerrarCarrito(){
  const overlay = document.getElementById('carritoOverlay');
  const panel = document.getElementById('carritoPanel');
  const btn = document.getElementById('btnAbrirCarrito');
  if(!overlay || !panel) return;

  overlay.hidden = true;
  panel.hidden = true;
  document.body.classList.remove('bloqueo-scroll');
  document.removeEventListener('keydown', manejarTeclaCarrito);
  if(btn){
    btn.setAttribute('aria-expanded', 'false');
    btn.focus();
  }
}

/* ---------- 11.5 Formulario: tipo de pedido y validaciones ---------- */

function actualizarTipoPedidoUI(){
  const domicilio = document.getElementById('tipoDomicilio');
  const recoger = document.getElementById('tipoRecoger');
  const esDomicilio = !!(domicilio && domicilio.checked);
  const esRecoger = !!(recoger && recoger.checked);

  const bloqueDomicilio = document.getElementById('bloqueDomicilio');
  const bloqueRecoger = document.getElementById('bloqueRecoger');
  const campoDireccion = document.getElementById('campoDireccion');
  const campoBarrio = document.getElementById('campoBarrio');

  if(bloqueDomicilio) bloqueDomicilio.hidden = !esDomicilio;
  if(bloqueRecoger) bloqueRecoger.hidden = !esRecoger;
  if(campoDireccion) campoDireccion.required = esDomicilio;
  if(campoBarrio) campoBarrio.required = esDomicilio;

  actualizarResumenFormulario();
}

/* Valida un celular colombiano (10 dígitos, inicia en 3),
   admite espacios y el indicativo +57 opcional. */
function validarCelular(valorCrudo){
  let digitos = String(valorCrudo || '').replace(/\D/g, '');
  if(digitos.length === 12 && digitos.startsWith('57')){
    digitos = digitos.slice(2);
  }
  const valido = /^3\d{9}$/.test(digitos);
  return { valido: valido, normalizado: digitos };
}

function mostrarErrorCampo(idInput, idError, mensaje){
  const input = document.getElementById(idInput);
  const error = document.getElementById(idError);
  if(input) input.setAttribute('aria-invalid', 'true');
  if(error){ error.textContent = mensaje; error.hidden = false; }
}

function limpiarErrorCampo(idInput, idError){
  const input = document.getElementById(idInput);
  const error = document.getElementById(idError);
  if(input) input.removeAttribute('aria-invalid');
  if(error){ error.textContent = ''; error.hidden = true; }
}

function validarFormularioPedido(){
  let valido = true;
  const datos = {};

  const nombreEl = document.getElementById('campoNombre');
  const nombre = nombreEl ? nombreEl.value.trim() : '';
  if(nombre.length < 3 || nombre.length > 80){
    mostrarErrorCampo('campoNombre', 'errorNombre', 'Ingresa tu nombre y apellido completo.');
    valido = false;
  } else {
    limpiarErrorCampo('campoNombre', 'errorNombre');
    datos.nombre = nombre;
  }

  const celularEl = document.getElementById('campoCelular');
  const resultadoCelular = validarCelular(celularEl ? celularEl.value : '');
  if(!resultadoCelular.valido){
    mostrarErrorCampo('campoCelular', 'errorCelular', 'Ingresa un celular colombiano válido (10 dígitos, ej: 300 123 4567).');
    valido = false;
  } else {
    limpiarErrorCampo('campoCelular', 'errorCelular');
    datos.celular = resultadoCelular.normalizado;
  }

  const tipoEl = document.querySelector('input[name="tipoPedido"]:checked');
  const errorTipo = document.getElementById('errorTipoPedido');
  if(!tipoEl){
    if(errorTipo){ errorTipo.textContent = 'Selecciona domicilio o recoger en el restaurante.'; errorTipo.hidden = false; }
    valido = false;
  } else {
    if(errorTipo) errorTipo.hidden = true;
    datos.tipoPedido = tipoEl.value;
  }

  if(tipoEl && tipoEl.value === 'domicilio'){
    const direccionEl = document.getElementById('campoDireccion');
    const direccion = direccionEl ? direccionEl.value.trim() : '';
    if(direccion.length < 5){
      mostrarErrorCampo('campoDireccion', 'errorDireccion', 'Ingresa la dirección completa.');
      valido = false;
    } else {
      limpiarErrorCampo('campoDireccion', 'errorDireccion');
      datos.direccion = direccion;
    }

    const barrioEl = document.getElementById('campoBarrio');
    const barrio = barrioEl ? barrioEl.value.trim() : '';
    if(!barrio){
      mostrarErrorCampo('campoBarrio', 'errorBarrio', 'Ingresa el barrio.');
      valido = false;
    } else {
      limpiarErrorCampo('campoBarrio', 'errorBarrio');
      datos.barrio = barrio;
    }

    datos.casa = (document.getElementById('campoCasa') || {}).value ? document.getElementById('campoCasa').value.trim() : '';
    datos.apartamento = (document.getElementById('campoApartamento') || {}).value ? document.getElementById('campoApartamento').value.trim() : '';
    datos.torre = (document.getElementById('campoTorre') || {}).value ? document.getElementById('campoTorre').value.trim() : '';
    datos.referencia = (document.getElementById('campoReferencia') || {}).value ? document.getElementById('campoReferencia').value.trim() : '';
  }

  const pagoEl = document.querySelector('input[name="formaPago"]:checked');
  const errorPago = document.getElementById('errorFormaPago');
  if(!pagoEl){
    if(errorPago){ errorPago.textContent = 'Selecciona una forma de pago.'; errorPago.hidden = false; }
    valido = false;
  } else {
    if(errorPago) errorPago.hidden = true;
    datos.formaPago = pagoEl.value;
  }

  const items = CarritoState.getItems();
  const itemsValidos = items.length > 0 && items.every(function(it){ return precioValido(it.precio) && it.cantidad >= 1; });
  if(!itemsValidos) valido = false;

  return { valido: valido, datos: datos, items: items };
}

/* Resumen en vivo dentro del formulario (subtotal, envío, total) */
function actualizarResumenFormulario(){
  const contenedor = document.getElementById('resumenProductos');
  if(!contenedor) return;

  const items = CarritoState.getItems();
  const subtotal = CarritoState.subtotal();

  contenedor.innerHTML = '';
  items.forEach(function(it){
    const fila = document.createElement('div');
    fila.className = 'resumen-producto-fila';
    const izq = document.createElement('span');
    izq.textContent = it.cantidad + ' × ' + it.nombre;
    const der = document.createElement('span');
    der.textContent = formatoPrecio(it.precio * it.cantidad);
    fila.append(izq, der);
    contenedor.appendChild(fila);
  });

  document.getElementById('resumenSubtotal').textContent = formatoPrecio(subtotal);
  document.getElementById('resumenTotal').textContent = formatoPrecio(subtotal);

  const tipoSeleccionado = document.querySelector('input[name="tipoPedido"]:checked');
  const envioFila = document.getElementById('resumenEnvioFila');
  const envioSpan = document.getElementById('resumenEnvio');
  const avisoEnvio = document.getElementById('resumenAvisoEnvio');

  if(tipoSeleccionado && tipoSeleccionado.value === 'domicilio'){
    envioSpan.textContent = 'Por confirmar';
    if(envioFila) envioFila.dataset.estado = 'pendiente';
    if(avisoEnvio) avisoEnvio.hidden = false;
  } else if(tipoSeleccionado && tipoSeleccionado.value === 'recoger'){
    envioSpan.textContent = 'Sin costo de envío';
    if(envioFila) envioFila.dataset.estado = '';
    if(avisoEnvio) avisoEnvio.hidden = true;
  } else {
    envioSpan.textContent = '—';
    if(envioFila) envioFila.dataset.estado = '';
    if(avisoEnvio) avisoEnvio.hidden = true;
  }
}

/* ---------- 11.6 Mensaje de WhatsApp ---------- */

function construirMensajeWhatsApp(datos, items){
  const subtotalGeneral = items.reduce(function(sum, it){ return sum + (it.precio * it.cantidad); }, 0);
  const esDomicilio = datos.tipoPedido === 'domicilio';

  let msg = '🍔 *NUEVO PEDIDO — WARIO BROSS*\n\n';

  msg += '👤 *DATOS DEL CLIENTE*\n';
  msg += 'Nombre: ' + datos.nombre + '\n';
  msg += 'Celular: ' + datos.celular + '\n\n';

  msg += '📦 *TIPO DE PEDIDO*\n';
  msg += 'Modalidad: ' + (esDomicilio ? 'Domicilio' : 'Recoger en el restaurante') + '\n\n';

  if(esDomicilio){
    msg += '📍 *DATOS DE ENTREGA*\n';
    msg += 'Dirección: ' + datos.direccion + '\n';
    msg += 'Casa: ' + (datos.casa || 'No aplica') + '\n';
    msg += 'Apartamento: ' + (datos.apartamento || 'No aplica') + '\n';
    msg += 'Torre: ' + (datos.torre || 'No aplica') + '\n';
    msg += 'Barrio: ' + datos.barrio + '\n';
    msg += 'Referencia adicional: ' + (datos.referencia || 'No indicada') + '\n\n';
  } else {
    msg += '📍 *RECOGER EN EL RESTAURANTE*\n';
    msg += 'Cra. 85C # 43-69, El Caney, Cali, Colombia\n\n';
  }

  msg += '💳 *FORMA DE PAGO*\n';
  msg += datos.formaPago + '\n\n';

  msg += '🛒 *DETALLE DEL PEDIDO*\n';
  items.forEach(function(it){
    msg += it.cantidad + ' x ' + it.nombre + '\n';
    msg += 'Precio unitario: ' + formatoPrecio(it.precio) + '\n';
    msg += 'Subtotal: ' + formatoPrecio(it.precio * it.cantidad) + '\n\n';
  });

  msg += '💰 *RESUMEN DE VALORES*\n';
  msg += 'Subtotal de productos: ' + formatoPrecio(subtotalGeneral) + '\n';
  msg += 'Envío: ' + (esDomicilio ? 'Por confirmar' : 'Sin costo de envío') + '\n';
  msg += 'Total de productos: ' + formatoPrecio(subtotalGeneral) + '\n\n';

  if(esDomicilio){
    msg += 'ℹ️ Los gastos de envío se informarán una vez se confirme el pedido.\n\n';
  }

  msg += '✅ Pedido preparado desde la página web de Wario Bross.';

  return msg;
}

/* ---------- 11.7 Envío del pedido (con protección anti doble clic) ---------- */

let enviandoPedido = false;

function manejarEnvioPedido(e){
  e.preventDefault();
  if(enviandoPedido) return;

  const resultado = validarFormularioPedido();
  if(!resultado.valido){
    const primerInvalido = document.querySelector('#formPedido [aria-invalid="true"]');
    if(primerInvalido){ primerInvalido.focus(); }
    return;
  }

  enviandoPedido = true;
  const btn = document.getElementById('btnEnviarPedido');
  if(btn){ btn.disabled = true; btn.textContent = 'Abriendo WhatsApp…'; }

  const mensaje = construirMensajeWhatsApp(resultado.datos, resultado.items);
  const url = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(mensaje);

  window.open(url, '_blank', 'noopener');

  const aviso = document.getElementById('avisoWhatsapp');
  if(aviso){
    aviso.textContent = 'Se abrió WhatsApp con tu pedido preparado. Revisa el mensaje y pulsa Enviar para compartirlo con el restaurante.';
    aviso.hidden = false;
  }

  window.setTimeout(function(){
    enviandoPedido = false;
    if(btn){ btn.disabled = false; btn.textContent = 'Enviar pedido'; }
  }, 2500);
}

/* ---------- 11.8 Inicialización (protegida contra doble init) ---------- */

(function initCarrito(){
  if(window.__warioCartInit) return;
  window.__warioCartInit = true;

  const btnAbrir = document.getElementById('btnAbrirCarrito');
  const btnCerrarCarrito = document.getElementById('carritoCerrar');
  const btnCerrarDatos = document.getElementById('datosCerrar');
  const overlay = document.getElementById('carritoOverlay');
  const btnVaciar = document.getElementById('carritoVaciar');
  const btnTusDatos = document.getElementById('carritoTusDatos');
  const btnVolver = document.getElementById('datosVolver');
  const linkVerMenu = document.getElementById('carritoVerMenu');
  const form = document.getElementById('formPedido');

  if(btnAbrir) btnAbrir.addEventListener('click', abrirCarrito);
  if(btnCerrarCarrito) btnCerrarCarrito.addEventListener('click', cerrarCarrito);
  if(btnCerrarDatos) btnCerrarDatos.addEventListener('click', cerrarCarrito);
  if(overlay) overlay.addEventListener('click', cerrarCarrito);
  if(linkVerMenu) linkVerMenu.addEventListener('click', cerrarCarrito);

  if(btnVaciar){
    btnVaciar.addEventListener('click', function(){
      if(CarritoState.getItems().length === 0) return;
      if(window.confirm('¿Vaciar todo el carrito?')){ CarritoState.vaciar(); }
    });
  }

  if(btnTusDatos) btnTusDatos.addEventListener('click', mostrarVistaDatos);
  if(btnVolver) btnVolver.addEventListener('click', mostrarVistaCarrito);

  document.querySelectorAll('input[name="tipoPedido"]').forEach(function(radio){
    radio.addEventListener('change', actualizarTipoPedidoUI);
  });

  if(form) form.addEventListener('submit', manejarEnvioPedido);

  CarritoState.onChange(renderizarCarrito);
  renderizarCarrito();
})();
