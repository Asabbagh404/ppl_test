<template>
  <div v-if="!drugs.length && !Object.values(patients).length" class="text-center my-5">
    <h1 class="text-3xl">Welcome to the Hospital</h1>
    <p class="text-lg">Click the button below to get the patients and drugs</p>
  </div>
  <div class="flex gap-5 flex-wrap my-5" v-else>
    <!-- Unused Drugs -->
    <div>
      <h2 class="text-xl text-center">Unused</h2>
      <span>Drag and drop</span>
      <ul :class="['flex', 'flex-col', 'h-full', { 'bg-gray-900 opacity-50': draggedFrom === 'drugs' }]"
        :style="unusedMarginTop" @dragover.prevent @drop="onDrop('unused')">
        <li class="drugCard" v-for="drug in unusedDrugs" :key="drug" draggable="true"
          @dragstart="onDragStart(drug, 'unused')">
          {{ drugsSymbolMapper[drug as keyof typeof drugsSymbolMapper] }}
        </li>
      </ul>
    </div>

    <!-- Drugs -->
    <div>
      <h2 class="text-3xl text-center">Drugs</h2>
      <ul :class="['flex', 'flex-col', 'h-full', { 'bg-gray-900 opacity-50': draggedFrom === 'unused' }]"
        @dragover.prevent @drop="onDrop('drugs')">
        <li class="drugCard" v-for="drug in drugs" :key="drug" draggable="true" @dragstart="onDragStart(drug, 'drugs')">
          {{ drugsSymbolMapper[drug as keyof typeof drugsSymbolMapper] }}
        </li>
      </ul>
    </div>

    <!-- Patients -->
    <div>
      <h2 class="text-3xl text-center">Patients</h2>
      <ul class="flex flex-col justify-center items-center">
        <li class="flex flex-shrink-0 flex-wrap items-center" v-for="[k] in Object.entries(patients)" :key="k">
          <PatientStateCard v-model:patient="patients[k]" :state="k" isEditable />
        </li>
      </ul>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { computed, ref } from 'vue'
import { drugsSymbolMapper } from '../mapper'
import { allDrugs } from '../mapper'
import PatientStateCard from './PatientStateCard.vue'

const props = defineProps<{
  patients: Record<string, number>
  drugs: string[]
}>()

const emit = defineEmits(['update:drugs'])

const unusedMarginTop = computed(() => {
  // 15px is the height of the text "Drag and drop"
  return 'padding-top: ' + ((props.drugs.length * 60) - 15) + 'px'
})

const unusedDrugs = computed(() => {
  return allDrugs.filter((drug) => !props.drugs.includes(drug))
})

const draggedDrug = ref<string | null>(null)
const draggedFrom = ref<string | null>(null)

const onDragStart = (drug: string, from: string) => {
  draggedDrug.value = drug
  draggedFrom.value = from
}

const onDrop = (to: string) => {
  if (draggedDrug.value && draggedFrom.value && draggedFrom.value !== to) {
    if (draggedFrom.value === 'unused' && to === 'drugs') {
      emit('update:drugs', [...props.drugs, draggedDrug.value])
    } else if (draggedFrom.value === 'drugs' && to === 'unused') {
      emit('update:drugs', props.drugs.filter((drug) => drug !== draggedDrug.value))
    }
  }
  // Reset drag state
  draggedDrug.value = null
  draggedFrom.value = null
}
</script>
