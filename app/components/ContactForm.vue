<template>
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
    
    <UiInput
      v-model="form.values.phone"
      name="phone"
      label="Phone"
      :error="form.touched.phone ? form.errors.phone : null"
      required
    />

    <div class="space-y-2">
      <label class="font-medium">Contact Type</label>
      <div class="flex gap-4">
        <UiRadio
          v-model="form.values.type"
          name="type"
          value="personal"
          label="Personal"
        />
        <UiRadio
          v-model="form.values.type"
          name="type"
          value="professional"
          label="Professional"
        />
      </div>
    </div>

    <div class="flex justify-end gap-2 pt-4">
      <UiButton
        variant="default"
        color="gray"
        type="button"
        @click="handleCancel"
      >
        Cancel
      </UiButton>
      <UiButton 
        type="submit"
        :disabled="form.submitting || isLoading"
      >
        {{ form.submitting || isLoading ? 'Creating...' : 'Create Contact' }}
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useForm } from '~/composables/useForm'
import { useContacts } from '~/composables/useContacts'
import { useModal } from '~/composables/useModal'

const props = defineProps<{
  modalId: string
}>()

const { createContact, isLoading } = useContacts()
const { close } = useModal()

const form = useForm({
  name: '',
  email: '',
  phone: '',
  type: 'personal' as const
}, {
  name: [{ type: 'required', message: 'Name is required' }],
  email: [
    { type: 'required', message: 'Email is required' },
    { type: 'email', message: 'Please enter a valid email address' }
  ],
  phone: [{ type: 'required', message: 'Phone is required' }],
  type: [{ type: 'required', message: 'Type is required' }]
})

const handleCancel = () => {
  close(props.modalId)
}

const handleSubmit = form.onSubmit(async (values) => {
  try {
    await createContact(values)
    form.reset()
    close(props.modalId)
  } catch (error) {
    console.error('Error creating contact:', error)
  }
})
</script>