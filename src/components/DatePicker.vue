<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
// import locale bahasa indonesia dari date-fns
import { id } from 'date-fns/locale'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const getToday = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const isNotToday = computed(() => props.modelValue !== getToday())

const handleReset = () => {
  emit('update:modelValue', getToday())
}

const dateValue = computed({
  get: () => {
    const [year, month, day] = props.modelValue.split('-').map(Number)
    return new Date(year, month - 1, day)
  },
  set: (val: Date | null) => {
    if (val) {
      const year = val.getFullYear()
      const month = String(val.getMonth() + 1).padStart(2, '0')
      const day = String(val.getDate()).padStart(2, '0')
      emit('update:modelValue', `${year}-${month}-${day}`)
    }
  }
})

const isDark = ref(false)
let observer: MutationObserver

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
  
  observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div>
    <div class="mb-2.5 flex items-center justify-between">
      <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
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

    <!-- menggunakan token string format dan format-locale dari date-fns -->
    <VueDatePicker
      v-model="dateValue"
      :enable-time-picker="false"
      :dark="isDark"
      :auto-apply="true"
      format="dd MMMM yyyy"
      :format-locale="id"
      class="custom-datepicker"
      placeholder="Pilih jadwal event"
      :min-date="new Date()"
    />
  </div>
</template>

<style>
.custom-datepicker {
  --dp-font-family: inherit;
  --dp-border-radius: 0.75rem; 
  --dp-input-padding: 0.75rem 1rem 0.75rem 2.5rem; 
  --dp-font-size: 0.875rem; 
  --dp-primary-color: var(--color-blue-600); 
}

html:not(.dark) .custom-datepicker {
  --dp-background-color: var(--color-zinc-50);
  --dp-text-color: var(--color-zinc-900);
  --dp-border-color: var(--color-zinc-200);
  --dp-border-color-hover: var(--color-zinc-400);
  --dp-border-color-focus: var(--color-zinc-400);
  --dp-icon-color: var(--color-zinc-400);
}

html.dark .custom-datepicker {
  --dp-background-color: var(--color-zinc-800);
  --dp-text-color: var(--color-white);
  --dp-border-color: var(--color-zinc-700);
  --dp-border-color-hover: var(--color-zinc-500);
  --dp-border-color-focus: var(--color-zinc-500);
  --dp-menu-background: var(--color-zinc-900);
  --dp-menu-border-color: var(--color-zinc-800);
  --dp-icon-color: var(--color-zinc-500);
}

.custom-datepicker .dp__input {
  box-shadow: none !important;
  transition: all 0.3s ease;
}

html:not(.dark) .custom-datepicker .dp__input:focus {
  background-color: var(--color-white);
  box-shadow: 0 0 0 4px var(--color-zinc-100) !important;
}

html.dark .custom-datepicker .dp__input:focus {
  background-color: var(--color-zinc-900);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-zinc-800) 50%, transparent) !important;
}

.dp--clear-btn {
  display: none !important;
}
</style>