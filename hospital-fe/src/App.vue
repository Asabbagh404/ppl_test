<template>
  <main class="flex flex-col justify-center items-center h-screen w-screen relative m-auto max-w-[1000px]">
    <div class="w-full flex justify-end">
      <label for="autofetch">Auto fetch</label>
      <Checkbox v-model="autoFetch" label="Auto fetch" :binary="true" inputId="autofetch" />
    </div>
    <PatientAndDrugs :patients="patients" v-model:drugs="drugs" />
    <div class="flex flex-wrap gap-5">
      <Button label="Get patient and drugs" @click="getPatientsAndDrugs" />
      <Button label="Simulate" @click="simulate" class="!bg-blue-primary !border-none" />
    </div>
    <hr />
    <SimulationHistory :simulationHistory="simulationHistory" />
  </main>
</template>
<script setup lang="ts">
import { Quarantine, PatientsRegister } from 'hospital-lib'
import Button from 'primevue/button'
import { useApi } from './useApi'
import { onUnmounted, ref, watch } from 'vue'
import SimulationHistory from './components/SimulationHistory.vue'
import PatientAndDrugs from './components/PatientAndDrugs.vue'
import Checkbox from 'primevue/checkbox'

const patientsInitalState = {
  F: 0,
  X: 0,
  H: 0,
  D: 0,
  T: 0,
}

const patients = ref({})
const drugs = ref<string[]>([])
const simulation = ref<PatientsRegister>()
const simulationHistory = ref<{ output: PatientsRegister, input: { drugs: string[], patients: PatientsRegister } }[]>([])
const autoFetch = ref(false)

const api = useApi()

let interval: NodeJS.Timeout | undefined
watch(autoFetch, (newVal) => {
  if (!newVal && interval) {
    return clearInterval(interval)
  }
  interval = setInterval(getPatientsAndDrugs, 30_000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

const getPatientsStateCount = (patients: string[]) => {
  return patients.reduce((acc: Record<string, number>, patient) => {
    acc[patient] = acc[patient] + 1
    return acc
  }, { ...patientsInitalState })
}
const getPatientsAndDrugs = async () => {
  const [patientsResponse, drugsResponse] = await Promise.all(
    [api.getPatients(), api.getDrugs()]
  )
  patients.value = getPatientsStateCount(patientsResponse.split(','))
  drugs.value = drugsResponse.split(',').filter((el: string) => el)
}
const simulate = () => {
  const quarantine = new Quarantine(patients.value)
  quarantine.setDrugs(drugs.value)
  simulation.value = quarantine.wait40Days().report()
  simulationHistory.value.push({
    input: { drugs: drugs.value, patients: { ...patients.value } },
    output: simulation.value,
  })
  // max 10 simulations
  if (simulationHistory.value.length > 10) {
    simulationHistory.value.shift()
  }
}
const setDrugs = (newDrugs: string[]) => {
  drugs.value = newDrugs
}
</script>

<style scoped>
hr {
  width: 100%;
  margin: 20px 0px;
}
</style>
