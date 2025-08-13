<template>
  <div class="bg-white p-6 rounded shadow-md w-full max-w-2xl">
    <h2 class="text-2xl font-bold mb-4">Contacts</h2>
    <div v-if="contacts.length === 0" class="text-gray-500">No contacts found.</div>
    <div v-else class="space-y-4">
      <div v-for="contact in contacts" :key="contact.id" class="border p-4 rounded flex justify-between">
        <div>
          <p><strong>Name:</strong> {{ contact.name }}</p>
          <p><strong>Email:</strong> {{ contact.email }}</p>
          <p><strong>Phone:</strong> {{ contact.phone || 'N/A' }}</p>
          <p><strong>Type:</strong> <Badge :text="contact.type" /></p>
        </div>
        <div class="flex space-x-2">
          <Button @click="$emit('edit', contact)" classes="bg-yellow-500 text-white p-2 rounded">Edit</Button>
          <Button @click="$emit('delete', contact.id)" classes="bg-red-500 text-white p-2 rounded">Delete</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Badge from '~/components/ui/Badge.vue';
import Button from '~/components/ui/Button.vue';

defineProps({
  contacts: Array,
});
defineEmits(['edit', 'delete']);
</script>