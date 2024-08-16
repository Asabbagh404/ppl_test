<template>
  <span class="patientCard" @dblclick="setEditMode">
    {{ patientStateSymbolMapper[state as keyof typeof patientStateSymbolMapper] }}:
    <InputText v-if="isEditMode && isEditable" v-model="inputValue" @blur="saveEdit" @keyup.enter="saveEdit"
      class="w-[55px]" />
    <span v-else>{{ inputValue }} <template v-if="isEditable">
        <i class="pi pi-pencil" @click="setEditMode"></i>
      </template></span>
  </span>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { patientStateSymbolMapper } from '../mapper'
import InputText from 'primevue/inputtext'

const props = defineProps<{
  state: string,
  patient: number,
  isEditable?: boolean,
}>()

const emit = defineEmits(['update:patient'])

const inputValue = ref(props.patient.toString())
let isEditMode = ref(false)

function saveEdit() {
  const newPatientValue = parseInt(inputValue.value)
  emit('update:patient', newPatientValue)
  isEditMode.value = false
}
const setEditMode = () => {
  if (isEditMode.value) {
    isEditMode.value = false
    return
  }
  isEditMode.value = true
  inputValue.value = props.patient.toString()
}

watch(() => props.patient, (newVal) => {
  inputValue.value = newVal.toString()
})
</script>
