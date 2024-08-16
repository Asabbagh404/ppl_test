<template>
  <main class="flex flex-col justify-center items-center h-screen w-screen relative m-auto max-w-[1000px]">
    <div v-if="!drugs.length && !Object.values(patients).length" class="text-center my-5">
      <h1 class="text-3xl">Welcome to the Hospital</h1>
      <p class="text-lg">Click the button below to get the patients and drugs</p>
    </div>
    <div class="flex gap-5 flex-wrap my-5" v-else>
      <div>
        <h2 class="text-3xl text-center">Drugs</h2>
        <ul class="flex flex-col justify-center items-center">
          <li class="drugCard" v-for="drug in drugs" :key="drug">{{ drugsSymbolMapper[drug] }}</li>
        </ul>
      </div>
      <div>
        <h2 class="text-3xl text-center">Patients</h2>
        <ul class="flex flex-col justify-center items-center">
          <li class="patientCard" v-for="[k, patient] in Object.entries(patients)" :key="k">
            {{ patientStateSymbolMapper[k] }}: {{ patient }}
          </li>
        </ul>
      </div>
    </div>
    <div class="flex flex-wrap gap-5">
      <Button label="Get patient and drugs" @click="getPatientAndDrugs" />
      <Button label="Simulate" @click="simulate" class="!bg-blue-primary !border-none" />
    </div>
    <hr />
    <div class="simulation w-full" v-if="simulation">
      <div class="flex justify-center">
        <h2 class="text-3xl text-center">Simulations</h2>
        <Button label="Show History" @click="showHistoryModal = true" class="!absolute !right-5" />
      </div>
      <div>
        <ul class="flex flex-col justify-center items-center">
          Result:
          <li class="patientCard" v-for="[k, patient] in Object.entries(simulation || {})" :key="k">
            {{ patientStateSymbolMapper[k] }}: {{ patient }}
          </li>
        </ul>
      </div>
    </div>
    <Modal v-model:visible="showHistoryModal" header="Simulation History" @hide="!showHistoryModal"
      @close="showHistoryModal = false">
      <div class="w-[300px]">
        <ul class="flex flex-col justify-center items-center">
          <li v-for="(simulation, index) in simulationHistory" :key="index" class="my-4">
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
                {{ drugsSymbolMapper[drug] }}
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
    </Modal>
  </main>
</template>
<script setup lang="ts">
import { Quarantine } from 'hospital-lib'
import Button from 'primevue/button'
import Modal from 'primevue/dialog'
import { useApi } from './useApi'
import { ref } from 'vue'
import { PatientsRegister } from 'hospital-lib'

const patientStateSymbolMapper = ref({
  F: 'Fever',
  X: 'Dead',
  H: 'Healthy',
  D: 'Diabetes',
  T: 'Tuberculosis',
})
const drugsSymbolMapper = ref({
  As: 'Aspirin',
  An: 'Antibiotic',
  I: 'Insulin',
  P: 'Paracetamol',
})
const patientsInitalState = {
  F: 0,
  X: 0,
  H: 0,
  D: 0,
  T: 0,
}

const patients = ref({})
const drugs = ref([])
const simulation = ref<PatientsRegister>()
const simulationHistory = ref<{ output: PatientsRegister, input: { drugs: string[], patients: PatientsRegister } }[]>([])
const showHistoryModal = ref(false)

const api = useApi()

const getPatientStateCount = (patients: string[]) => {
  return patients.reduce((acc: Record<string, number>, patient) => {
    acc[patient] = acc[patient] + 1
    return acc
  }, { ...patientsInitalState })
}
const getPatientAndDrugs = async () => {
  const [patientsResponse, drugsResponse] = await Promise.all(
    [api.getPatients(), api.getDrugs()]
  )
  patients.value = getPatientStateCount(patientsResponse.split(','))
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
</script>

<style scoped>
.drugCard,
.patientCard {
  width: 100px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  border: 1px solid black;
  border-radius: 5px;
  color: black;
}

.drugCard {
  background-color: #ff5e5e;
}

.patientCard {
  background-color: #586eff;
  width: 150px;
}

hr {
  width: 100%;
  margin: 20px 0px;
}
</style>
