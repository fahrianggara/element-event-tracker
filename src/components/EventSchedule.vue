<script setup lang="ts">
import { computed } from 'vue'
import EventItem from './EventItem.vue'
import {
  eventTimes,
  type ElementType,
} from '../data/events'

const props = defineProps<{
  date: string
}>()

const elements: ElementType[] = ['fire', 'ice', 'storm']

const formatDate = (date: Date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const predictions = computed<ElementType[]>(() => {
  const selected = new Date(`${props.date}T00:00:00`)
  const dayIndex = Math.floor(selected.getTime() / 86400000)

  return eventTimes.map((_, index): ElementType => {
    return elements[(dayIndex + index) % elements.length] as ElementType
  })
})

const currentTime = computed(() => {
  const now = new Date()

  return now.getHours() * 60 + now.getMinutes()
})

const timeToMinutes = (time: string) => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number)

  return hours * 60 + minutes
}

const isActive = (time: string, index: number) => {
  if (props.date !== formatDate()) {
    return false
  }

  // batas waktu mulai dan selesai event
  const start = timeToMinutes(time)
  const end = index + 1 < eventTimes.length 
    ? timeToMinutes(eventTimes[index + 1]) 
    : 1440

  return currentTime.value >= start && currentTime.value < end
}
</script>

<template>
  <section>
    <div class="mb-4">
      <h2 class="text-lg font-semibold text-zinc-900 dark:text-white">
        Jadwal Event
      </h2>

      <p class="text-sm text-zinc-500 dark:text-zinc-400">
        {{ date }}
      </p>
    </div>

    <div class="space-y-3">
      <EventItem
        v-for="(time, index) in eventTimes"
        :key="`${date}-${time}`"
        :time="time"
        :element="predictions[index] ?? null"
        :active="isActive(time, index)"
      />
    </div>
  </section>
</template>