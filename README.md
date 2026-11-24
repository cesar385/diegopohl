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
- `dueno.html` — panel del dueño del sistema, con usuario y contraseña propios (link «Administración» en el pie).
  El token de GitHub y la llave de firma van cifrados (AES-GCM, clave PBKDF2 de usuario+contraseña, 600.000 vueltas)
  en `dueno-acceso.json`, así se puede entrar desde cualquier equipo.
- `licencia.json` — la publica el panel **firmada** (ECDSA P-256). La llave privada vive solo en el
  navegador del dueño (con un archivo de respaldo); la pública está en `licencia-clave.js`.
- Si no paga, no puede usar el sistema: aviso N días antes y bloqueo al vencer (gracia 0 por defecto).
  Una licencia alterada o sin firma bloquea, y si no se puede verificar por más de 72 h, también.
  El bloqueo nunca borra datos: permite pagar, avisar "Ya pagué" y descargar la copia de seguridad.
- El cobro es con un plan de suscripción o link de pago de Mercado Pago del dueño (la plata va
  directo a su cuenta). La tasa de Mercado Pago (7,99%) está incluida en el precio; el panel muestra el neto.

## Seguridad
- Contraseñas con PBKDF2-SHA256 (210.000 vueltas) y sal por usuario. No hay contraseñas en el código.
- No se obliga a cambiar la contraseña ni a cumplir un formato. 5 intentos fallidos bloquean (5 min, y se duplica).
- La sesión vence tras 12 h sin uso. Recuperación de contraseña con código firmado desde el panel (24 h, un uso).
- Content-Security-Policy, sin referrer y todas las librerías servidas desde `vendor/`.

## Páginas legales
`terminos.html` y `cookies.html`, enlazadas en el pie de todas las páginas. Se aceptan una vez al ingresar
(se guarda en los datos del taller; si cambian, subir `LEGAL_VERSION` en index.html para volver a pedirlas).

## Estilos
`vendor/app.css` se genera con Tailwind 3: `npx tailwindcss@3 -c tools/tailwind.config.js -i in.css -o vendor/app.css --minify`
(volver a generarlo si se agregan clases nuevas).
