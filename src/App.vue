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

// Load saved events
onMounted(() => {
  const savedEvents = localStorage.getItem(STORAGE_KEY)

  if (!savedEvents) {
    return
  }

  events.value = JSON.parse(savedEvents)
})

// Save events whenever they change
watch(
  events,
  (newEvents) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents))
  },
  { deep: true },
)
</script>

<template>
  <main class="min-h-screen bg-gray-100 p-6 text-gray-900">
    <div class="mx-auto max-w-4xl">
      <!-- Header -->
      <header class="mb-6">
        <h1 class="text-3xl font-bold">
          Element Event Tracker
        </h1>

        <p class="mt-1 text-gray-500">
          Lihat prediksi event berdasarkan tanggal.
        </p>
      </header>

      <!-- Date Picker -->
      <section class="rounded-xl bg-white p-6 shadow">
        <DatePicker v-model="selectedDate" />
      </section>

      <!-- Schedule -->
      <section class="mt-6 rounded-xl bg-white p-6 shadow">
        <EventSchedule :date="selectedDate" />
      </section>

      <!-- History -->
      <section class="mt-6 rounded-xl bg-white p-6 shadow">
        <h2 class="mb-4 text-xl font-semibold">
          Riwayat Event
        </h2>

        <div
          v-if="events.length === 0"
          class="text-gray-500"
        >
          Belum ada event yang dicatat.
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="event in events"
            :key="`${event.date}-${event.time}`"
            class="flex items-center justify-between rounded-lg border border-gray-200 p-3"
          >
            <div>
              <span class="font-medium">
                {{ event.date }}
              </span>

              <span class="mx-2 text-gray-400">
                |
              </span>

              <span>
                {{ event.time }}
              </span>

              <span class="mx-2 text-gray-400">
                →
              </span>

              <span class="font-semibold">
                {{ elementLabels[event.element] }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>