interface Contact {
  id: string;
  userEmail: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  type: "personal" | "professional";
  createdAt: string;
  updatedAt?: string;
}

type CreateContactPayload = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  type?: "personal" | "professional";
};

export function useContacts() {
  const { get, post, put, delete: del } = useApi();
  const contacts = useState<Contact[]>("contacts", () => []);
  const filteredContacts = useState<Contact[]>("filtered-contacts", () => []);
  const selectedContact = useState<Contact | null>(
    "selected-contact",
    () => null
  );
  const isLoading = useState<boolean>("contacts:loading", () => false);

  async function fetchContacts(): Promise<Contact[]> {
    isLoading.value = true;
    try {
      const data = await get<Contact[]>("/api/contacts");
      contacts.value = data;
      filteredContacts.value = data;
      selectedContact.value = null;
      return data;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function createContact(
    contact: CreateContactPayload
  ): Promise<Contact> {
    isLoading.value = true;
    try {
      const newContact = await post<Contact>("/api/contacts", contact);
      contacts.value = [...contacts.value, newContact];
      filteredContacts.value = [...filteredContacts.value, newContact];
      selectedContact.value = null;
      return newContact;
    } catch (error) {
      console.error("Error creating contact:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateContact(
    id: string,
    updates: Partial<CreateContactPayload>
  ): Promise<Contact | null> {
    if (!selectedContact.value) {
      console.warn("No contact selected for update");
      return null;
    }
    isLoading.value = true;
    try {
      const cleanUpdates: Partial<CreateContactPayload> = {};
      if (
        updates.name !== undefined &&
        updates.name !== selectedContact.value.name
      ) {
        cleanUpdates.name = updates.name;
      }
      if (
        updates.email !== undefined &&
        updates.email !== selectedContact.value.email
      ) {
        cleanUpdates.email = updates.email;
      }
      if (
        updates.phone !== undefined &&
        updates.phone !== selectedContact.value.phone
      ) {
        cleanUpdates.phone = updates.phone;
      }
      if (
        updates.address !== undefined &&
        updates.address !== selectedContact.value.address
      ) {
        cleanUpdates.address = updates.address;
      }
      if (
        updates.notes !== undefined &&
        updates.notes !== selectedContact.value.notes
      ) {
        cleanUpdates.notes = updates.notes;
      }
      if (
        updates.type !== undefined &&
        updates.type !== selectedContact.value.type
      ) {
        cleanUpdates.type = updates.type;
      }

      if (Object.keys(cleanUpdates).length === 0) {
        return selectedContact.value;
      }

      const updatedContact = await put<Contact>(
        `/api/contacts/${id}`,
        cleanUpdates
      );
      contacts.value = contacts.value.map((c) =>
        c.id === id ? updatedContact : c
      );
      filteredContacts.value = filteredContacts.value.map((c) =>
        c.id === id ? updatedContact : c
      );
      selectedContact.value = null;
      return updatedContact;
    } catch (error) {
      console.error("Error updating contact:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteContact(id: string): Promise<void> {
    isLoading.value = true;
    try {
      await del(`/api/contacts/${id}`);
      contacts.value = contacts.value.filter((c) => c.id !== id);
      filteredContacts.value = filteredContacts.value.filter(
        (c) => c.id !== id
      );
      if (selectedContact.value?.id === id) {
        selectedContact.value = null;
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  function searchContacts(query: string): Contact[] {
    if (!query.trim()) {
      filteredContacts.value = contacts.value;
      return contacts.value;
    }

    const searchTerm = query.toLowerCase();
    filteredContacts.value = contacts.value.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm) ||
        contact.phone.toLowerCase().includes(searchTerm) ||
        (contact.address &&
          contact.address.toLowerCase().includes(searchTerm)) ||
        (contact.notes && contact.notes.toLowerCase().includes(searchTerm)) ||
        contact.type.toLowerCase().includes(searchTerm)
    );
    return filteredContacts.value;
  }

  function selectContact(contact: Contact | null) {
    selectedContact.value = contact;
  }

  return {
    contacts,
    filteredContacts,
    selectedContact,
    isLoading,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    searchContacts,
    selectContact,
  };
}