<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement

  emit('update:modelValue', target.value)
}
</script>

<template>
  <div>
    <label
      for="event-date"
      class="mb-2.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
    >
      Pilih Tanggal
    </label>

    <input
      id="event-date"
      :value="modelValue"
      type="date"
      class="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition-all [color-scheme:light] hover:bg-white focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:[color-scheme:dark] dark:hover:bg-zinc-800/80 dark:focus:border-zinc-500 dark:focus:bg-zinc-900 dark:focus:ring-zinc-800/50"
      @change="handleChange"
    />
  </div>
</template>