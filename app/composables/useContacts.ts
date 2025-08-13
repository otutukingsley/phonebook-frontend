interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  userId: string;
}

type CreateContactPayload = Record<string, string | undefined> & {
  name: string;
  phone: string;
  email?: string;
}

export function useContacts() {
  const { get, post, put, delete: del } = useApi();
  const contacts = useState<Contact[]>('contacts', () => []);
  
  async function fetchContacts() {
    const data = await get<Contact[]>('/contacts');
    contacts.value = data;
    return data;
  }

  async function createContact(contact: CreateContactPayload) {
    const newContact = await post<Contact>('/contacts', contact);
    contacts.value = [...contacts.value, newContact];
    return newContact;
  }

  async function updateContact(id: string, contact: Partial<CreateContactPayload>) {
    const updatedContact = await put<Contact>(`/contacts/${id}`, contact);
    contacts.value = contacts.value.map(c => 
      c.id === id ? updatedContact : c
    );
    return updatedContact;
  }

  async function deleteContact(id: string) {
    await del(`/contacts/${id}`);
    contacts.value = contacts.value.filter(c => c.id !== id);
  }

  return {
    contacts,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact
  };
}
