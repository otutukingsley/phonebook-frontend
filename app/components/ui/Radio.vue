<template>
  <label
    :for="inputId"
    class="inline-flex items-center gap-3 px-4 py-2 rounded-lg border cursor-pointer transition-all select-none"
    :class="[
      model === props.value
        ? 'border-green-600 bg-green-50 text-green-800'
        : 'border-gray-300 hover:border-gray-400 text-gray-700',
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    ]"
  >
    <input
      :id="inputId"
      v-model="model"
      type="radio"
      :name="name"
      :value="props.value"
      :disabled="disabled"
      class="h-4 w-4 text-green-600 border-gray-300 focus:ring-2 focus:ring-green-600 focus:ring-offset-0"
    >
    <span :class="labelClasses">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** the radio's submitted value */
    value: string | number;
    /** visible label (or use slot) */
    label?: string;
    /** radio group name for native grouping & a11y */
    name?: string;
    /** optional explicit id; falls back to name+value */
    id?: string;
    disabled?: boolean;
    /** extra classes for the <label> text */
    labelClasses?: string;
  }>(),
  {
    disabled: false,
    label: "",
    name: undefined,
    id: undefined,
    labelClasses: "",
  }
);

const model = defineModel<string | number>({ required: true });

const inputId = computed(
  () =>
    props.id ??
    (props.name
      ? `${props.name}-${String(props.value)}`
      : `radio-${String(props.value)}`)
);
</script>
