# DanyDev Portfolio

Portfolio redisenado con un frontend mas fuerte visualmente y un backend Express que sirve contenido y procesa mensajes de contacto.

## Scripts

- `npm start`: arranca el frontend de React en desarrollo.
- `npm run server`: arranca la API local en `http://localhost:5000`.
- `npm run build`: genera la version de produccion del frontend.
- `npm test -- --watch=false`: ejecuta los tests una vez.

## Backend

La API expone estas rutas:

- `GET /api/health`
- `GET /api/content`
- `GET /api/projects`
- `GET /api/skills`
- `POST /api/contact`

El formulario incluye validacion, honeypot anti-spam y control basico por tasa.

## Variables de entorno

Duplica `.env.example` a `.env` para activar el envio real por correo:

- `CLIENT_ORIGIN`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

Si no configuras SMTP, la API seguira aceptando mensajes y respondera en modo `queued`.
