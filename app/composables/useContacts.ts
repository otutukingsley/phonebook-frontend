interface Contact {
  id: string;
  userEmail: string;
  name: string;
  email: string;
  phone: string;
  type: 'personal' | 'professional';
  createdAt: string;
  updatedAt?: string;
}

type CreateContactPayload = {
  name: string;
  email: string;
  phone: string;
  type?: 'personal' | 'professional';
}

export function useContacts() {
  const { get, post, put, delete: del } = useApi();
  const contacts = useState<Contact[]>('contacts', () => []);
  const filteredContacts = useState<Contact[]>('filtered-contacts', () => []);
  const selectedContact = useState<Contact | null>('selected-contact', () => null);
  const isLoading = useState<boolean>('contacts:loading', () => false);
  const searchInput = useState<string>('contacts:search', () => '');

  async function fetchContacts() {
    isLoading.value = true;
    try {
      const data = await get<Contact[]>('/api/contacts');
      contacts.value = data;
      filteredContacts.value = data;
      return data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function createContact(contact: CreateContactPayload) {
    isLoading.value = true;
    try {
      const newContact = await post<Contact>('/api/contacts', contact);
      contacts.value = [...contacts.value, newContact];
      updateFilteredContacts();
      return newContact;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateContact(id: string, updates: Partial<CreateContactPayload>) {
    isLoading.value = true;
    try {
      // Only send fields that have actually changed
      const cleanUpdates: Partial<CreateContactPayload> = {};
      
      if (updates.name !== undefined && updates.name !== selectedContact.value?.name) {
        cleanUpdates.name = updates.name;
      }
      if (updates.email !== undefined && updates.email !== selectedContact.value?.email) {
        cleanUpdates.email = updates.email;
      }
      if (updates.phone !== undefined && updates.phone !== selectedContact.value?.phone) {
        cleanUpdates.phone = updates.phone;
      }
      if (updates.type !== undefined && updates.type !== selectedContact.value?.type) {
        cleanUpdates.type = updates.type;
      }

      if (Object.keys(cleanUpdates).length === 0) {
        return selectedContact.value;
      }

      const updatedContact = await put<Contact>(`/api/contacts/${id}`, cleanUpdates);
      contacts.value = contacts.value.map(c => 
        c.id === id ? updatedContact : c
      );
      updateFilteredContacts();
      selectedContact.value = null;
      return updatedContact;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteContact(id: string) {
    isLoading.value = true;
    try {
      await del(`/api/contacts/${id}`);
      contacts.value = contacts.value.filter(c => c.id !== id);
      updateFilteredContacts();
      if (selectedContact.value?.id === id) {
        selectedContact.value = null;
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  function searchContacts(query: string) {
    searchInput.value = query;
    updateFilteredContacts();
  }

  function updateFilteredContacts() {
    if (!searchInput.value.trim()) {
      filteredContacts.value = contacts.value;
      return;
    }
    
    const searchTerms = searchInput.value.toLowerCase().split(' ');
    filteredContacts.value = contacts.value.filter(contact => {
      const searchableText = `${contact.name} ${contact.email} ${contact.phone} ${contact.type}`.toLowerCase();
      return searchTerms.every(term => searchableText.includes(term));
    });
  }

  function selectContact(contact: Contact | null) {
    selectedContact.value = contact;
  }

  return {
    contacts,
    filteredContacts,
    selectedContact,
    isLoading,
    searchInput,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    searchContacts,
    selectContact
  };
}