<template>
  <UiModal
    id="delete-confirm-modal"
    title="Delete Contact"
    size="sm"
    @confirm="handleConfirm"
  >
    <p class="text-gray-700">
      Are you sure you want to delete
      <strong>{{ selectedContact?.name }}</strong>?
      This action cannot be undone.
    </p>
  </UiModal>
</template>

<script setup lang="ts">
import { useContacts } from '~/composables/useContacts'
import UiModal from '~/components/ui/Modal.vue'

const { selectedContact, deleteContact } = useContacts()

const emit = defineEmits<{
  (e: 'deleted'): void
}>()

async function handleConfirm(done: () => void) {
  if (selectedContact.value) {
    try {
      await deleteContact(selectedContact.value.id)
      emit('deleted')
      done()
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }
}
</script>
