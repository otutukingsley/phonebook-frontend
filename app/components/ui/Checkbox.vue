<template>
  <div class="inline-flex items-center gap-2">
    <input
      :id="inputId"
      v-model="model"
      type="checkbox"
      :name="name"
      :disabled="disabled"
      class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-offset-2 focus:ring-green-600 disabled:opacity-50"
    >
    <UiLabel :for="inputId" :class-name="'select-none text-base'">
      <slot>{{ label }}</slot>
    </UiLabel>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import UiLabel from './Label.vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    name?: string;
    id?: string;
    disabled?: boolean;
  }>(),
  {
    label: "",
    name: undefined,
    id: undefined,
    disabled: false,
  }
);

const model = defineModel<boolean>({ required: true });
// Using a deterministic ID based on name and label to avoid hydration mismatches
const inputId = computed(() => {
  if (props.id) return props.id;
  if (props.name) return `${props.name}-checkbox`;
  const base = props.label || 'checkbox';
  return `${base.toLowerCase().replace(/\s+/g, '-')}-field`;
});
</script>
