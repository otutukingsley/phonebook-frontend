<template>
  <NuxtLink
    :to="to"
    :external="external"
    :target="newTab ? '_blank' : undefined"
    :class="computeClasses(route.path === to)"
    :aria-current="route.path === to ? 'page' : undefined"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import { useRoute } from '#imports'

const route = useRoute()

const props = withDefaults(
  defineProps<{
    to: string;
    external?: boolean;
    newTab?: boolean;
    button?: boolean;
    color?: "green" | "blue" | "red" | "gray" | "white";
    size?: "sm" | "md" | "lg";
    variant?: "default" | "nav" | "navBrand" | "none";
    classes?: string;
    exact?: boolean;
    activeClass?: string;
    underline?: boolean | 'hover' | 'active' | 'always';
  }>(),
  {
    external: false,
    newTab: false,
    button: false,
    color: "green",
    size: "md",
    variant: "default",
    classes: "",
    exact: false,
    activeClass: "",
    underline: false,
  }
);

const sizeText = { sm: "text-sm", md: "text-base", lg: "text-lg" } as const;
const sizeBtn = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-1.5 text-base",
  lg: "px-4 py-2 text-lg",
} as const;

const colorText = {
  green: "text-green-600 hover:text-green-700",
  blue: "text-blue-600 hover:text-blue-700",
  red: "text-red-600 hover:text-red-700",
  gray: "text-gray-600 hover:text-gray-700",
  white: "text-white hover:text-white/80",
} as const;

const colorBtn = {
  green: "bg-green-600 hover:bg-green-700 text-white",
  blue: "bg-blue-600 hover:bg-blue-700 text-white",
  red: "bg-red-600 hover:bg-red-700 text-white",
  gray: "bg-gray-600 hover:bg-gray-700 text-white",
  white: "bg-white text-gray-900 hover:bg-gray-100",
} as const;

// Nav styles
const baseNavStyle = "pb-1 transition-colors";
const navBrand = "text-white no-underline";

function computeClasses(isActive: boolean) {
  if (props.variant === "none") return props.classes?.trim() || "";

  const size = props.button ? sizeBtn[props.size] : sizeText[props.size];
  const color = props.button ? colorBtn[props.color] : colorText[props.color];

  if (props.variant === "navBrand") {
    return ["inline-block", size, navBrand, props.classes]
      .filter(Boolean)
      .join(" ");
  }

  if (props.variant === "nav") {
    const navStyles = {
      green: {
        default: "text-green-600/80 hover:text-green-700 hover:border-b-2 hover:border-green-700",
        active: "text-green-600 border-b-2 border-green-600",
      },
      blue: {
        default: "text-blue-600/80 hover:text-blue-700 hover:border-b-2 hover:border-blue-700",
        active: "text-blue-600 border-b-2 border-blue-600",
      },
      red: {
        default: "text-red-600/80 hover:text-red-700 hover:border-b-2 hover:border-red-700",
        active: "text-red-600 border-b-2 border-red-600",
      },
      gray: {
        default: "text-gray-600/80 hover:text-gray-700 hover:border-b-2 hover:border-gray-700",
        active: "text-gray-600 border-b-2 border-gray-600",
      },
      white: {
        default: "text-white/80 hover:text-white hover:border-b-2 hover:border-white",
        active: "text-white border-b-2 border-white",
      },
    };

    const colorStyles = navStyles[props.color];

    return [
      "inline-block",
      size,
      baseNavStyle,
      isActive ? colorStyles.active : colorStyles.default,
      props.classes,
    ]
      .filter(Boolean)
      .join(" ");
  }

  // default variant
  const getUnderlineClasses = () => {
    if (props.button) return "";
    switch (props.underline) {
      case 'hover':
        return "hover:underline";
      case 'active':
        return isActive ? "underline" : "";
      case 'always':
        return "underline";
      case true:
        return "underline";
      default:
        return "";
    }
  };

  const fallbackActive = props.activeClass || "";
  
  return [
    "inline-block",
    size,
    props.button ? "rounded font-medium" : "",
    props.button ? color : color,
    getUnderlineClasses(),
    isActive ? fallbackActive : "",
    props.classes,
  ]
    .filter(Boolean)
    .join(" ");
}
</script>
