<script setup lang="ts">
import type { ElementType } from '../data/events'

defineProps<{
  time: string
  element: ElementType | null
  active?: boolean
  isNext?: boolean
  remainingText?: string
}>()

const elementInfo: Record<
  ElementType,
  {
    label: string
    icon: string
  }
> = {
  fire: { label: 'Fire', icon: '🔥' },
  ice: { label: 'Ice', icon: '❄️' },
  storm: { label: 'Storm', icon: '⚡' },
}
</script>

<template>
  <article
    class="relative overflow-hidden rounded-2xl border p-4 transition-all duration-300"
    :class="[
      active
        ? 'border-green-400 bg-green-50 shadow-md dark:border-green-800/50 dark:bg-green-950/30'
        : isNext
        ? 'border-blue-200 bg-blue-50/50 shadow-sm dark:border-blue-900/50 dark:bg-blue-950/20'
        : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950'
    ]"
  >
    <div class="flex items-center gap-4">
      <!-- time -->
      <div class="w-16 shrink-0">
        <p
          class="text-sm font-semibold"
          :class="[
            active ? 'text-green-700 dark:text-green-400' : 
            isNext ? 'text-blue-700 dark:text-blue-400' : 
            'text-zinc-500 dark:text-zinc-400'
          ]"
        >
          {{ time }}
        </p>
      </div>

      <!-- element icon -->
      <div
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg"
        :class="
          active
            ? 'bg-green-100/80 dark:bg-green-900/40'
            : isNext
            ? 'bg-blue-100 dark:bg-blue-900'
            : 'bg-zinc-100 dark:bg-zinc-900'
        "
      >
        <template v-if="element">
          {{ elementInfo[element].icon }}
        </template>
        <span v-else class="text-sm text-zinc-400">?</span>
      </div>

      <!-- information -->
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

        <p class="mt-0.5 text-xs" :class="
          active ? 'text-green-600/80 dark:text-green-400/80' : 
          isNext ? 'text-blue-600/80 dark:text-blue-400/80' : 
          'text-zinc-400 dark:text-zinc-500'
        ">
          {{ active ? remainingText : (isNext ? 'Akan datang' : 'Prediksi event') }}
        </p>
      </div>

      <!-- active and next badges -->
      <div v-if="active" class="flex items-center gap-2">
        <span class="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span class="text-xs font-medium text-green-600 dark:text-green-400">
          Aktif
        </span>
      </div>
      
      <div v-else-if="isNext" class="flex items-center gap-2">
        <span class="h-2 w-2 rounded-full bg-blue-500" />
        <span class="text-xs font-medium text-blue-600 dark:text-blue-400">
          Selanjutnya
        </span>
      </div>
    </div>
  </article>
</template>