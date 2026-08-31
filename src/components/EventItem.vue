<script setup lang="ts">
import type { ElementType } from '../data/events'

defineProps<{
  time: string
  element: ElementType | null
  active?: boolean
}>()

const elementInfo: Record<
  ElementType,
  {
    label: string
    icon: string
  }
> = {
  fire: {
    label: 'Fire',
    icon: '🔥',
  },
  ice: {
    label: 'Ice',
    icon: '❄️',
  },
  storm: {
    label: 'Storm',
    icon: '⚡',
  },
}
</script>

<template>
  <article
    class="relative overflow-hidden rounded-2xl border p-4 transition-all duration-300"
    :class="
      active
        ? 'border-zinc-400 bg-zinc-100 shadow-md dark:border-zinc-600 dark:bg-zinc-900'
        : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950'
    "
  >
    <div class="flex items-center gap-4">
      <!-- Time -->
      <div class="w-16 shrink-0">
        <p
          class="text-sm font-semibold"
          :class="
            active
              ? 'text-zinc-950 dark:text-white'
              : 'text-zinc-500 dark:text-zinc-400'
          "
        >
          {{ time }}
        </p>
      </div>

      <!-- Element Icon -->
      <div
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg"
        :class="
          active
            ? 'bg-white dark:bg-zinc-800'
            : 'bg-zinc-100 dark:bg-zinc-900'
        "
      >
        <template v-if="element">
          {{ elementInfo[element].icon }}
        </template>

        <span
          v-else
          class="text-sm text-zinc-400"
        >
          ?
        </span>
      </div>

      <!-- Information -->
      <div class="min-w-0 flex-1">
        <p
          v-if="element"
          class="font-semibold text-zinc-900 dark:text-white"
        >
          {{ elementInfo[element].label }}
        </p>

        <p
          v-else
          class="font-medium text-zinc-400 dark:text-zinc-500"
        >
          Belum diketahui
        </p>

        <p class="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
          {{ active ? 'Sedang berlangsung' : 'Prediksi event' }}
        </p>
      </div>

      <!-- Active -->
      <div
        v-if="active"
        class="flex items-center gap-2"
      >
        <span class="h-2 w-2 rounded-full bg-green-500" />

        <span
          class="text-xs font-medium text-green-600 dark:text-green-400"
        >
          Aktif
        </span>
      </div>
    </div>
  </article>
</template>