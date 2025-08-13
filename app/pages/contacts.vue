<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="overflow-y-auto max-h-screen">
      <ContactForm :title="editing ? 'Edit Contact' : 'Add Contact'" :initialContact="editing" @submit="handleSubmit" />
      <Spinner v-if="loading" />
    </div>
    <div>
      <input v-model="search" placeholder="Search contacts" class="w-full p-2 border rounded mb-4" />
      <ContactList :contacts="filteredContacts.slice(0, visible)" @edit="startEdit" @delete="confirmDelete" />
      <Button v-if="filteredContacts.length > visible" @click="showMore" classes="mt-4">Show More</Button>
      <Modal :show="showModal" title="Confirm Delete" message="Are you sure you want to delete this contact?" @confirm="handleDelete" @cancel="showModal = false" />
    </div>
  </div>
</template>

<script setup>
import { useContacts } from '~/composables/useContacts.js';
import ContactForm from '~/components/ContactForm.vue';
import ContactList from '~/components/ContactList.vue';
import Modal from '~/components/ui/Modal.vue';
import Spinner from '~/components/ui/Spinner.vue';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  middleware: ['auth']
});

const { fetchContacts, addContact, updateContact, deleteContact, search, visible, loading, editing, filteredContacts, showMore } = useContacts();
const { fetchUser } = useAuth();
const showModal = ref(false);
const deleteId = ref(null);

onMounted(async () => {
  await fetchUser();
  await fetchContacts();
});

const handleSubmit = async (form) => {
  if (editing.value) {
    await updateContact(form);
  } else {
    await addContact(form);
  }
};

const startEdit = (contact) => {
  editing.value = contact;
};

const confirmDelete = (id) => {
  deleteId.value = id;
  showModal.value = true;
};

const handleDelete = async () => {
  await deleteContact(deleteId.value);
  showModal.value = false;
};
</script>