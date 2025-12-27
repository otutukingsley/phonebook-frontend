<template>
  <div>
    <UiLabel v-if="label" :for="textareaId" :class-name="'mb-1'">{{ label }}</UiLabel>
    <textarea
      :id="textareaId"
      v-model="model"
      :name="name"
      :rows="rows"
      :placeholder="placeholder"
      :class="[
        'w-full p-2 rounded border outline-none text-gray-900 resize-none',
        error ? 'border-red-500 focus:ring-2 focus:ring-red-500/30' : 'border-gray-300 focus:ring-2 focus:ring-green-600/20'
      ]"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label?: string
  name?: string
  id?: string
  rows?: number
  placeholder?: string
  error?: string | null
}>(), {
  label: '',
  name: '',
  id: '',
  rows: 3,
  placeholder: '',
  error: null
})

const model = defineModel<string>({ required: true })

const textareaId = computed(() => {
  if (props.id) return props.id
  const base = props.name || props.label || 'textarea'
  return `${base.toLowerCase().replace(/\s+/g, '-')}-field`
})
</script>
