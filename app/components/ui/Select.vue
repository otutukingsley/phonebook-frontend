<template>
  <div>
    <UiLabel v-if="label" :for="selectId" :class-name="'mb-1'">{{ label }}</UiLabel>
    <select
      :id="selectId"
      v-model="model"
      :name="fieldName"
      :disabled="disabled"
      :class="[
        'w-full p-2 rounded border outline-none text-gray-900 bg-white',
        error ? 'border-red-500 focus:ring-2 focus:ring-red-500/30' : 'border-gray-300 focus:ring-2 focus:ring-green-600/20',
        disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : '',
        selectClasses
      ]"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface SelectOption {
  value: string
  label: string
}

const props = withDefaults(defineProps<{
  label?: string
  fieldName?: string
  id?: string
  options: SelectOption[]
  placeholder?: string
  error?: string | null
  disabled?: boolean
  selectClasses?: string
}>(), {
  label: '',
  fieldName: '',
  id: '',
  placeholder: '',
  error: null,
  disabled: false,
  selectClasses: ''
})

const model = defineModel<string>({ required: true })

const selectId = computed(() => {
  if (props.id) return props.id
  const base = props.fieldName || props.label || 'select'
  return `${base.toLowerCase().replace(/\s+/g, '-')}-field`
})
</script>
