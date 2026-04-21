# 🍌 Nano Banana — Guía de Configuración

## Lo que tienes aquí
- `index.html` → Menú del cliente (pedidos + WhatsApp + GPS)
- `admin.html` → Panel de la dueña (pedidos en tiempo real + gestión del menú)
- `api/whatsapp.js` → Bot de WhatsApp (responde automáticamente con el link del menú)
- Base de datos ya creada en Supabase ✓

---

## PASO 1 — Cambiar la contraseña del panel admin

En `admin.html`, busca estas líneas y cambia los valores:

```js
const ADMIN_PASS = 'nanobana2024'       // ← tu contraseña
const ADMIN_EMAIL = 'admin@nanobana.com' // ← tu correo
```

---

## PASO 2 — Cambiar el número de WhatsApp

En `index.html`, busca:
```js
const OWNER_PHONE = '593999999999'
```
Reemplaza con el número de la dueña en formato internacional sin el `+`
Ejemplo Ecuador: `593987654321`

---

## PASO 3 — Google Maps (autocompletar direcciones)

1. Ve a: https://console.cloud.google.com
2. Crea un proyecto → Habilita "Places API"
3. Crea una API Key → cópiala
4. En `index.html`, busca:
   ```js
   const GOOGLE_MAPS_KEY = 'TU_API_KEY_DE_GOOGLE_MAPS'
   ```
   Reemplaza con tu key real.

> Sin este paso el menú igual funciona, solo no habrá autocompletar de direcciones.

---

## PASO 4 — Subir a Vercel (gratis)

1. Crea cuenta en https://vercel.com (con GitHub)
2. Sube esta carpeta a un repositorio de GitHub
3. En Vercel → "Add New Project" → importa tu repo
4. Haz clic en Deploy
5. Tu URL será algo como: `https://nano-banana.vercel.app`

---

## PASO 5 — Bot de WhatsApp (Meta)

1. Ve a: https://developers.facebook.com
2. Crea una nueva App → tipo "Business"
3. Agrega el producto "WhatsApp"
4. En WhatsApp → Configuration → Webhook:
   - URL: `https://tu-url.vercel.app/api/whatsapp`
   - Verify Token: `nanobana_verify_2024`
   - Suscribir a: `messages`
5. En Vercel → Settings → Environment Variables, agrega:
   - `WA_VERIFY_TOKEN` = `nanobana_verify_2024`
   - `WA_TOKEN` = (tu token de acceso de Meta)
   - `WA_PHONE_ID` = (ID del número de WhatsApp Business)
   - `MENU_URL` = `https://tu-url.vercel.app`
   - `OWNER_PHONE` = `593987654321`

> El bot responde automáticamente cuando alguien escribe "hola", "menú", "horario" o cualquier mensaje, enviando el link del menú.

---

## URLs finales

| Página | URL |
|--------|-----|
| Menú del cliente | `https://tu-url.vercel.app` |
| Panel admin | `https://tu-url.vercel.app/admin` |
| Bot WhatsApp | `https://tu-url.vercel.app/api/whatsapp` |

---

## Credenciales Supabase (ya configuradas)

- Proyecto: `tckfakmwfortjgqbsorn` (base de datos para sucua municipio)
- URL: `https://tckfakmwfortjgqbsorn.supabase.co`
- Tablas creadas: `menu_categories`, `menu_items`, `orders`, `order_items`
