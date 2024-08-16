<template>
  <main class="flex flex-col justify-center items-center h-screen w-screen relative m-auto max-w-[1000px]">
    <div class="w-full flex justify-end">
      <label for="autofetch">Auto fetch</label>
      <Checkbox v-model="autoFetch" label="Auto fetch" :binary="true" inputId="autofetch" />
    </div>
    <PatientAndDrugs :patients="patients" :drugs="drugs" @updateDrugs="setDrugs" @updatePatients="setPatientsState" />
    <div class="flex flex-wrap gap-5">
      <Button label="Get patient and drugs" @click="getPatientsAndDrugs" />
      <Button label="Simulate" @click="simulate" class="!bg-blue-primary !border-none" />
    </div>
    <hr />
    <Simulation v-if="simulation" :simulation="simulation" @showHistoryModal="() => showHistoryModal = true" />
    <Modal v-model:visible="showHistoryModal" header="Simulation History" @hide="!showHistoryModal"
      @close="showHistoryModal = false">
      <div class="w-[300px]">
        <SimulationHistory :simulationHistory="simulationHistory" />
      </div>
    </Modal>
  </main>
</template>
<script setup lang="ts">
import { Quarantine } from 'hospital-lib'
import Button from 'primevue/button'
import Modal from 'primevue/dialog'
import { useApi } from './useApi'
import { onUnmounted, ref, watch } from 'vue'
import { PatientsRegister } from 'hospital-lib'
import SimulationHistory from './components/SimulationHistory.vue'
import Simulation from './components/Simulation.vue'
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
const showHistoryModal = ref(false)
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
    input: { drugs: drugs.value, patients: patients.value },
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
const setPatientsState = (newPatients: Record<string, number>) => {
  patients.value = newPatients
}
</script>

<style scoped>
hr {
  width: 100%;
  margin: 20px 0px;
}
</style>
