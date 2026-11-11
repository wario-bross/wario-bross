/* ============================================================
   js/datos.js — DATOS DEL NEGOCIO (lo único que se edita)
   Contiene CONFIG, MENU, RESENAS y DESTACADOS.
   Cargado ANTES que js/app.js (ambos con "defer", en este orden).

   Después de editar este archivo:
     1) Ejecuta:  node scripts/prerender.js
        (regenera el HTML estático para buscadores y rastreadores de IA)
     2) Si cambiaste precios/productos/horarios, actualiza también el
        JSON-LD (Schema.org) en el <head> de index.html; el script avisa
        si los precios no coinciden.
============================================================= */

/* ============================================================
   CONFIGURACIÓN CENTRAL DEL SITIO
   Única fuente de verdad para datos reutilizables. No inventar
   valores aquí: todo debe provenir de información confirmada.
============================================================= */
const CONFIG = Object.freeze({
  whatsappNumber: "573214477999",
  instagramHandle: "@warioburger",
  instagramUrl: "https://instagram.com/warioburger",
  address: "Cra. 85C # 43-69, El Caney, Cali, Colombia",
  mapsUrl: "https://maps.app.goo.gl/h5hn3VZ8JjnQwdgH6",
  phoneDisplay: "321 447 7999",
  phoneHref: "+573214477999",
  hours: [
    { dia: "Lunes",     abre: "4:00 p. m.", cierra: "12:00 a. m." },
    { dia: "Martes",    abre: "4:00 p. m.", cierra: "12:00 a. m." },
    { dia: "Miércoles", abre: "4:00 p. m.", cierra: "12:00 a. m." },
    { dia: "Jueves",    abre: "4:00 p. m.", cierra: "12:00 a. m." },
    { dia: "Viernes",   abre: "4:00 p. m.", cierra: "1:00 a. m." },
    { dia: "Sábado",    abre: "4:00 p. m.", cierra: "1:00 a. m." },
    { dia: "Domingo",   abre: "4:00 p. m.", cierra: "12:00 a. m." }
  ]
});

/* ============================================================
   DATOS DEL MENÚ
   Fuente única de verdad: idéntica a la información real del
   menú digital de Wario Bross. No se inventan productos,
   precios, ingredientes ni categorías.
============================================================= */
const MENU = [
  {
    categoria: "PROMOS",
    icono: "🎉",
    productos: [
      { nombre: "Combo Familiar Wario (Bacon)", desc: "4 Wario Burger con tocineta, 4 papas a la francesa y 1 gaseosa litro Postobón.", imagen: "img/products/combo-familiar-wario-bacon.webp", precio: 67000, personas: 4 },
      { nombre: "Combo Parejas", desc: "2 Wario Burger, 2 limonadas, 1 papas a la francesa con tocineta y queso cheddar. ¡Gratis 1 copa de helado!", imagen: "img/products/combo-parejas.webp", precio: 40000, personas: 2 },
      { nombre: "2x1 Wario Burger", desc: "2 hamburguesas con carne de res tradicional, papas a la francesa, acompañadas con salsa caleña.", imagen: "img/products/2x1-wario-burger.webp", precio: 28000, personas: 2 },
      { nombre: "2x1 Big Angus Burger", desc: "2 Hamburguesas BIG Burger, con carne 100% Black Angus de 140 grs, importada, con papas a la francesa y nuestra salsa Caleña.", imagen: "img/products/2x1-big-angus-burger.webp", precio: 39400 }
    ]
  },
  {
    categoria: "PREMIUM BURGERS",
    icono: "🍔",
    productos: [
      { nombre: "Generación Crystal", desc: "Doble carne angus 200g, pan artesanal de orégano, doble queso cheddar, doble tocino ahumado pork, cebolla crispy, salsa de maracuyá, lechuga y tomates frescos, papas a la francesa y salsa caleña.", imagen: "img/products/generacion-crystal.webp", precio: 29900 },
      { nombre: "Generación Milenials", desc: "Carne angus 140g, pan artesanal, quesillo, costilla carnuda, pepinillos dulces, cebolla caramelizada, salsa de maracuyá, lechuga fresca, papas a la francesa y salsa caleña.", imagen: "img/products/generacion-milenials.webp", precio: 25900 },
      { nombre: "Generación X", desc: "Carne angus 140g, pan artesanal, doble queso mozarella, tocino ahumado pork, cebolla encurtida en salsa de arrechón, lechuga fresca, papas a la francesa y salsa con sabor a Cali.", imagen: "img/products/generacion-x.webp", precio: 25900 },
      { nombre: "American Angus", desc: "Pan artesanal a las finas hierbas, 140g de carne 100% Angus, tocino ahumado, queso cheddar, lechuga crespa, tomates frescos, cebolla crispy, papas a la francesa y salsa de la casa.", imagen: "img/products/american-angus.webp", precio: 26900 }
    ]
  },
  {
    categoria: "CLASIC BURGERS",
    icono: "🍔",
    productos: [
      { nombre: "Wario Golden", desc: "Pan brioche con ajonjolí black, 140g de res, tocino ahumado, ripio de papa, cebolla caramelizada, lechuga crespa, 160g de queso doble crema fundido enchapado en oro, papas a la francesa y salsa caleña.", imagen: "img/products/wario-golden.webp", precio: 27900 },
      { nombre: "Triple Mela", desc: "Pan artesanal de orégano, 140g de res, costilla, tocino ahumado, maduritos, queso cheddar, cebolla crispy, lechuga crespa, papas a la francesa y salsa caleña.", imagen: "img/products/triple-mela.webp", precio: 27900 },
      { nombre: "Chicken Express", desc: "Pan artesanal a las finas hierbas, 120g de pollo asado en trocitos, tocino ahumado, ripio de papa, lechuga crespa, cebolla caramelizada, queso cheddar, papas a la francesa y salsa con sabor a Cali.", imagen: "img/products/chicken-express.webp", precio: 23900 },
      { nombre: "American Express", desc: "Pan artesanal a las finas hierbas, 140g de res, tocino ahumado, ripio de papa, lechuga crespa, cebolla caramelizada, queso cheddar, papas a la francesa y salsa con sabor a Cali.", imagen: "img/products/american-express.webp", precio: 21900 }
    ]
  },
  {
    categoria: "HOT DOGS",
    icono: "🌭",
    productos: [
      { nombre: "Mexican", desc: "Pan artesanal brioche, salchicha americana importada, tocino ahumado, queso cheddar fundido, guacamole, nachos, ripio de papa, salsa de tomate y tajín.", imagen: "img/products/mexican-hotdog.webp", precio: 17800 },
      { nombre: "Ranch XXL", desc: "Pan artesanal brioche, salchicha ranchera XXL, queso cheddar, mayonesa, cebolla y tomates picados frescos, ripio de papa, salsa de tomate y salsa con sabor a Cali.", imagen: "img/products/ranch-xxl.webp", precio: 15900 },
      { nombre: "American", desc: "Pan artesanal brioche, salchicha ranchera XXL, queso cheddar, mayonesa, cebolla y tomates picados frescos, ripio de papa, salsa de tomate y salsa con sabor a Cali.", imagen: "img/products/american-hotdog.webp", precio: 14900 }
    ]
  },
  {
    categoria: "ENTRADAS",
    icono: "🧺",
    productos: [
      { nombre: "Nachos Tex-Mex", desc: "Para 2 personas. Nachos con carne molida, guacamole, pico e' gallo y queso cheddar.", imagen: "img/products/nachos-tex-mex.webp", precio: 20000, personas: 2 },
      { nombre: "Bravas Wario", desc: "Papas fritas con chorizo santarrosano, pimienta al toque y pico e' gallo.", imagen: "img/products/bravas-wario.webp", precio: 16000 },
      { nombre: "Papas Crocantes", desc: "Cantidades alarmantes de crocantes papas fritas con la deliciosa salsa caleña.", imagen: "img/products/papas-crocantes.webp", precio: 6900 }
    ]
  },
  {
    categoria: "SALCHIS",
    icono: "🌽",
    productos: [
      { nombre: "Killer Bulled", desc: "Para 4 personas. Carne molida, pollo desmechado, tocino, queso mozarella fundido, maicitos dulces y salsas.", imagen: "img/products/killer-bulled.webp", precio: 49900, personas: 4 },
      { nombre: "Salvajada Wario", desc: "Para 3 personas. Pollo, res, costilla ahumada sin hueso, ripio de papa, queso mozarella rayado y salsa caleña.", imagen: "img/products/salvajada-wario.webp", precio: 44900, personas: 3 },
      { nombre: "Mexicali", desc: "Para 2 personas. Entrada de nachos con guacamole, pollo desmechado con pico de gallo, costillas a la BBQ sweet, queso mozarella y salsas.", imagen: "img/products/mexicali.webp", precio: 40900, personas: 2 },
      { nombre: "Salvajada Special", desc: "Para 2 personas. Trocitos de pollo y res, ripio de papa, queso mozarella rayado y salsa caleña.", imagen: "img/products/salvajada-especial.webp", precio: 36900, personas: 2 },
      { nombre: "Salchi Personal", desc: "Personal, con ripio de papa, queso mozarella rayado, salchicha, papas fritas y salsa caleña.", imagen: "img/products/salchi-personal.webp", precio: 15000 }
    ]
  },
  {
    categoria: "ASADOS / GRILL",
    icono: "🔥",
    productos: [
      { nombre: "Picada para 4 Personas", desc: "Costilla, chorizo, pollo, res, cerdo, moneditas de plátano, papas a la francesa y ensalada mixta.", imagen: "img/products/picada-para-4-personas.webp", precio: 75000, personas: 4 },
      { nombre: "Picada para 2 Personas", desc: "Costilla, chorizo, pollo, res, cerdo, papas a la francesa y ensalada mixta.", imagen: "img/products/picada-para-2-personas.webp", precio: 45000, personas: 2 },
      { nombre: "Punta de Anca", desc: "Charcoal-Grilled. Corte de punta de anca de 300g, croquetas de yuca frita y ensalada mixta, acompañadas con chimichurri y guacamole.", imagen: "img/products/punta-de-anca.webp", precio: 39900 },
      { nombre: "Churrasco Argentino", desc: "Sirloin Steak. Corte de lomo caracha de 300g, croquetas de yuca frita y ensalada mixta, acompañadas con chimichurri y guacamole.", imagen: "img/products/churrasco-argentino.webp", precio: 36900 },
      { nombre: "Costillas BBQ Sweet", desc: "Carne de costilla de 250g, croquetas de yuca, BBQ sweet, guacamole o salsa caleña.", imagen: "img/products/costillas-bbq-sweet.webp", precio: 24900 },
      { nombre: "Chuzo Mixto", desc: "Costilla, cerdo y pollo, con croquetas de yuca, ensalada mixta, acompañada con chimichurri y guacamole.", imagen: "img/products/chuzo-mixto.webp", precio: 21900 },
      { nombre: "Chuzo de Pollo Gratinado", desc: "Filete de pollo, con croquetas de yuca, ensalada mixta, acompañada con chimichurri y guacamole.", imagen: "img/products/chuzo-de-pollo-gratinado.webp", precio: 21900 }
    ]
  },
  {
    categoria: "MAICITOS",
    icono: "🌽",
    productos: [
      { nombre: "Maíz Ranch", desc: "Personal, con maicitos dulces, salchicha ranchera, tocineta, queso mozarella, ripio de papa, lechuga y salsa caleña.", imagen: "img/products/maiz-ranch.webp", precio: 22900 },
      { nombre: "Maíz Special", desc: "Personal, con maicitos dulces, pollo, tocineta, queso mozarella, ripio de papa, lechuga crespa y salsa con sabor a Cali.", imagen: "img/products/maiz-special.webp", precio: 21900 },
      { nombre: "Mazorcada Mixta Wario", desc: "Para 2 personas, con maicitos dulces, pollo, res, costilla carnuda, queso mozarella, ripio de papa, lechuga y salsa caleña.", imagen: "img/products/maiz-wario.webp", precio: 42000, personas: 2 }
    ]
  },
  {
    categoria: "BEBIDAS",
    icono: "🥤",
    productos: [
      { nombre: "Postobón 400 ml", desc: "Gaseosa surtidos disponibles.", imagen: "img/products/postobon-400-ml.webp", precio: 4500 },
      { nombre: "Coca-Cola 400 ml", desc: "", imagen: "img/products/coca-cola-400-ml.webp", precio: 5500 },
      { nombre: "Ginger Ale 400 ml", desc: "", imagen: "img/products/ginger-400-ml.webp", precio: 5500 },
      { nombre: "Postobón 1 lt", desc: "Para compartir en mesa.", imagen: "img/products/postobon-1-lt.webp", precio: 7000 },
      { nombre: "Coca-Cola 1.5 lt", desc: "Para compartir en mesa.", imagen: "img/products/coca-cola-1-5-lt.webp", precio: 10000 },
      { nombre: "Agua Natural 600 ml", desc: "", imagen: "img/products/agua-natural.webp", precio: 2800 },
      { nombre: "Agua con Gas 600 ml", desc: "", imagen: "img/products/agua-gas.webp", precio: 3500 }
    ]
  },
  {
    categoria: "CERVEZAS",
    icono: "🍺",
    productos: [
      { nombre: "Stella Artois", desc: "", imagen: "img/products/stella-artois.webp", precio: 7000 },
      { nombre: "Coronita", desc: "", imagen: "img/products/coronita.webp", precio: 6000 },
      { nombre: "Club Colombia", desc: "", imagen: "img/products/club-colombia.webp", precio: 6000 },
      { nombre: "Águila Light", desc: "", imagen: "img/products/aguila-light.webp", precio: 5500 },
      { nombre: "Poker", desc: "", imagen: "img/products/poker.webp", precio: 5500 }
    ]
  },
  {
    categoria: "LIMONADAS",
    icono: "🍋",
    productos: [
      { nombre: "Limonada Natural", desc: "", imagen: "img/products/limonada-natural-16oz.webp", precio: 7000 },
      { nombre: "Limonada Cerezada", desc: "", imagen: "img/products/limonada-cerezada.webp", precio: 10000 },
      { nombre: "Limonada de Coco", desc: "", imagen: "img/products/limonada-de-coco.webp", precio: 10000 },
      { nombre: "Limonada Frutos Rojos", desc: "", imagen: "img/products/limonada-frutos-rojos.webp", precio: 10000 }
    ]
  },
  {
    categoria: "JUGOS",
    icono: "🧃",
    sub: "Sabores: mango, mora, fresa, lulo, maracuyá",
    productos: [
      { nombre: "Jugo Natural 16 oz", desc: "Elige tu sabor: mango, mora, fresa, lulo o maracuyá.", imagen: "img/products/jugo-natural.webp", precio: 7000 },
      { nombre: "Jugo en Leche 16 oz", desc: "Elige tu sabor: mango, mora, fresa, lulo o maracuyá.", imagen: "img/products/jugo-en-leche.webp", precio: 9000 },
      { nombre: "Jarra Natural", desc: "Elige tu sabor: mango, mora, fresa, lulo o maracuyá.", imagen: "img/products/jarra-jugo-natural.webp", precio: 19000 },
      { nombre: "Jarra en Leche", desc: "Elige tu sabor: mango, mora, fresa, lulo o maracuyá.", imagen: "img/products/jarra-en-leche.webp", precio: 24000 }
    ]
  }
];

/* ============================================================
   DATOS DE RESEÑAS (GOOGLE MAPS)
   Transcritas manualmente por el cliente desde Google Maps.
   No se scrapea ni se usa la API de Google. "estrellas: null"
   significa que el dato no fue proporcionado; no se inventa.
============================================================= */
const RESENAS = [
  { nombre: "Alexander Salazar Marin", reseñasAutor: "2 reseñas", estrellas: 5, tiempo: "Hace un mes", texto: "Atención super ágil y amable, siempre piensan en lo mejor que el usuario desea comer. Ambiente súper agradable y de fácil acceso. Volveré a este lugar.", link: "https://maps.app.goo.gl/r52YrmGBNVtK9kGm8" },
  { nombre: "Paris Michell", reseñasAutor: "8 reseñas · 2 fotos", estrellas: 5, tiempo: "Hace un mes", texto: "Tuve la oportunidad de comer ahí, el lugar me encantó. El servicio fue excelente, la comida estuvo muy exquisita y me gustó mucho la atención. Literalmente recomendado 100 por ciento.", link: "https://maps.app.goo.gl/4Qu8CgGnbVkEUE1z9" },
  { nombre: "Daniela Alexandra Escobar", reseñasAutor: "3 reseñas", estrellas: 5, tiempo: "Hace un mes", texto: "He comido muchas veces ahí, en especial la promo de 2x1 en perros, y la verdad me encanta la atención y el sabor de la comida. Dios mío, ni hablar, qué cosa tan sabrosa.", link: "https://maps.app.goo.gl/bb9tArzbFmWqMSQU7" },
  { nombre: "Mara Lucia López Ariza", reseñasAutor: "2 reseñas · 2 fotos", estrellas: 5, tiempo: "Hace un mes", texto: "Rápida atención. Juegos de mesa disponibles, que entretienen y permiten distraerse mientras te sirven.", link: "https://maps.app.goo.gl/TJ9dkQR3HHdrHgCM6" },
  { nombre: "Jorch Alvarez", reseñasAutor: "4 reseñas · 3 fotos", estrellas: null, tiempo: "Hace 2 meses", texto: "Excelente ambiente. Excelente la atención a mesa y ni hablar de la comida, súper recomendable este lugar.", link: "https://maps.app.goo.gl/caakP94DBwE9cFhb6" }
];

/* ============================================================
   PRODUCTOS DESTACADOS
   Para cambiar los destacados, edita solo esta lista (nombres
   exactos del array MENU). Precio, foto y descripción salen de MENU.
============================================================= */
const DESTACADOS = ["Combo Parejas", "2x1 Big Angus Burger", "Generación Crystal"];
