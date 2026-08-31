<script setup lang="ts">
import { ref, computed } from 'vue'
import type { EventRecord } from '../data/events'
import EventItem from './EventItem.vue'

const props = defineProps<{
  events: EventRecord[]
  date: string
}>()

// status panel
const isOpen = ref(false)

// filter daftar untuk hari ini saja
const todayEvents = computed(() => {
  const now = new Date()
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  
  // sembunyikan riwayat jika tanggal yang dipilih bukan hari ini
  if (props.date !== todayStr) {
    return []
  }
  
  return props.events.filter(e => e.date === todayStr)
})
</script>

<template>
  <section 
    v-if="todayEvents.length > 0" 
    class="rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 transition-all dark:bg-zinc-900 dark:ring-zinc-800"
  >
    <button 
      @click="isOpen = !isOpen"
      class="flex w-full items-center justify-between p-5 outline-none sm:p-6"
    >
      <div class="flex items-center gap-3">
        <h2 class="text-lg font-semibold text-zinc-900 dark:text-white">
          Selesai Hari Ini
        </h2>
        <span class="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {{ todayEvents.length }} Event
        </span>
      </div>
      
      <svg 
        class="h-5 w-5 text-zinc-500 transition-transform duration-300 dark:text-zinc-400" 
        :class="{ 'rotate-180': isOpen }"
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
      >
        <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
      </svg>
    </button>

    <div v-show="isOpen" class="border-t border-zinc-100 p-5 pt-5 dark:border-zinc-800 sm:p-6 sm:pt-6">
      <div class="flex max-h-[320px] flex-col gap-3 overflow-y-auto pr-1">
        <EventItem
          v-for="event in todayEvents"
          :key="`${event.date}-${event.time}`"
          :time="event.time"
          :element="event.element"
          subtitle="Telah selesai"
        />
      </div>
    </div>
  </section>
</template>