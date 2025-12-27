<template>
  <UiModal
    id="edit-profile-modal"
    :show-footer="false"
    size="md"
  >
    <template #title>
      Edit Profile
    </template>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <UiInput
        v-model="form.values.name"
        name="name"
        label="Name"
        :error="form.touched.name ? form.errors.name : null"
        required
      />

      <UiInput
        v-model="form.values.email"
        name="email"
        type="email"
        label="Email"
        :error="form.touched.email ? form.errors.email : null"
        required
      />

      <div class="border-t pt-4 mt-4">
        <p class="text-sm text-gray-500 mb-3">Leave password fields blank to keep your current password</p>

        <UiInput
          v-model="form.values.newPassword"
          name="newPassword"
          type="password"
          label="New Password"
          placeholder="Enter new password (optional)"
          :error="form.touched.newPassword ? form.errors.newPassword : null"
        />

        <div class="mt-4">
          <UiInput
            v-model="form.values.confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm New Password"
            placeholder="Confirm new password"
            :error="form.touched.confirmPassword ? form.errors.confirmPassword : null"
          />
        </div>
      </div>

      <p v-if="submitError" class="text-red-500 text-sm">{{ submitError }}</p>

      <div class="flex justify-end gap-2 pt-4">
        <UiButton type="button" color="gray" @click="handleCancel">
          Cancel
        </UiButton>
        <UiButton type="submit" :disabled="form.submitting || isLoading">
          {{ form.submitting || isLoading ? 'Saving...' : 'Save Changes' }}
        </UiButton>
      </div>
    </form>
  </UiModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useForm } from '~/composables/useForm'
import { useAuth } from '~/composables/useAuth'
import { useModal } from '~/composables/useModal'
import UiModal from '~/components/ui/Modal.vue'
import UiButton from '~/components/ui/Button.vue'
import UiInput from '~/components/ui/Input.vue'

const { user, updateProfile, isLoading } = useAuth()
const { close, isOpen } = useModal()
const submitError = ref('')

const form = useForm({
  name: '',
  email: '',
  newPassword: '',
  confirmPassword: ''
}, {
  name: [
    { type: 'required', message: 'Name is required' },
    {
      type: 'custom',
      validate: (value: unknown) => {
        if (typeof value !== 'string') return false
        return /^[a-zA-Z\s]{2,}$/.test(value)
      },
      message: 'Name must be at least 2 characters and contain only letters'
    }
  ],
  email: [
    { type: 'required', message: 'Email is required' },
    { type: 'email', message: 'Please enter a valid email' }
  ],
  newPassword: [
    {
      type: 'custom',
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !value) return true
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
      },
      message: 'Password must be at least 8 characters and include uppercase, lowercase, number and special character'
    }
  ],
  confirmPassword: []
})

watch(() => isOpen('edit-profile-modal'), (open) => {
  if (open && user.value) {
    form.reset({
      name: user.value.name,
      email: user.value.email,
      newPassword: '',
      confirmPassword: ''
    })
    submitError.value = ''
  }
}, { immediate: true })

const handleCancel = () => {
  close('edit-profile-modal')
}

const handleSubmit = form.onSubmit(async (values) => {
  submitError.value = ''

  // Custom validation for password confirmation
  if (values.newPassword && values.newPassword !== values.confirmPassword) {
    submitError.value = 'Passwords do not match'
    return
  }

  try {
    const payload: { name?: string; email?: string; password?: string } = {}

    if (values.name !== user.value?.name) {
      payload.name = values.name
    }
    if (values.email !== user.value?.email) {
      payload.email = values.email
    }
    if (values.newPassword) {
      payload.password = values.newPassword
    }

    if (Object.keys(payload).length === 0) {
      close('edit-profile-modal')
      return
    }

    await updateProfile(payload)
    form.reset()
    close('edit-profile-modal')
  } catch (error) {
    if (error instanceof Error) {
      submitError.value = error.message
    } else {
      submitError.value = 'Failed to update profile'
    }
  }
})
</script>
