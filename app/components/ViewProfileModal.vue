<template>
  <UiModal
    id="view-profile-modal"
    :show-footer="false"
    size="md"
  >
    <template #title>
      Profile
    </template>

    <div v-if="user" class="space-y-4">
      <div class="space-y-3">
        <div>
          <label class="text-sm font-medium text-gray-500">Name</label>
          <p class="text-gray-900 font-bold capitalize">{{ user.name }}</p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-500">Email</label>
          <p class="text-gray-900">{{ user.email }}</p>
        </div>

        <div v-if="user.securityQuestion">
          <label class="text-sm font-medium text-gray-500">Security Question</label>
          <p class="text-gray-900">{{ getSecurityQuestionLabel(user.securityQuestion) }}</p>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-4">
        <UiButton color="gray" @click="handleClose">
          <XMarkIcon class="h-4 w-4 mr-1" />
          Close
        </UiButton>
        <UiButton color="blue" @click="handleEdit">
          <PencilSquareIcon class="h-4 w-4 mr-1" />
          Edit
        </UiButton>
      </div>
    </div>

    <div v-else class="text-center py-4">
      <UiSpinner />
      <p class="text-gray-500 mt-2">Loading profile...</p>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { XMarkIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'
import { useAuth } from '~/composables/useAuth'
import { useModal } from '~/composables/useModal'
import { getSecurityQuestionLabel } from '~/constants/securityQuestions'
import UiModal from '~/components/ui/Modal.vue'
import UiButton from '~/components/ui/Button.vue'
import UiSpinner from '~/components/ui/Spinner.vue'

const { user, fetchUser } = useAuth()
const { close, open, isOpen } = useModal()

// Fetch user data when modal opens
watch(() => isOpen('view-profile-modal'), async (open) => {
  if (open && !user.value) {
    try {
      await fetchUser(true)
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }
}, { immediate: true })

function handleClose() {
  close('view-profile-modal')
}

function handleEdit() {
  close('view-profile-modal')
  open('edit-profile-modal')
}
</script>
