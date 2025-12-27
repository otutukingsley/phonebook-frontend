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
      type="tel"
      label="Phone"
      placeholder="123-456-7890"
      :error="form.touched.phone ? form.errors.phone : null"
      required
    />

    <UiTextarea
      v-model="form.values.address"
      name="address"
      label="Address"
      :rows="2"
      placeholder="Enter address..."
    />

    <UiTextarea
      v-model="form.values.notes"
      name="notes"
      label="Notes"
      :rows="3"
      placeholder="Add notes..."
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
          value="other"
          label="Other"
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
        {{ submitButtonText }}
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useForm } from '~/composables/useForm'
import { useContacts } from '~/composables/useContacts'
import { useModal } from '~/composables/useModal'
import UiTextarea from '~/components/ui/Textarea.vue'

const props = defineProps<{
  modalId: string
}>()

const { selectedContact, createContact, updateContact, isLoading } = useContacts()
const { close } = useModal()

const isEditMode = computed(() => !!selectedContact.value)

const form = useForm({
  name: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
  type: 'personal' as 'personal' | 'other'
}, {
  name: [{ type: 'required', message: 'Name is required' }],
  email: [
    { type: 'required', message: 'Email is required' },
    { type: 'email', message: 'Please enter a valid email address' }
  ],
  phone: [{ type: 'required', message: 'Phone is required' }],
  type: [{ type: 'required', message: 'Type is required' }]
})

watch(selectedContact, (contact) => {
  if (contact) {
    form.reset({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      address: contact.address || '',
      notes: contact.notes || '',
      type: contact.type
    })
  } else {
    form.reset()
  }
}, { immediate: true })

const submitButtonText = computed(() => {
  if (form.submitting || isLoading.value) {
    return isEditMode.value ? 'Saving...' : 'Creating...'
  }
  return isEditMode.value ? 'Save Changes' : 'Create Contact'
})

const handleCancel = () => {
  close(props.modalId)
}

const handleSubmit = form.onSubmit(async (values) => {
  try {
    if (isEditMode.value && selectedContact.value) {
      await updateContact(selectedContact.value.id, values)
    } else {
      await createContact(values)
    }
    form.reset()
    close(props.modalId)
  } catch (error) {
    console.error('Error saving contact:', error)
  }
})
</script>