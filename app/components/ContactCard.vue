<template>
  <div class="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div class="flex items-center gap-2 mb-3">
      <h3 class="font-bold text-lg text-gray-700 truncate capitalize">{{ contact.name }}</h3>
      <UiBadge
        :text="contact.type"
        :color="contact.type === 'other' ? 'blue' : 'green'"
        size="sm"
      />
    </div>
    <div class="space-y-1 mb-4">
      <p class="text-gray-700 truncate">{{ contact.email }}</p>
      <p class="text-gray-700">{{ contact.phone }}</p>
    </div>
    <div class="flex gap-2">
      <UiButton size="sm" color="blue" @click="$emit('view', contact)">
        <EyeIcon class="h-4 w-4 mr-1" />
        View
      </UiButton>
      <UiButton size="sm" color="gray" @click="$emit('edit', contact)">
        <PencilSquareIcon class="h-4 w-4 mr-1" />
        Edit
      </UiButton>
      <UiButton size="sm" color="red" @click="$emit('delete', contact)">
        <TrashIcon class="h-4 w-4 mr-1" />
        Delete
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
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
