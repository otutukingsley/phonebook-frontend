interface Contact {
  id: string;
  userEmail: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  type: "personal" | "other";
  createdAt: string;
  updatedAt?: string;
}

type CreateContactPayload = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  type?: "personal" | "other";
};

interface PaginationState {
  lastKey: string | null;
  hasMore: boolean;
  limit: number;
}

interface PaginatedResponse {
  data: Contact[];
  pagination: {
    limit: number;
    count: number;
    lastKey: string | null;
    hasMore: boolean;
  };
}

export function useContacts() {
  const { get, post, put, delete: del } = useApi();
  const contacts = useState<Contact[]>("contacts", () => []);
  const filteredContacts = useState<Contact[]>("filtered-contacts", () => []);
  const selectedContact = useState<Contact | null>(
    "selected-contact",
    () => null
  );
  const isLoading = useState<boolean>("contacts:loading", () => true);
  const currentSearch = useState<string>("contacts:search", () => "");
  const pagination = useState<PaginationState>("contacts:pagination", () => ({
    lastKey: null,
    hasMore: false,
    limit: 10,
  }));

  async function fetchContacts(search?: string): Promise<Contact[]> {
    isLoading.value = true;
    try {
      const params = new URLSearchParams();
      params.set("limit", String(pagination.value.limit));
      if (search) params.set("search", search);

      const response = await get<PaginatedResponse>(
        `/api/contacts?${params.toString()}`
      );

      contacts.value = response.data;
      filteredContacts.value = response.data;
      pagination.value.lastKey = response.pagination.lastKey;
      pagination.value.hasMore = response.pagination.hasMore;
      currentSearch.value = search || "";

      return response.data;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadMore(): Promise<Contact[]> {
    if (!pagination.value.hasMore || !pagination.value.lastKey) {
      return contacts.value;
    }

    isLoading.value = true;
    try {
      const params = new URLSearchParams();
      params.set("limit", String(pagination.value.limit));
      params.set("lastKey", pagination.value.lastKey);
      if (currentSearch.value) params.set("search", currentSearch.value);

      const response = await get<PaginatedResponse>(
        `/api/contacts?${params.toString()}`
      );

      contacts.value = [...contacts.value, ...response.data];
      filteredContacts.value = [...filteredContacts.value, ...response.data];
      pagination.value.lastKey = response.pagination.lastKey;
      pagination.value.hasMore = response.pagination.hasMore;

      return contacts.value;
    } catch (error) {
      console.error("Error loading more contacts:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function getContact(id: string): Promise<Contact> {
    const response = await get<Contact>(`/api/contacts/${id}`);
    return response;
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
    updates: CreateContactPayload
  ): Promise<Contact> {
    isLoading.value = true;
    try {
      const updatedContact = await put<Contact>(`/api/contacts/${id}`, updates);
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

  async function searchContacts(query: string): Promise<Contact[]> {
    pagination.value.lastKey = null;
    return await fetchContacts(query.trim() || undefined);
  }

  function selectContact(contact: Contact | null) {
    selectedContact.value = contact;
  }

  return {
    contacts,
    filteredContacts,
    selectedContact,
    isLoading,
    pagination,
    fetchContacts,
    loadMore,
    getContact,
    createContact,
    updateContact,
    deleteContact,
    searchContacts,
    selectContact,
  };
}