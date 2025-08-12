<template>
  <span
    :class="[
      'inline-block animate-spin rounded-full align-middle',
      size === 'xs'
        ? 'h-3 w-3'
        : size === 'sm'
          ? 'h-4 w-4'
          : size === 'md'
            ? 'h-5 w-5'
            : size === 'lg'
              ? 'h-6 w-6'
              : 'h-8 w-8',
      'border-2 border-solid border-transparent',
      'border-t-current',
      classes,
    ]"
    role="status"
    aria-live="polite"
    :aria-label="label"
  >
    <span class="sr-only">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    label?: string;
    classes?: string;
  }>(),
  {
    size: "sm",
    label: "Loading…",
    classes: "",
  }
);
</script>
