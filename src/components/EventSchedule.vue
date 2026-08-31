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

// event duration limits active status to one hour
const EVENT_DURATION = 60

const formatDate = (date: Date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const predictions = computed<ElementType[]>(() => {
  const [year, month, day] = props.date.split('-').map(Number)
  
  // parses date as utc to avoid browser timezone shifts
  const selected = Date.UTC(year, month - 1, day)
  
  // reference anchor set to september 1 2026
  const reference = Date.UTC(2026, 8, 1) 
  
  const diffDays = Math.floor((selected - reference) / 86400000)

  return eventTimes.map((_, index): ElementType => {
    // chronological mapping places morning events first
    const chronoIndex = index < 6 ? index + 2 : index - 6
    
    // total events passed since the reference anchor
    const totalEvents = (diffDays * 8) + chronoIndex
    
    // offset aligns the reference date correctly with fire
    const offset = 1 
    
    // safe modulo resolves cycle for dates before the reference
    const elementIndex = (((totalEvents + offset) % elements.length) + elements.length) % elements.length
    
    return elements[elementIndex] as ElementType
  })
})

const currentTimeMinutes = computed(() => {
  return now.value.getHours() * 60 + now.value.getMinutes()
})

const timeToMinutes = (time: string) => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number)
  return hours * 60 + minutes
}

const isActive = (time: string) => {
  if (props.date !== formatDate()) return false

  const start = timeToMinutes(time)
  const end = start + EVENT_DURATION

  return currentTimeMinutes.value >= start && currentTimeMinutes.value < end
}

const nextEventTime = computed(() => {
  if (props.date !== formatDate()) return null

  const upcoming = eventTimes.filter(time => {
    return timeToMinutes(time) > currentTimeMinutes.value
  })

  if (upcoming.length === 0) return null

  upcoming.sort((a, b) => timeToMinutes(a) - timeToMinutes(b))
  return upcoming[0]
})

const getRemainingText = (time: string) => {
  if (!isActive(time)) return ''
  
  const start = timeToMinutes(time)
  const end = start + EVENT_DURATION
  const remaining = end - currentTimeMinutes.value
  
  return `Berakhir dalam ${remaining} menit`
}

onMounted(() => {
  // refreshes current time exactly every minute
  timer = setInterval(() => {
    now.value = new Date()
  }, 60000)
  
  nextTick(() => {
    // finds active event or falls back to the next upcoming event
    let targetIndex = eventTimes.findIndex(t => isActive(t))
    
    if (targetIndex === -1) {
      targetIndex = eventTimes.findIndex(t => t === nextEventTime.value)
    }
    
    if (targetIndex !== -1 && eventItemRefs.value[targetIndex]) {
      const el = eventItemRefs.value[targetIndex].$el
      
      if (el) {
        // automatically centers the relevant event on screen
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  })
})

onUnmounted(() => {
  // clears the timer memory on component destruction
  clearInterval(timer)
})
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
        :time="time"
        :element="predictions[index] ?? null"
        :active="isActive(time)"
        :is-next="time === nextEventTime"
        :remaining-text="getRemainingText(time)"
      />
    </div>
  </section>
</template>