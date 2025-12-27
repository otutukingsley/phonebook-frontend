<template>
  <div class="container mx-auto p-4">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-semibold mb-4">
        Hello, {{ (user as { name: string })?.name || 'there' }}!
      </h1>
      <p class="text-lg text-gray-600 mb-6">Welcome to your Phone Book dashboard</p>
    </div>

    <div class="flex justify-between mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search contacts..."
        class="w-1/3 rounded border px-3 py-2"
        @input="handleSearch"
      >
      <UiButton @click="handleAddContact">
        Add Contact
      </UiButton>
    </div>

    <div v-if="isLoading && filteredContacts.length === 0" class="text-center py-4">
      <UiSpinner />
    </div>

    <div v-else-if="filteredContacts.length === 0" class="text-center py-4">
      <p class="text-gray-500">No contacts found</p>
    </div>

    <div v-else>
      <div class="grid gap-4">
        <ContactCard
          v-for="contact in filteredContacts"
          :key="contact.id"
          :contact="contact"
          @view="handleViewContact"
          @edit="handleEditContact"
          @delete="handleDeleteContact"
        />
      </div>

      <div class="text-center mt-6">
        <p class="text-gray-500 mb-4">{{ filteredContacts.length }} contacts</p>
        <UiButton
          v-if="pagination.hasMore"
          :disabled="isLoading"
          color="gray"
          @click="handleLoadMore"
        >
          {{ isLoading ? 'Loading...' : 'Load More' }}
        </UiButton>
      </div>
    </div>

    <UiModal
      id="contact-modal"
      :show-footer="false"
    >
      <template #title>
        {{ selectedContact ? 'Edit Contact' : 'Add New Contact' }}
      </template>
      <ContactForm modal-id="contact-modal" />
    </UiModal>

    <ViewContactModal />
    <DeleteConfirmModal @deleted="handleDeleted" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useModal } from '~/composables/useModal'
import { useContacts } from '~/composables/useContacts'
import ContactForm from '~/components/ContactForm.vue'
import ContactCard from '~/components/ContactCard.vue'
import ViewContactModal from '~/components/ViewContactModal.vue'
import DeleteConfirmModal from '~/components/DeleteConfirmModal.vue'
import UiButton from '~/components/ui/Button.vue'
import UiModal from '~/components/ui/Modal.vue'
import UiSpinner from '~/components/ui/Spinner.vue'

interface Contact {
  id: string
  userEmail: string
  name: string
  email: string
  phone: string
  address?: string
  notes?: string
  type: 'personal' | 'other'
  createdAt: string
  updatedAt?: string
}

const { sessionUser: user } = useAuth()
const { open } = useModal()
const {
  filteredContacts,
  selectedContact,
  isLoading,
  pagination,
  fetchContacts,
  loadMore,
  searchContacts,
  selectContact,
} = useContacts()

const searchQuery = ref('')
let searchTimeout: ReturnType<typeof setTimeout> | null = null

function handleSearch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    searchContacts(searchQuery.value)
  }, 300)
}

function handleAddContact() {
  selectContact(null)
  open('contact-modal')
}

function handleViewContact(contact: Contact) {
  selectContact(contact)
  open('view-contact-modal')
}

function handleEditContact(contact: Contact) {
  selectContact(contact)
  open('contact-modal')
}

function handleDeleteContact(contact: Contact) {
  selectContact(contact)
  open('delete-confirm-modal')
}

function handleLoadMore() {
  loadMore()
}

function handleDeleted() {
  // Contact was deleted, list is already updated by useContacts
}

onMounted(fetchContacts)

definePageMeta({
  middleware: ['auth'],
})
</script>
