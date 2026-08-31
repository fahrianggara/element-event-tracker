<script setup lang="ts">
import DatePicker from './components/DatePicker.vue'
import EventSchedule from './components/EventSchedule.vue'
import { onMounted, ref, watch } from 'vue'
import {
  eventTimes,
  elementLabels,
  type EventRecord,
} from './data/events'

const STORAGE_KEY = 'element-event-tracker'

const formatDate = (date: Date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const selectedDate = ref(formatDate())
const events = ref<EventRecord[]>([])

// status tema saat ini
const isDark = ref(false)

// memuat data lokal dan preferensi tema
onMounted(() => {
  const savedEvents = localStorage.getItem(STORAGE_KEY)
  if (savedEvents) {
    events.value = JSON.parse(savedEvents)
  }

  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

// toggle tema aplikasi
const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// memantau perubahan event
watch(
  events,
  (newEvents) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents))
  },
  { deep: true },
)
</script>

<template>
  <main class="min-h-screen bg-zinc-50 p-4 transition-colors duration-300 sm:p-6 md:p-8 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
    <div class="mx-auto max-w-2xl">
      <!-- Header -->
      <header class="mb-8 flex items-start justify-between">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Element Tracker
          </h1>
          <p class="mt-1.5 text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            Lihat prediksi event berdasarkan tanggal dengan mudah.
          </p>
        </div>

        <button
          @click="toggleTheme"
          class="rounded-full bg-white p-2.5 text-zinc-500 shadow-sm ring-1 ring-zinc-200 transition-all hover:bg-zinc-50 hover:text-zinc-900 dark:bg-zinc-900 dark:text-zinc-400 dark:ring-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          aria-label="Toggle dark mode"
        >
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        </button>
      </header>

      <div class="space-y-6">
        <!-- Date Picker -->
        <section class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 sm:p-6">
          <DatePicker v-model="selectedDate" />
        </section>

        <!-- Schedule -->
        <section class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 sm:p-6">
          <EventSchedule :date="selectedDate" />
        </section>

        <!-- History -->
        <section class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 sm:p-6">
          <h2 class="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            Riwayat Event
          </h2>

          <div
            v-if="events.length === 0"
            class="flex items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 py-8 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400"
          >
            Belum ada event yang dicatat.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="event in events"
              :key="`${event.date}-${event.time}`"
              class="flex items-center justify-between rounded-xl bg-zinc-50 p-3.5 ring-1 ring-zinc-200 dark:bg-zinc-800/50 dark:ring-zinc-800"
            >
              <div class="flex items-center gap-3 text-sm">
                <span class="font-medium text-zinc-700 dark:text-zinc-300">
                  {{ event.date }}
                </span>
                <span class="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
                <span class="font-medium text-zinc-700 dark:text-zinc-300">
                  {{ event.time }}
                </span>
              </div>
              <span class="inline-flex items-center rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
                {{ elementLabels[event.element] }}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>