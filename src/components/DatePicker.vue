<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement

  emit('update:modelValue', target.value)
}

// format tanggal hari ini
const getToday = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// cek apakah tanggal yang dipilih bukan hari ini
const isNotToday = computed(() => props.modelValue !== getToday())

// kembalikan nilai ke tanggal hari ini
const handleReset = () => {
  emit('update:modelValue', getToday())
}
</script>

<template>
  <div>
    <div class="mb-2.5 flex items-center justify-between">
      <label
        for="event-date"
        class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
      >
        Pilih Tanggal
      </label>

      <button
        v-if="isNotToday"
        @click="handleReset"
        type="button"
        class="text-xs font-medium text-blue-600 outline-none transition-colors hover:text-blue-700 underline dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
      >
        Reset ke Hari Ini
      </button>
    </div>

    <input
      id="event-date"
      :value="modelValue"
      type="date"
      class="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition-all [color-scheme:light] hover:bg-white focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:[color-scheme:dark] dark:hover:bg-zinc-800/80 dark:focus:border-zinc-500 dark:focus:bg-zinc-900 dark:focus:ring-zinc-800/50"
      @change="handleChange"
    />
  </div>
</template>