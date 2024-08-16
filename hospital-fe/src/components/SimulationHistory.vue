<template>
  <div class="w-[300px]">
    <ul class="flex flex-col justify-center items-center">
      <li v-for="(simulation, index) in props.simulationHistory" :key="index" class="my-4">
        <h3 class="text-center text-blue-primary">Simulation {{ index + 1 }}</h3>
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
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { PatientsRegister } from 'hospital-lib'
import { drugsSymbolMapper } from '../mapper'

const props = defineProps<{
  simulationHistory: { output: PatientsRegister, input: { drugs: string[], patients: PatientsRegister } }[]
}>()
</script>