# SHU-SHU® · Configurador B2B

Configurador mayorista de la página **PERSONALIZÁ TU PRODUCTO** de la tienda SHU-SHU®.

> ⚠️ **Repositorio público.** Acá van solo precios de venta. Nunca subas costos internos, márgenes, proveedores ni datos de clientes.

## Archivos

| Archivo | Qué es |
|---|---|
| `src/shushu-config.js` | **Productos, componentes, cantidades, precios de venta y tiempos.** Es el único archivo que hay que editar para cambiar datos. |
| `src/shushu-configurator.js` | Lógica del configurador (JavaScript sin dependencias). |
| `src/shushu-configurator.css` | Estilos, todos dentro de `.shb2b`. |
| `loader.html` | Código que va en el bloque "Código" del tema Ipanema. Carga lo anterior solo en `/personaliza-tu-producto`. |
| `dev/index.html` | Prueba local: abrilo con doble clic. |

## Cómo se publica una versión

Los archivos se sirven desde jsDelivr con una versión fija (tag), por ejemplo
`https://cdn.jsdelivr.net/gh/shushubsas/configurador-b2b@v0.1.0/src/shushu-config.js`.

1. Commit de los cambios y tag nuevo (`v0.1.1`, `v0.2.0`…).
2. Cambiar `VERSION` en el bloque "Código" del tema borrador.
3. Revisar la vista previa del borrador.

## Etapas

1. ✅ Pasos, opciones y estructura de configuración (datos de ejemplo).
2. Cotizador por volumen.
3. Logo PNG y mockup en Canvas.
4. Resumen final y pedido por WhatsApp.
5. Ajustes y rendimiento.
