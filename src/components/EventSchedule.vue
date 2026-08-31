<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import EventItem from './EventItem.vue'
import {
  eventTimes,
  type ElementType,
} from '../data/events'

const props = defineProps<{
  date: string
}>()

const elements: ElementType[] = ['fire', 'ice', 'storm']
const now = ref(new Date())
const eventItemRefs = ref<any[]>([])
let timer: ReturnType<typeof setInterval>

const EVENT_DURATION = 60

const formatDate = (date: Date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const predictions = computed<ElementType[]>(() => {
  const [year, month, day] = props.date.split('-').map(Number)
  const selected = Date.UTC(year, month - 1, day)
  const reference = Date.UTC(2026, 8, 1) 
  const diffDays = Math.floor((selected - reference) / 86400000)

  return eventTimes.map((_, index): ElementType => {
    const chronoIndex = index < 6 ? index + 2 : index - 6
    const totalEvents = (diffDays * 8) + chronoIndex
    const offset = 1 
    const elementIndex = (((totalEvents + offset) % elements.length) + elements.length) % elements.length
    
    return elements[elementIndex] as ElementType
  })
})

const currentTimeSeconds = computed(() => {
  return now.value.getHours() * 3600 + now.value.getMinutes() * 60 + now.value.getSeconds()
})

const timeToSeconds = (time: string) => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number)
  return hours * 3600 + minutes * 60
}

const isActive = (time: string) => {
  if (props.date !== formatDate()) return false
  const start = timeToSeconds(time)
  const end = start + (EVENT_DURATION * 60)
  return currentTimeSeconds.value >= start && currentTimeSeconds.value < end
}

// deteksi event yang sudah selesai (hanya berlaku hari ini)
const isPastEvent = (time: string) => {
  if (props.date !== formatDate()) return false
  const end = timeToSeconds(time) + (EVENT_DURATION * 60)
  return currentTimeSeconds.value >= end
}

const nextEventTime = computed(() => {
  if (props.date !== formatDate()) return null
  const upcoming = eventTimes.filter(time => timeToSeconds(time) > currentTimeSeconds.value)
  if (upcoming.length === 0) return null
  upcoming.sort((a, b) => timeToSeconds(a) - timeToSeconds(b))
  return upcoming[0]
})

const formatClock = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const paddedM = m.toString().padStart(2, '0')
  const paddedS = s.toString().padStart(2, '0')
  if (h > 0) {
    const paddedH = h.toString().padStart(2, '0')
    return `${paddedH}:${paddedM}:${paddedS}`
  }
  return `${paddedM}:${paddedS}`
}

const getCountdownInfo = (time: string) => {
  if (isActive(time)) {
    const end = timeToSeconds(time) + (EVENT_DURATION * 60)
    const diff = end - currentTimeSeconds.value
    return { label: 'Berakhir dalam', clock: formatClock(diff) }
  }
  if (time === nextEventTime.value) {
    const start = timeToSeconds(time)
    const diff = start - currentTimeSeconds.value
    return { label: 'Mulai dalam', clock: formatClock(diff) }
  }
  return null
}

onMounted(() => {
  timer = setInterval(() => { now.value = new Date() }, 1000)
  
  nextTick(() => {
    let targetIndex = eventTimes.findIndex(t => isActive(t))
    if (targetIndex === -1) {
      targetIndex = eventTimes.findIndex(t => t === nextEventTime.value)
    }
    
    if (targetIndex !== -1 && eventItemRefs.value[targetIndex]) {
      const el = eventItemRefs.value[targetIndex].$el
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
})

onUnmounted(() => { clearInterval(timer) })
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
        ref="eventItemRefs"
        v-show="!isPastEvent(time)"
        :time="time"
        :element="predictions[index] ?? null"
        :active="isActive(time)"
        :is-next="time === nextEventTime"
        :countdown="getCountdownInfo(time)"
      />
    </div>
  </section>
</template>