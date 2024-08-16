<template>
  <div class="simulation w-full">
    <div class="flex justify-center">
      <h2 class="text-3xl text-center">Simulations</h2>
      <Button label="Show History" @click="showHistory" class="!absolute !right-5 bg-blue-primary" />
    </div>
    <div>
      <ul class="flex flex-col justify-center items-center">
        Result:
        <li class="patientCard" v-for="[k] in Object.entries(props.simulation || {})" :key="k">
          <PatientStateCard v-model:patient="props.simulation[k]" :state="k" />
        </li>
      </ul>
    </div>
  </div>
</template>
p
<script setup lang="ts">
import Button from 'primevue/button'
import PatientStateCard from './PatientStateCard.vue'

const props = defineProps<{
  simulation: Record<string, number>
}>()

const emit = defineEmits(['showHistoryModal'])

function showHistory() {
  emit('showHistoryModal')
}
</script>