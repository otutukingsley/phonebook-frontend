<template>
  <div class="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="font-semibold text-lg truncate">{{ contact.name }}</h3>
          <UiBadge
            :text="contact.type"
            :color="contact.type === 'other' ? 'blue' : 'green'"
            size="sm"
          />
        </div>
        <p class="text-gray-600 truncate">{{ contact.email }}</p>
        <p class="text-gray-600">{{ contact.phone }}</p>
      </div>
      <div class="flex gap-2 ml-4 flex-shrink-0">
        <UiButton size="sm" color="blue" @click="$emit('view', contact)">
          View
        </UiButton>
        <UiButton size="sm" color="gray" @click="$emit('edit', contact)">
          Edit
        </UiButton>
        <UiButton size="sm" color="red" @click="$emit('delete', contact)">
          Delete
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiBadge from '~/components/ui/Badge.vue'
import UiButton from '~/components/ui/Button.vue'

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

defineProps<{
  contact: Contact
}>()

defineEmits<{
  (e: 'view', contact: Contact): void
  (e: 'edit', contact: Contact): void
  (e: 'delete', contact: Contact): void
}>()
</script>
