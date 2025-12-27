<template>
  <div>
    <UiLabel v-if="label" :for="inputId" :class-name="'mb-1'">{{ label }}</UiLabel>
    <input
      :id="inputId"
      v-model="model"
      :type="inputType"
      :inputmode="inputMode"
      :name="name"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :class="[
        'w-full p-2 rounded border outline-none text-gray-900',
        error ? 'border-red-500 focus:ring-2 focus:ring-red-500/30' : 'border-gray-300 focus:ring-2 focus:ring-green-600/20',
        inputClasses
      ]"
      @input="handleInput"
    >
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label?: string
  name?: string
  id?: string
  type?: 'text' | 'email' | 'password' | 'tel'
  placeholder?: string
  maxlength?: number
  error?: string | null
  inputClasses?: string
}>(), {
  label: '',
  name: '',
  id: '',
  type: 'text',
  placeholder: '',
  maxlength: undefined,
  error: null,
  inputClasses: ''
})

const model = defineModel<string>({ required: true })

const inputType = computed(() => {
  if (props.type === 'tel') return 'text'
  return props.type
})

const inputMode = computed(() => {
  if (props.type === 'tel') return 'tel'
  if (props.type === 'email') return 'email'
  return undefined
})

function handleInput(event: Event) {
  if (props.type === 'tel') {
    const input = event.target as HTMLInputElement
    // Allow only numbers, spaces, dashes, plus, and parentheses
    input.value = input.value.replace(/[^\d\s\-+()]/g, '')
    model.value = input.value
  }
}

// Using a deterministic ID based on name and label to avoid hydration mismatches
const inputId = computed(() => {
  if (props.id) return props.id
  const base = props.name || props.label || 'input'
  return `${base.toLowerCase().replace(/\s+/g, '-')}-field`
})
</script>
