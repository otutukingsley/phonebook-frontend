<template>
  <div>
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">Welcome to Phone Book</h1>
      <p class="text-lg mb-4">A simple app to manage your contacts securely.</p>
      <p class="text-md mb-4">
        Store personal and professional contacts with ease. Search, edit, and
        delete contacts in a user-friendly interface.
      </p>
      <Link
        v-if="!isLoggedIn"
        to="/login"
        classes="bg-blue-600 text-white p-2 rounded inline-block"
        >Get Started</Link
      >
      <Link
        v-if="isLoggedIn"
        to="/contacts"
        classes="bg-blue-600 text-white p-2 rounded inline-block"
        >View Contacts</Link
      >
    </div>

    <div>
      <h2 class="text-xl font-semibold mb-2">Badges</h2>
      <UiBadge text="Personal" />
      <UiBadge text="Professional" color="blue" size="lg" />
    </div>
    <div>
      <h2 class="text-xl font-semibold mb-2">Buttons</h2>
      <UiButton>Default Green Button</UiButton>
      <UiButton color="blue" size="sm">Small Blue Button</UiButton>
      <UiButton color="red" size="lg" disabled
        >Large Red Disabled Button</UiButton
      >
    </div>
    <div>
      <h2 class="text-xl font-semibold mb-2">Links</h2>
      <UiLink to="/login">Internal Link to Login</UiLink>
      <UiLink href="https://example.com" external>External Link</UiLink>
      <UiLink to="/register" button color="green" size="md"
        >Button-Style Link</UiLink
      >
    </div>

    <div class="p-6 space-y-4">
      <h1 class="text-2xl font-bold">Modal delete test</h1>

      <ul class="space-y-2">
        <li
          v-for="c in contacts"
          :key="c.id"
          class="flex items-center justify-between bg-white rounded p-3 shadow"
        >
          <span
            >{{ c.name }} <span class="text-gray-400">(#{{ c.id }})</span></span
          >
          <UiButton color="red" @click="askDelete(c.id, c.name)"
            >Delete</UiButton
          >
        </li>
      </ul>

      <UiModal
        id="delete-modal"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
      />
    </div>

    <div class="p-6 space-y-4">
      <UiButton
        color="blue"
        @click="
          open('info-modal', {
            title: 'Heads up',
            message: 'This is a simple note.',
          })
        "
      >
        Open simple message modal
      </UiButton>

      <UiButton
        color="green"
        @click="open('custom-body-modal', { title: 'Custom body' })"
      >
        Open custom body modal
      </UiButton>

      <!-- Simple message -->
      <UiModal
        id="info-modal"
        @confirm="
          (done) => {
            done();
          }
        "
        @cancel="() => {}"
      />

      <!-- Custom body via slot -->
      <UiModal id="custom-body-modal" @confirm="saveStuff" @cancel="() => {}">
        <div class="space-y-3">
          <p>
            You can put any HTML here. The title above and footer below remain.
          </p>
          <input
            v-model="note"
            class="w-full rounded border px-3 py-2"
            placeholder="Extra element…"
          />
        </div>
      </UiModal>
    </div>

    <fieldset class="space-y-2">
      <legend class="font-medium mb-1">Role</legend>
      <UiRadio  v-model="role" name="role" value="admin" label="Admin" />
      <UiRadio  v-model="role" name="role" value="user" label="User" />
      <UiRadio  v-model="role" name="role" value="guest" label="Guest" />
    </fieldset>

    <p class="mt-3 text-sm text-gray-600">Selected: {{ role }}</p>

    <UiButton>
        <UiSpinner size="xs" color="white" classes="mr-2" />
        Save
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth.js";
import { useModal, type ModalState } from "~/composables/useModal";

const { isLoggedIn } = useAuth();
type Contact = { id: number; name: string };

const contacts = ref<Contact[]>([
  { id: 1, name: "Ada Lovelace" },
  { id: 2, name: "Chinedu Otutu" },
  { id: 3, name: "Grace Hopper" },
]);

const { open, modalState } = useModal();
// Keep a handle to the delete modal's state (holds our extra itemId)
const delModal = modalState("delete-modal");

function askDelete(id: number, name: string) {
  open("delete-modal", {
    title: "Delete contact?",
    message: `This will permanently remove ${name}.`,
    itemId: id,
  });
}

const note = ref("");
const role = ref<"admin" | "user" | "guest">("user");

async function saveStuff(done: () => void) {
  await new Promise((r) => setTimeout(r, 800)); // simulate API
  // use `note.value` if needed
  done(); // close after success
}

async function confirmDelete(done: () => void) {
  const s = delModal.value as ModalState & { itemId?: unknown };
  const id = typeof s.itemId === "number" ? s.itemId : undefined;
  if (id === undefined) return;

  try {
    await new Promise((r) => setTimeout(r, 3000));
    contacts.value = contacts.value.filter((c) => c.id !== id);
    done();
  } catch (e) {
    console.error(e);
  }
}

function cancelDelete() {
  console.log("User cancelled delete");
}
</script>
