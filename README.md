# POHL Chapa y Pintura — Gestión del Taller

Sistema web (GitHub Pages, sin servidor) para el taller de Diego Pohl, Federal (Entre Ríos).

- `index.html` — el sistema: órdenes de trabajo, recepción con fotos y firma, presupuestos,
  inventario, venta de mostrador, caja, clientes, empleados y comisiones.
- `seguimiento.html` — página que ve el cliente con el link o QR de su orden.
- `version-anterior.html` — la app anterior (solo presupuestos), conservada por seguridad.
- `version.json` — versión publicada; la app la consulta para avisar que hay actualización.
- `sw.js` — service worker "primero la red" (las actualizaciones llegan solas, funciona sin conexión).

## Datos
Se guardan en el dispositivo: `localStorage['pohl_taller']` y las fotos en IndexedDB `pohl_taller_fotos`.
Los presupuestos de la versión anterior (`localStorage['pohl_v6']`) se migran al abrir la versión nueva
y **no se borran**; además se guarda una copia en `pohl_v6_respaldo`.

## Cómo publicar una actualización sin que nadie pierda datos
1. No cambiar las claves de almacenamiento.
2. Si cambia la forma de los datos, subir `SCHEMA` y agregar el paso en `migrate()` de `index.html`.
3. Subir `APP_VERSION` en `index.html` **y** `version` en `version.json` (mismo número).
4. Quien tenga el sistema abierto ve "Hay una actualización". Al aceptar se guarda un respaldo
   automático (`pohl_taller_respaldo_previo`) y se recarga. Desde Configuración se puede volver a ese respaldo.

## Abono mensual (panel del dueño)
- `dueno.html` — panel del dueño del sistema (no usa el usuario de Diego). Se entra con un token
  fine-grained de GitHub con permiso *Contents: Read and write* solo sobre este repositorio.
- `licencia.json` — lo escribe el panel: monto, vencimiento, días de aviso y de gracia, link de pago
  de Mercado Pago, alias, estado (activo / suspendido). El sistema de Diego lo lee cada vez que se abre.
- Avisos: amarillo N días antes, rojo durante la gracia, y bloqueo al terminar la gracia o si se suspende.
  El bloqueo nunca borra datos: permite pagar, avisar "Ya pagué" y descargar la copia de seguridad.
- El dinero va directo a la cuenta de Mercado Pago dueña del link de pago (o suscripción) cargado.
