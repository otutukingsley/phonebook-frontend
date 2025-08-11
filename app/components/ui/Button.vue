<template>
  <button
    :class="buttonClasses"
    :type="props.type"
    :disabled="props.disabled"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  color?: 'green' | 'blue' | 'red' | 'gray' | 'white'
  size?: 'sm' | 'md' | 'lg'
  classes?: string
  variant?: 'default' | 'none'
}>(), {
  type: 'button',
  disabled: false,
  color: 'green',
  size: 'md',
  classes: '',
  variant: 'default'
})

const emit = defineEmits<{ (e: 'click', ev: MouseEvent): void }>()

const buttonClasses = computed(() => {
  if (props.variant === 'none') return props.classes?.trim() || ''

  const colorMap = {
    green: 'bg-green-600 hover:bg-green-700 text-white',
    blue:  'bg-blue-600  hover:bg-blue-700  text-white',
    red:   'bg-red-600   hover:bg-red-700   text-white',
    gray:  'bg-gray-600  hover:bg-gray-700  text-white',
    white: 'bg-white text-gray-900 hover:bg-gray-100'
  } as const

  const sizeMap = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  } as const

  return [
    colorMap[props.color],
    sizeMap[props.size],
    'rounded inline-flex items-center justify-center font-medium',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
    props.classes
  ].filter(Boolean).join(' ')
})
</script>
