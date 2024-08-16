<template>
  <div>
    <ul class="flex justify-center items-center flex-wrap gap-5">
      <li v-for="(simulation, index) in history" :key="index" class="my-4">
        <SimulationHistoryItem :simulation="simulation">
          <template #title>Simulation {{ index + 1 }}</template>
        </SimulationHistoryItem>
      </li>
    </ul>
  </div>
  <div>
    <Card v-if="lastSimulation">
      <template #title>Last simulation</template>
      <template #content>
        <SimulationHistoryItem :simulation="lastSimulation" />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { PatientsRegister } from 'hospital-lib'
import { drugsSymbolMapper } from '../mapper'
import { computed } from 'vue'
import Card from 'primevue/card'
import SimulationHistoryItem from './SimulationHistoryItem.vue'

const props = defineProps<{
  simulationHistory: { output: PatientsRegister, input: { drugs: string[], patients: PatientsRegister } }[]
}>()

const history = computed(() => props.simulationHistory.slice(0, props.simulationHistory.length - 1))
const lastSimulation = computed(() => props?.simulationHistory?.[props.simulationHistory.length - 1])
</script>