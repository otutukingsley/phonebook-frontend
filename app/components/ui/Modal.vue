<template>
  <teleport to="body">
    <div
      v-if="state.show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="showTitle ? headingId : undefined"
      :aria-label="!showTitle ? ariaLabel : undefined"
      @click="onBackdrop"
    >
      <div :class="modalClasses" @click.stop>
        <h2 v-if="showTitle" :id="headingId" class="text-xl font-bold mb-3 text-zinc-950">
          <slot name="title" :state="state">
            {{ (state.title ?? props.title) || ' ' }}
          </slot>
        </h2>

        <div v-if="hasBody" class="text-gray-700">
          <slot :state="state">
            {{ state.message ?? props.message }}
          </slot>
        </div>

        <div v-if="showFooter" class="mt-5 flex justify-end gap-2">
          <slot name="footer" :state="state" :confirm="confirm" :cancel="cancel">
            <UiButton color="red" @click="confirm">Confirm</UiButton>
            <UiButton
              variant="none"
              class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
              @click="cancel"
            >
              Cancel
            </UiButton>
          </slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, useSlots, type Ref, useId } from 'vue'
import UiButton from '~/components/ui/Button.vue'
import { useModal, type ModalState } from '~/composables/useModal'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  id: string
  title?: string
  message?: string
  size?: Size
  closeOnEsc?: boolean
  closeOnBackdrop?: boolean
  classes?: string
  showTitle?: boolean
  showFooter?: boolean
}>(), {
  title: '',
  message: '',
  size: 'md',
  closeOnEsc: true,
  closeOnBackdrop: true,
  classes: '',
  showTitle: true, 
  showFooter: true 
})

const emit = defineEmits<{
  (e: 'confirm', done: () => void): void
  (e: 'cancel'): void
}>()

const { modalState, close } = useModal()
const state: Ref<ModalState> = modalState(props.id)

const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' } as const
const modalClasses = computed(() =>
  ['w-full', sizes[props.size], 'bg-white p-6 rounded shadow-md', props.classes]
    .filter(Boolean)
    .join(' ')
)

const showTitle = computed(() => props.showTitle !== false)
const showFooter = computed(() => props.showFooter !== false)

const slots = useSlots()
const hasBody = computed(() => !!(slots.default || props.message || state.value.message))

// If title is hidden, use a string for aria-label if available
const ariaLabel = computed<string | undefined>(() => {
  const t = state.value.title ?? props.title
  return typeof t === 'string' && t.trim() ? t : undefined
})

const headingId = useId() || `modal-${props.id}-title`

function onKeydown(e: KeyboardEvent) {
  if (props.closeOnEsc && e.key === 'Escape' && state.value.show) cancel()
}
function onBackdrop(e: MouseEvent) {
  if (!props.closeOnBackdrop) return
  if (e.target === e.currentTarget) cancel()
}

// Done-callback pattern: parent controls when to close
function confirm() {
  const done = () => close(props.id)
  emit('confirm', done)
}
function cancel() {
  emit('cancel')
  close(props.id)
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>
