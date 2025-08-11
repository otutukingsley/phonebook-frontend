<template>
  <div class="inline-flex items-center gap-2">
    <input
      :id="inputId"
      v-model="model"
      type="radio"
      :name="name"
      :value="props.value"
      :disabled="disabled"
      class="h-4 w-4 rounded-full border-gray-300 text-green-600 focus:ring-1 focus:ring-offset-1 focus:ring-green-600 disabled:opacity-50"
    >
    <label :for="inputId" class="select-none" :class="labelClasses">
      <slot>{{ label }}</slot>
    </label>
  </div>
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
