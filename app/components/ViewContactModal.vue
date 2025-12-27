<template>
  <UiModal
    id="view-contact-modal"
    :show-footer="false"
    size="md"
  >
    <template #title>
      Contact Details
    </template>

    <div v-if="selectedContact" class="space-y-4">
      <div class="space-y-3">
        <div>
          <label class="text-sm font-medium text-gray-500">Name</label>
          <p class="text-gray-900 capitalize">{{ selectedContact.name }}</p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-500">Email</label>
          <p class="text-gray-900">{{ selectedContact.email }}</p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-500">Phone</label>
          <p class="text-gray-900">{{ selectedContact.phone }}</p>
        </div>

        <div v-if="selectedContact.address">
          <label class="text-sm font-medium text-gray-500">Address</label>
          <p class="text-gray-900 whitespace-pre-line">{{ selectedContact.address }}</p>
        </div>

        <div v-if="selectedContact.notes">
          <label class="text-sm font-medium text-gray-500">Notes</label>
          <p class="text-gray-900 whitespace-pre-line">{{ selectedContact.notes }}</p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-500">Type</label>
          <div class="mt-1">
            <UiBadge
              :text="selectedContact.type"
              :color="selectedContact.type === 'other' ? 'blue' : 'green'"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-4">
        <UiButton color="gray" @click="handleClose">
          <XMarkIcon class="h-4 w-4 mr-1" />
          Close
        </UiButton>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useContacts } from '~/composables/useContacts'
import { useModal } from '~/composables/useModal'
import UiModal from '~/components/ui/Modal.vue'
import UiBadge from '~/components/ui/Badge.vue'
import UiButton from '~/components/ui/Button.vue'

const { selectedContact } = useContacts()
const { close } = useModal()

function handleClose() {
  close('view-contact-modal')
}
</script>
