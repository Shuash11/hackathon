<script setup lang="ts">
type ChatIcon = 'revenue' | 'alert' | 'orders' | 'trend'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Ask AI — Scentico' })

const { auth } = useAuth()
const isAdmin = computed(() => auth.user?.role === 'admin')
onMounted(() => {
  if (!isAdmin.value) void navigateTo('/dashboard', { replace: true })
})

interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
}

const messages = ref<ChatMsg[]>([
  {
    role: 'assistant',
    content: "Hi! I'm your Scentico assistant. I can summarize revenue, check stock, track any order (try a ref like SN-8421), or explain promos. What do you need?",
  },
])
const draft = ref('')
const thinking = ref(false)
const thread = ref<HTMLElement | null>(null)
const errorFlash = ref('')

const suggestions: { label: string; icon: ChatIcon }[] = [
  { label: 'Give me a revenue summary', icon: 'revenue' },
  { label: 'Which products are low in stock?', icon: 'alert' },
  { label: 'Where is order SN-8421 right now?', icon: 'orders' },
  { label: 'Top fragrance this month?', icon: 'trend' },
  { label: 'How many orders are still active?', icon: 'orders' },
]

async function scrollToBottom(): Promise<void> {
  await nextTick()
  if (thread.value) thread.value.scrollTop = thread.value.scrollHeight
}

async function send(text?: string): Promise<void> {
  const content = (text ?? draft.value).trim()
  if (!content || thinking.value) return
  errorFlash.value = ''
  draft.value = ''
  messages.value.push({ role: 'user', content })
  thinking.value = true
  void scrollToBottom()

  try {
    const res = await $fetch<{ reply: string }>('/ai-chat', {
      method: 'POST',
      body: { messages: messages.value.map(m => ({ role: m.role, content: m.content })) },
    })
    messages.value.push({ role: 'assistant', content: res.reply })
  } catch (err) {
    const status = (err as { response?: { status?: number } }).response?.status
    messages.value.push({
      role: 'assistant',
      content: status === 502
        ? 'I could not reach the AI service just now. Please try again in a moment.'
        : 'Something went wrong while thinking. Please try again.',
    })
    errorFlash.value = 'AI request failed — check the server logs.'
  } finally {
    thinking.value = false
    void scrollToBottom()
  }
}

function onEnter(event: KeyboardEvent): void {
  if (!event.shiftKey) {
    event.preventDefault()
    void send()
  }
}
</script>

<template>
  <div class="mx-auto flex h-[calc(100vh-9.5rem)] w-full max-w-3xl flex-col">
    <!-- Header -->
    <header class="dash-card flex items-center justify-between p-5">
      <div class="flex items-center gap-3">
        <span class="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#5B79FF] to-[#3D55F0] text-white shadow-[0_8px_20px_rgba(74,98,246,.4)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.4 0-2.8-.3-4-1L3 20l1.1-4.2A8.5 8.5 0 1 1 21 11.5Z" /><path d="M8.5 10.5h7M8.5 13.5h4.5" /></svg>
        </span>
        <div>
          <h1 class="font-display text-lg font-semibold leading-tight text-[#14161B]">Scentico Assistant</h1>
          <p class="flex items-center gap-1.5 text-xs text-slate-500">
            <span class="relative flex h-2 w-2"><span class="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span class="relative h-2 w-2 rounded-full bg-emerald-500" /></span>
            AI assistant · online
          </p>
        </div>
      </div>
      <button
        type="button"
        class="rounded-xl border border-[#E9ECF2] bg-white px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:border-[#4056E8]/40 hover:text-[#4056E8]"
        @click="messages = messages.slice(0, 1); errorFlash = ''"
      >Clear chat</button>
    </header>

    <!-- Thread -->
    <div ref="thread" class="nice-scroll mt-4 flex-1 space-y-4 overflow-y-auto rounded-2xl border border-[#E9ECF2] bg-[#F8F9FD] p-5">
      <div
        v-for="(m, i) in messages"
        :key="i"
        class="flex items-end gap-2.5"
        :class="m.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <span v-if="m.role === 'assistant'" class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#5B79FF] to-[#3D55F0] text-white shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-4 w-4"><path d="M12 3.5c1.1 2 2.9 3.3 5 3.7-.8 1.6-2.2 2.8-3.8 3.4-.4-1-1.2-1-1.2-1s-.8 0-1.2 1c-1.6-.6-3-1.8-3.8-3.4 2.1-.4 3.9-1.7 5-3.7Z" fill="currentColor" stroke="none" /><path d="M10.5 12.5h3l.6 6a1.2 1.2 0 0 1-1.2 1.3h-1.8a1.2 1.2 0 0 1-1.2-1.3l.6-6Z" fill="currentColor" stroke="none" /></svg>
        </span>
        <div
          class="max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-[0_1px_2px_rgba(23,26,63,.05)]"
          :class="m.role === 'user'
            ? 'rounded-br-md bg-gradient-to-br from-[#5B79FF] to-[#3D55F0] text-white'
            : 'rounded-bl-md border border-[#E9ECF2] bg-white text-[#14161B]'"
        >{{ m.content }}</div>
      </div>

      <!-- Typing -->
      <div v-if="thinking" class="flex items-end gap-2.5">
        <span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#5B79FF] to-[#3D55F0] text-white shadow-sm">
          <svg viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4"><path d="M12 3.5c1.1 2 2.9 3.3 5 3.7-.8 1.6-2.2 2.8-3.8 3.4-.4-1-1.2-1-1.2-1s-.8 0-1.2 1c-1.6-.6-3-1.8-3.8-3.4 2.1-.4 3.9-1.7 5-3.7Z" /><path d="M10.5 12.5h3l.6 6a1.2 1.2 0 0 1-1.2 1.3h-1.8a1.2 1.2 0 0 1-1.2-1.3l.6-6Z" /></svg>
        </span>
        <div class="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[#E9ECF2] bg-white px-4 py-3.5">
          <span v-for="d in 3" :key="d" class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300" :style="{ animationDelay: `${(d - 1) * 0.15}s` }" />
        </div>
      </div>

      <!-- Suggestion chips (only at start) -->
      <div v-if="messages.length <= 1 && !thinking" class="flex flex-wrap gap-2 pt-1 pl-10">
        <button
          v-for="s in suggestions"
          :key="s.label"
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-[#E9ECF2] bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-[0_1px_2px_rgba(23,26,63,.04)] transition hover:border-[#4056E8]/40 hover:text-[#4056E8]"
          @click="send(s.label)"
        >
          <DashboardIcon :name="s.icon" class="h-3.5 w-3.5" />{{ s.label }}
        </button>
      </div>
    </div>

    <p v-if="errorFlash" class="mt-2 text-center text-xs font-semibold text-rose-500">{{ errorFlash }}</p>

    <!-- Composer -->
    <div class="dash-card mt-4 flex items-end gap-2 p-3">
      <textarea
        v-model="draft"
        rows="1"
        placeholder="Ask about revenue, stock, orders, promos..."
        class="max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-[#14161B] placeholder:text-slate-400 focus:outline-none"
        @keydown.enter="onEnter"
      />
      <button
        type="button"
        aria-label="Send message"
        class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#5B79FF] to-[#3D55F0] text-white shadow-[0_8px_18px_-8px_rgba(64,86,232,.6)] transition hover:brightness-105 disabled:opacity-40"
        :disabled="!draft.trim() || thinking"
        @click="send()"
      >
        <DashboardIcon name="arrow" class="h-4.5 w-4.5" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.dash-card {
  border-radius: 16px;
  border: 1px solid #E9ECF2;
  background: #fff;
  box-shadow: 0 1px 2px rgba(23, 26, 63, .04);
}
</style>