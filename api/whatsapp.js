/**
 * NANO BANANA — WhatsApp Bot (Webhook)
 * 
 * Despliega esto como una Vercel Serverless Function o en cualquier servidor Node.js
 * 
 * SETUP:
 * 1. Crea una app en Meta for Developers: https://developers.facebook.com
 * 2. Agrega el producto "WhatsApp" a tu app
 * 3. Configura el webhook apuntando a: https://tu-dominio.vercel.app/api/whatsapp
 * 4. Suscríbete al evento: messages
 * 5. Llena las variables de entorno abajo
 */

// ── VARIABLES DE ENTORNO ──────────────────────────────
// En Vercel: Settings → Environment Variables
const CONFIG = {
  VERIFY_TOKEN: process.env.WA_VERIFY_TOKEN || 'nanobana_verify_2024',
  WA_TOKEN: process.env.WA_TOKEN,           // Token de acceso de Meta
  PHONE_NUMBER_ID: process.env.WA_PHONE_ID, // ID del número de WhatsApp Business
  MENU_URL: process.env.MENU_URL || 'https://nanobana.vercel.app',
  OWNER_PHONE: process.env.OWNER_PHONE      // Número de la dueña (sin +)
}

// ── MENSAJES DEL BOT ──────────────────────────────────
const MESSAGES = {
  welcome: (name) => `¡Hola${name ? ` ${name}` : ''}! 👋🍌

Bienvenido/a a *Nano Banana* — Sabor Ecuatoriano con Alma 🇪🇨

Aquí puedes ver nuestro menú y hacer tu pedido:
👉 ${CONFIG.MENU_URL}

⏰ Estamos abiertos de *7:00 a 19:00*

¿En qué te puedo ayudar?`,

  menu: () => `🍌 *Menú Nano Banana*

Haz clic aquí para ver el menú completo y hacer tu pedido:
👉 ${CONFIG.MENU_URL}

¡Tu pedido llega directo a nuestra cocina! 🛵`,

  hours: () => `⏰ *Horario de atención*

Lunes a Domingo: *7:00 AM — 7:00 PM*

¡Te esperamos! 🍌`,

  location: () => `📍 *Nos encuentras en Quito*

También hacemos delivery. Haz tu pedido aquí:
👉 ${CONFIG.MENU_URL}`,

  default: () => `Hola! 🍌

Para ver nuestro menú y hacer tu pedido:
👉 ${CONFIG.MENU_URL}

Si tienes dudas escríbenos y te ayudamos 😊`
}

// ── PALABRAS CLAVE ────────────────────────────────────
const KEYWORDS = {
  menu: ['menu', 'menú', 'carta', 'qué tienen', 'que tienen', 'qué hay', 'que hay', 'ver', 'comida'],
  hours: ['horario', 'hora', 'abierto', 'cuando', 'cuándo', 'abren', 'cierran'],
  location: ['dirección', 'direccion', 'donde', 'dónde', 'ubicación', 'ubicacion', 'mapa'],
  greeting: ['hola', 'buenas', 'buenos días', 'buenas tardes', 'buenas noches', 'hi', 'hello', 'saludos']
}

function detectIntent(text) {
  const lower = text.toLowerCase()
  for (const [intent, words] of Object.entries(KEYWORDS)) {
    if (words.some(w => lower.includes(w))) return intent
  }
  return 'default'
}

async function sendWhatsAppMessage(to, text) {
  const url = `https://graph.facebook.com/v18.0/${CONFIG.PHONE_NUMBER_ID}/messages`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.WA_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: true, body: text }
    })
  })
  return res.json()
}

// ── VERCEL HANDLER ────────────────────────────────────
export default async function handler(req, res) {

  // Verificación del webhook (GET)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode']
    const token = req.query['hub.verify_token']
    const challenge = req.query['hub.challenge']
    if (mode === 'subscribe' && token === CONFIG.VERIFY_TOKEN) {
      console.log('Webhook verificado ✓')
      return res.status(200).send(challenge)
    }
    return res.status(403).send('Forbidden')
  }

  // Mensajes entrantes (POST)
  if (req.method === 'POST') {
    const body = req.body
    if (body?.object !== 'whatsapp_business_account') return res.sendStatus(404)

    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value
    const messages = value?.messages

    if (!messages?.length) return res.sendStatus(200)

    const msg = messages[0]
    if (msg.type !== 'text') return res.sendStatus(200)

    const from = msg.from
    const text = msg.text?.body || ''
    const contactName = value?.contacts?.[0]?.profile?.name || ''

    const intent = detectIntent(text)
    let reply = ''

    switch (intent) {
      case 'greeting': reply = MESSAGES.welcome(contactName.split(' ')[0]); break
      case 'menu': reply = MESSAGES.menu(); break
      case 'hours': reply = MESSAGES.hours(); break
      case 'location': reply = MESSAGES.location(); break
      default: reply = MESSAGES.default(); break
    }

    await sendWhatsAppMessage(from, reply)
    console.log(`[Bot] ${from} → "${text}" → intent: ${intent}`)
    return res.sendStatus(200)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end('Method Not Allowed')
}
