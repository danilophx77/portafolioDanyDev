# DanyDev Portfolio

Portfolio redisenado con frontend React, backend local en Express y una ruta de despliegue a Cloudflare Pages Functions para preview y produccion.

## Scripts

- `npm start`: arranca el frontend de React en desarrollo.
- `npm run server`: arranca la API local en `http://localhost:5000`.
- `npm run build`: genera la version de produccion del frontend.
- `npm run cf:dev`: construye el frontend y lo sirve con Cloudflare Pages Functions en local.
- `npm run cf:deploy -- --project-name <tu-proyecto> --branch preview`: despliega una preview a Cloudflare Pages.
- `npm test -- --watch=false`: ejecuta los tests una vez.

## API

Las rutas siguen siendo las mismas tanto en Express como en Pages Functions:

- `GET /api/health`
- `GET /api/content`
- `GET /api/projects`
- `GET /api/skills`
- `POST /api/contact`

El formulario incluye validacion, honeypot anti-spam, persistencia opcional en Supabase y envio de correo transaccional por Resend cuando las credenciales estan configuradas.

## Cloudflare

La configuracion para Pages esta en `wrangler.jsonc` y las funciones serverless viven en `functions/`.

Para desarrollo local con Cloudflare:

1. Copia `.dev.vars.example` a `.dev.vars`.
2. Completa tus secretos.
3. Ejecuta `npm run cf:dev`.

Para el primer deploy preview:

1. Verifica login con `npx wrangler whoami`.
2. Ejecuta `npm run cf:deploy -- --project-name portafolio-danydev --branch preview`.
3. Guarda los secretos con `npx wrangler pages secret put ... --project-name portafolio-danydev`.

## Supabase

La migracion inicial para guardar contactos esta en `supabase/migrations/20260327_create_contact_messages.sql`.

Variables recomendadas para Cloudflare:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_CONTACT_TABLE`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`
- `CONTACT_HASH_SALT`

## Entorno local

Si quieres seguir usando la API local en Node, duplica `.env.example` a `.env`.

Con solo el frontend, la app sigue funcionando usando el fallback local del contenido. Si no configuras correo o base de datos, el endpoint de contacto respondera en modo `queued`.
