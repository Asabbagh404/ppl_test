<template>
  <h3 class="text-center text-blue-primary">
    <slot name="title"></slot>
  </h3>
  <ul class="flex items-center gap-3">
    <span class="text-blue-primary">input:</span>
    <li v-for="[k, patient] in Object.entries(simulation.input.patients)" :key="k">
      {{ k }}: {{ patient }}
    </li>
  </ul>
  <ul class="flex items-center gap-3" v-if="simulation.input.drugs.length > 0">
    <span class="text-blue-primary">drug:</span>
    <li v-for="drug in simulation.input.drugs" :key="drug">
      {{ drugsSymbolMapper[drug as keyof typeof drugsSymbolMapper] }}
    </li>
  </ul>
  <ul class="flex items-center gap-3">
    <span class="text-blue-primary">output:</span>
    <li v-for="[k, patient] in Object.entries(simulation.output)" :key="k">
      {{ k }}: {{ patient }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { drugsSymbolMapper } from '../mapper'

const props = defineProps<{
  simulation: { output: Record<string, number>, input: { drugs: string[], patients: Record<string, number> } },
}>()

</script>