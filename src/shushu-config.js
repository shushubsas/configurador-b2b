/*
 * SHU-SHU® · Configurador B2B — CONFIGURACIÓN
 * ------------------------------------------------------------------
 * Este es el ÚNICO archivo que hay que editar para cambiar productos,
 * componentes, cantidades, precios de venta y tiempos de producción.
 *
 * ⚠️ El repositorio es PÚBLICO: acá van solo PRECIOS DE VENTA.
 *    Nunca cargues costos internos, márgenes ni proveedores.
 *
 * ⚠️ Todos los datos actuales son de EJEMPLO. Reemplazalos por los reales.
 *
 * Cómo se calcula el precio (se implementa en la etapa 2):
 *   precio unitario = precio del producto para la escala elegida
 *                   + suma de los recargos por unidad de cada opción
 *   precio total    = precio unitario × cantidad
 *
 * Reglas de las opciones:
 *   - id:            identificador único dentro del paso (sin espacios).
 *   - label:         texto que ve el cliente.
 *   - price:         recargo por unidad (número). 0 = sin recargo.
 *                    También puede ser un objeto por escala: { 50: 300, 100: 250, ... }
 *   - availableFor:  (opcional) lista de ids de producto donde se ofrece.
 *                    Si no está, la opción se ofrece para todos los productos.
 *   - swatch:        (solo pasos de color) color en hexadecimal para la muestra.
 *   - image:         (opcional) URL de una imagen para la tarjeta.
 *
 * Para AGREGAR UN PASO NUEVO (por ejemplo "Packaging"), copiá un bloque de
 * `steps` y cambiale id, title y options. No hace falta tocar otro archivo.
 */
window.SHUSHU_B2B_CONFIG = {
  brand: 'SHU-SHU®',
  currency: 'ARS',
  locale: 'es-AR',

  // Mientras sea true, la página muestra el aviso "Precios de ejemplo".
  examplePrices: true,

  // Número de WhatsApp en formato internacional, sin "+" ni espacios.
  // Ej.: '5491112345678'. Vacío = el botón queda deshabilitado (etapa 4).
  whatsappNumber: '',

  // Escalas de cantidad que puede elegir el cliente.
  quantities: [50, 100, 200, 500, 1000],

  // Productos: precio de venta por unidad según la escala (EJEMPLO).
  products: [
    {
      id: 'correa-celular',
      label: 'Correa para celular',
      description: 'Ejemplo — reemplazar por el producto real.',
      image: '',
      productionDays: { min: 15, max: 20 },
      prices: { 50: 9000, 100: 8200, 200: 7500, 500: 6800, 1000: 6200 },
      // Zona donde se apoya el logo en el mockup (etapa 3), en % de la foto.
      mockup: { image: '', printArea: { x: 35, y: 40, w: 30, h: 12 } }
    },
    {
      id: 'correa-crossbody',
      label: 'Correa crossbody',
      description: 'Ejemplo — reemplazar por el producto real.',
      image: '',
      productionDays: { min: 20, max: 25 },
      prices: { 50: 12000, 100: 11000, 200: 10200, 500: 9300, 1000: 8600 },
      mockup: { image: '', printArea: { x: 35, y: 40, w: 30, h: 12 } }
    },
    {
      id: 'llavero',
      label: 'Llavero',
      description: 'Ejemplo — reemplazar por el producto real.',
      image: '',
      productionDays: { min: 10, max: 15 },
      prices: { 50: 4500, 100: 4000, 200: 3600, 500: 3200, 1000: 2900 },
      mockup: { image: '', printArea: { x: 35, y: 40, w: 30, h: 12 } }
    }
  ],

  // Pasos del configurador, en orden. El paso "producto", "cantidad" y
  // "resumen" los agrega el sistema automáticamente.
  steps: [
    {
      id: 'modelo',
      title: 'Modelo de correa',
      help: 'Elegí el modelo base.',
      options: [
        { id: 'plana', label: 'Plana (ejemplo)', price: 0 },
        { id: 'tubular', label: 'Tubular (ejemplo)', price: 300 },
        { id: 'trenzada', label: 'Trenzada (ejemplo)', price: 600, availableFor: ['correa-celular', 'correa-crossbody'] }
      ]
    },
    {
      id: 'material',
      title: 'Material',
      options: [
        { id: 'poliester', label: 'Poliéster (ejemplo)', price: 0 },
        { id: 'nylon', label: 'Nylon (ejemplo)', price: 250 },
        { id: 'cuero-eco', label: 'Cuero ecológico (ejemplo)', price: 900 }
      ]
    },
    {
      id: 'color',
      title: 'Color',
      kind: 'color',
      options: [
        { id: 'negro', label: 'Negro', swatch: '#111111', price: 0 },
        { id: 'blanco', label: 'Blanco', swatch: '#F5F5F5', price: 0 },
        { id: 'rojo', label: 'Rojo', swatch: '#C90109', price: 0 },
        { id: 'azul', label: 'Azul', swatch: '#1F3A93', price: 0 },
        { id: 'verde', label: 'Verde', swatch: '#2E7D32', price: 0 }
      ]
    },
    {
      id: 'adaptador',
      title: 'Tipo de adaptador',
      options: [
        { id: 'universal', label: 'Universal (ejemplo)', price: 0, availableFor: ['correa-celular', 'correa-crossbody'] },
        { id: 'magsafe', label: 'Compatible MagSafe (ejemplo)', price: 1500, availableFor: ['correa-celular'] },
        { id: 'sin-adaptador', label: 'Sin adaptador', price: 0 }
      ]
    },
    {
      id: 'hebilla',
      title: 'Tipo de hebilla',
      options: [
        { id: 'metal-plateada', label: 'Metal plateada (ejemplo)', price: 400 },
        { id: 'metal-dorada', label: 'Metal dorada (ejemplo)', price: 500 },
        { id: 'plastica', label: 'Plástica (ejemplo)', price: 0 }
      ]
    },
    {
      id: 'estampa',
      title: 'Estampa o diseño',
      options: [
        { id: 'logo-1-color', label: 'Logo a 1 color (ejemplo)', price: 350 },
        { id: 'logo-full-color', label: 'Logo full color (ejemplo)', price: 700 },
        { id: 'patron', label: 'Patrón repetido (ejemplo)', price: 900 },
        { id: 'sin-estampa', label: 'Sin estampa', price: 0 }
      ]
    }
  ]
};
