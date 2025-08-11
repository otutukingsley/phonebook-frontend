<template>
  <span :class="badgeClasses">{{ text }}</span>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  text?: string
  color?: 'green' | 'blue' | 'red'
  size?: 'sm' | 'md' | 'lg'
}>(), {
  text: '',
  color: 'green',
  size: 'sm',
})


const badgeClasses = computed(() => {
  const colorClasses = {
    green: 'bg-green-200 text-green-800',
    blue: 'bg-blue-200 text-blue-800',
    red: 'bg-red-200 text-red-800',
  };
  const sizeClasses = {
    sm: 'text-sm px-2.5 py-0.5',
    md: 'text-base px-3 py-1',
    lg: 'text-lg px-4 py-1.5',
  };
  return [
    colorClasses[props.color || 'green'],
    sizeClasses[props.size || 'sm'],
    'font-semibold rounded',
  ];
});
</script>