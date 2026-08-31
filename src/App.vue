<script setup lang="ts">
import DatePicker from './components/DatePicker.vue'
import EventSchedule from './components/EventSchedule.vue'
import EventHistory from './components/EventHistory.vue'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import {
  eventTimes,
  elements,
  type EventRecord,
} from './data/events'

const STORAGE_KEY = 'element-event-tracker'

let syncTimer: ReturnType<typeof setInterval>

const formatDate = (date: Date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const selectedDate = ref(formatDate())
const events = ref<EventRecord[]>([])
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const syncPastEvents = () => {
  const now = new Date()
  const todayStr = formatDate(now)
  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()

  let updated = false
  const history = [...events.value]

  eventTimes.forEach((time, index) => {
    const [hours = 0, minutes = 0] = time.split(':').map(Number)
    const endSeconds = hours * 3600 + minutes * 60 + 3600

    if (currentSeconds >= endSeconds) {
      const exists = history.some((e) => e.date === todayStr && e.time === time)

      if (!exists) {
        // berikan nilai default untuk mencegah error typescript (number | undefined)
        const [year = 0, month = 1, day = 1] = todayStr.split('-').map(Number)
        
        const selected = Date.UTC(year, month - 1, day)
        const reference = Date.UTC(2026, 8, 1)
        const diffDays = Math.floor((selected - reference) / 86400000)

        const totalEvents = (diffDays * 8) + index
        const offset = 1
        const elementIndex = (((totalEvents + offset) % elements.length) + elements.length) % elements.length

        history.push({
          date: todayStr,
          time,
          // tambahkan tanda seru (!) untuk memberitahu TS bahwa data pasti ada
          element: elements[elementIndex]!
        })
        updated = true
      }
    }
  })

  if (updated) {
    history.sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date)
      return eventTimes.indexOf(b.time) - eventTimes.indexOf(a.time)
    })

    events.value = history
  }
}

onMounted(() => {
  const savedEvents = localStorage.getItem(STORAGE_KEY)
  if (savedEvents) {
    try {
      const parsedEvents = JSON.parse(savedEvents)
      events.value = parsedEvents.filter((e: EventRecord) => elements.includes(e.element))
    } catch (error) {
      events.value = []
    }
  }

  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }

  syncPastEvents()
  syncTimer = setInterval(syncPastEvents, 10000)
})

onUnmounted(() => {
  clearInterval(syncTimer)
})

watch(
  events,
  (newEvents) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents))
  },
  { deep: true },
)
</script>

<template>
  <main class="min-h-screen bg-zinc-50 p-4 py-8 transition-colors duration-300 sm:p-6 md:p-8 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 relative">
    <div class="mx-auto max-w-2xl">
      <header class="mb-8">
        <div>
          <h1 class="text-4xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Fish It: Element Tracker
          </h1>
          <p class="mt-1.5 text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            Pantau jadwal rotasi Volcano, Blizzard, dan Storm di Element Island. Jangan lewatkan momen mancing terbaikmu!
          </p>
        </div>
      </header>

      <div class="space-y-6">
        <section class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 sm:p-6">
          <DatePicker v-model="selectedDate" />
        </section>

        <section class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 sm:p-6">
          <EventSchedule :date="selectedDate" />
        </section>

        <EventHistory :events="events" :date="selectedDate" />
      </div>
    </div>

    <button
      @click="toggleTheme"
      class="fixed bottom-6 right-6 z-50 rounded-full bg-white p-3.5 text-zinc-500 shadow-lg ring-1 ring-zinc-200 transition-all hover:bg-zinc-50 hover:text-zinc-900 dark:bg-zinc-900 dark:text-zinc-400 dark:ring-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
      aria-label="Toggle dark mode"
    >
      <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
    </button>
  </main>
</template>