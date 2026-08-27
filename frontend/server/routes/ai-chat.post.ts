// Server-side proxy — the provider key never reaches the browser bundle.
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const GROQ_KEY = process.env.GROQ_API_KEY || ''

const SYSTEM_CONTEXT = `You are "Scentico Assistant", the in-app AI for a perfume e-commerce admin dashboard (brand: Scentico, Philippines, prices in ₱).
Answer questions about this store using ONLY the data below. Be concise (2-6 sentences or a short list). If something is not in the data, say you don't have that data.

== BUSINESS KPIs ==
- Total revenue (30 days): ₱124,850 (+12.4%) from 342 orders (18 pending, 324 fulfilled)
- Customers: 1,204 registered (+5 new), avg order ₱365
- Units in stock: 1,248 across 5 collections; 7 items running low
- Revenue this week: ₱58.0k, peaking Saturday ₱6.1k

== TOP FRAGRANCES (units sold this month) ==
1. Velvet Rose — 120 (best seller, Floral, ₱349)
2. Cedar Veil — 98 (Fresh, ₱259)
3. Amber Noir — 85 (Woody, ₱289)
4. Smoked Vanilla — 72 (Sweet, ₱275)
5. Glacé Noir — 45 (Fresh, ₱299)

== COLLECTION MIX (units sold) ==
Woody 28%, Floral 32%, Fresh 20%, Sweet 12%, Citrus 8% (total 426 units)

== ORDERS (live tracking board) ==
SN-8421 · Joashua Barimao · OUT FOR DELIVERY · J&T Express JT-7712-3391-PH · ETA Today 9:00 PM · ₱697 · Velvet Rose + Amber Noir (bundle ₱529 promo, free ship)
SN-8390 · Joashua Barimao · PACKED · J&T JT-7708-2210-PH · ETA Aug 30 · ₱318 · Cedar Veil (COD)
SN-8102 · Joashua Barimao · DELIVERED Aug 18 · Ninja Van NV-5540-9917-PH · ₱358 · Glacé Noir
SN-8407 · Maria Santos · DELIVERED Aug 23 · ₱550 · 2x Smoked Vanilla
SN-8398 · Jose Rizal · SHIPPED · J&T JT-7719-8850-PH · ETA Aug 29 · ₱408 · Velvet Rose
SN-8365 · Ana Lim · CANCELLED · ₱837 · Amber Noir x2 + Cedar Veil (no charge)

== STORE SETTINGS ==
Free shipping minimum ₱529 · Cash on delivery enabled · Support: support@scentico.ph

== CURRENT PROMO ==
Mega bundle flash sale: any 2 perfumes for ₱529 (was ₱688, save ₱159), free shipping.`

export default defineEventHandler(async (event) => {
  if (!GROQ_KEY) {
    throw createError({ statusCode: 500, statusMessage: 'AI key not configured on the server.' })
  }
  console.log('[ai-chat] request received')
  const body = await readBody<{ messages?: ChatMessage[] }>(event)
  const messages = (body?.messages ?? [])
    .filter(m => m && typeof m.content === 'string' && m.content.trim())
    .slice(-12)
    .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }))

  if (!messages.length) {
    throw createError({ statusCode: 400, statusMessage: 'messages[] is required' })
  }

  const call = (model: string) => $fetch<{ choices?: { message?: { content?: string } }[] }>('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: SYSTEM_CONTEXT }, ...messages],
      temperature: 0.4,
      max_tokens: 700,
    }),
    timeout: 30000,
  })

  const tryModels = ['allam-2-7b', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b']
  try {
    let res
    let lastError: unknown
    for (const model of tryModels) {
      try {
        res = await call(model)
        break
      } catch (err) {
        lastError = err
        console.error(`[ai-chat] model ${model} failed:`, err)
      }
    }
    if (!res) throw lastError ?? new Error('All models failed')
    const reply = res?.choices?.[0]?.message?.content?.trim()
    if (!reply) throw new Error('Empty reply')
    return { reply }
  } catch (error) {
    console.error('[ai-chat] failed:', error)
    throw createError({ statusCode: 502, statusMessage: 'The AI service is unavailable right now. Please try again.' })
  }
})