<template>
  <div class="container mx-auto p-4">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-semibold mb-4">
        Hello, {{ (user as { name: string })?.name || 'there' }}! 👋
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

    <div v-if="isLoading" class="text-center py-4">
      <UiSpinner />
    </div>
    
    <div v-else-if="filteredContacts.length === 0" class="text-center py-4">
      <p class="text-gray-500">No contacts found</p>
    </div>

    <div v-else>
      <div class="grid gap-4">
        <div
          v-for="contact in filteredContacts"
          :key="contact.id"
          class="p-4 border rounded-lg"
        >
          <h3 class="font-semibold">{{ contact.name }}</h3>
          <p class="text-gray-600">{{ contact.email }}</p>
          <p class="text-gray-600">{{ contact.phone }}</p>
        </div>
      </div>
      <p class="text-gray-500 text-center mt-4">{{ filteredContacts.length }} contacts found</p>
    </div>

    <UiModal 
      id="contact-modal" 
      :show-footer="false"
    >
      <template #title>
        Add New Contact
      </template>
      <ContactForm modal-id="contact-modal" />
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useModal } from '~/composables/useModal'
import { useContacts } from '~/composables/useContacts'
import ContactForm from '~/components/ContactForm.vue'
import UiButton from '~/components/ui/Button.vue'
import UiModal from '~/components/ui/Modal.vue'
import UiSpinner from '~/components/ui/Spinner.vue'

const { sessionUser: user } = useAuth()
const { open } = useModal()
const { 
  filteredContacts,
  isLoading,
  fetchContacts,
  searchContacts,
} = useContacts()

const searchQuery = ref('')

function handleSearch() {
  searchContacts(searchQuery.value)
}

function handleAddContact() {
  open('contact-modal')
}
onMounted(fetchContacts)

definePageMeta({
  middleware: ['auth'],
})
</script>
