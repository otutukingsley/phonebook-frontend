import type { Ref } from 'vue'

export type ModalState = {
  show: boolean
  title?: string
  message?: string
} & Record<string, unknown>

export function useModal() {
  // Per-modal, SSR-safe state
  const modalState = (id: string): Ref<ModalState> =>
    useState<ModalState>(`modal:${id}`, () => ({ show: false }))

  const open = (id: string, params: Partial<ModalState> = {}) => {
    const s = modalState(id)
    s.value = { ...s.value, show: true, ...params }
  }

  const close = (id: string): void => {
    const s = modalState(id)
    s.value = { ...s.value, show: false }
  }

  const toggle = (id: string, params: Partial<ModalState> = {}): void => {
    const s = modalState(id)
    s.value = { ...s.value, show: !s.value.show, ...params }
  }

  const isOpen = (id: string): boolean => {
    const s = modalState(id)
    return s.value.show
  }

  return { modalState, open, close, toggle, isOpen }
}
