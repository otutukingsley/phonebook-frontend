<template>
  <a
    v-if="props.external"
    :href="props.to"
    :class="linkClasses"
    :target="props.newTab ? '_blank' : undefined"
    :rel="props.newTab ? 'noopener noreferrer' : undefined"
  >
    <slot />
  </a>

  <NuxtLink v-else :to="props.to" :class="linkClasses">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  to?: string
  external?: boolean
  newTab?: boolean
  color?: 'green' | 'blue' | 'red' | 'gray' | 'white'
  underline?: boolean
  button?: boolean
  size?: 'sm' | 'md' | 'lg'
  classes?: string
  /** add this */
  variant?: 'default' | 'nav' | 'none'
}>(), {
  to: '',
  external: false,
  newTab: false,
  color: 'green',
  underline: true,
  button: false,
  size: 'md',
  classes: '',
  variant: 'default'
})

const linkClasses = computed(() => {
  if (props.variant === 'none') return props.classes?.trim() || ''

  const colorText = {
    green: 'text-green-600 hover:text-green-700',
    blue:  'text-blue-600 hover:text-blue-700',
    red:   'text-red-600 hover:text-red-700',
    gray:  'text-gray-200 hover:text-gray-100',
    white: 'text-white hover:text-white/80'
  } as const

  const colorButton = {
    green: 'bg-green-600 hover:bg-green-700 text-white',
    blue:  'bg-blue-600  hover:bg-blue-700  text-white',
    red:   'bg-red-600   hover:bg-red-700   text-white',
    gray:  'bg-gray-600  hover:bg-gray-700  text-white',
    white: 'bg-white text-gray-900 hover:bg-gray-100'
  } as const

  const textSizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' } as const
  const btnSizes  = { sm: 'px-2 py-1 text-sm', md: 'px-3 py-1.5 text-base', lg: 'px-4 py-2 text-lg' } as const

  const baseColor = props.button ? colorButton[props.color] : colorText[props.color]
  const size      = props.button ? btnSizes[props.size] : textSizes[props.size]

  const navPreset = props.variant === 'nav'
    ? 'text-white hover:text-white/80 no-underline'
    : (props.underline && !props.button ? 'underline' : 'no-underline')

  return [
    'inline-block',
    baseColor,
    size,
    props.button ? 'rounded font-medium' : '',
    navPreset,
    props.classes
  ].filter(Boolean).join(' ')
})
</script>
