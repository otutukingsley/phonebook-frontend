<template>
  <label
    v-bind="$attrs"
    :class="[
      'block text-sm font-medium text-gray-900',
      className
    ]"
  >
    <slot />
  </label>
</template>

<script setup lang="ts">
defineProps<{
  className?: string
}>()

// Allow label attributes to pass through (like 'for')
defineOptions({
  inheritAttrs: true
})
</script>
