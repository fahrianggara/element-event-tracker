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
      class="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
    >
      Pilih tanggal
    </label>

    <input
      id="event-date"
      :value="modelValue"
      type="date"
      class="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
      @change="handleChange"
    />
  </div>
</template>