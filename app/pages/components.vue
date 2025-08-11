<template>
  <div class="space-y-10">
    <!-- Badges -->
    <section class="flex flex-row gap-3 justify-start items-center">
      <h2 class="text-xl font-semibold mb-2">Badges</h2>
      <UiBadge text="Personal" />
      <UiBadge text="Professional" color="blue" size="lg" />
    </section>

    <!-- Buttons -->
    <section class="flex flex-row gap-3 justify-start items-center">
      <h2 class="text-xl font-semibold mb-2">Buttons</h2>
      <UiButton>Default Green Button</UiButton>
      <UiButton color="blue" size="sm" classes="ml-2"
        >Small Blue Button</UiButton
      >
      <UiButton color="red" size="lg" disabled classes="ml-2"
        >Large Red Disabled Button</UiButton
      >
    </section>

    <!-- Links -->
    <section class="flex flex-row gap-3 justify-start items-center">
      <h2 class="text-xl font-semibold mb-2">Links</h2>
      <UiLink to="/login" classes="mr-4">Internal Link to Login</UiLink>
      <UiLink to="https://example.com" external classes="mr-4"
        >External Link</UiLink
      >
      <UiLink to="/register" button color="green" size="md"
        >Button-Style Link</UiLink
      >
    </section>

    <!-- Simple & custom body modals -->
    <section class="space-x-4">
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

      <UiModal id="info-modal" @confirm="(done) => done()" @cancel="() => {}" />
      <UiModal id="custom-body-modal" @confirm="saveStuff" @cancel="() => {}">
        <div class="space-y-3">
          <p>
            You can put any HTML here. The title above and footer below remain.
          </p>
          <input
            v-model="note"
            class="w-full rounded border px-3 py-2"
            placeholder="Extra element…"
          >
        </div>
      </UiModal>
    </section>

    <!-- Modal delete test -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">Modal delete test</h2>
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
    </section>

    <!-- Radio group -->
    <section>
      <fieldset class="space-x-2">
        <legend class="font-medium mb-1">Role</legend>
        <UiRadio v-model="role" name="role" value="admin" label="Admin" />
        <UiRadio v-model="role" name="role" value="user" label="User" />
        <UiRadio v-model="role" name="role" value="guest" label="Guest" />
      </fieldset>
      <p class="mt-3 text-sm text-gray-600">Selected: {{ role }}</p>
    </section>

    <!-- Spinner in button -->
    <section>
      <h2 class="text-xl font-semibold mb-2">Spinner in Button</h2>
      <UiButton :disabled="saving" @click="simulateSave">
        <div class="flex gap-2 items-center justify-center">
          <UiSpinner v-if="saving" size="xs" />
          <span>{{ saving ? "Saving…" : "Save" }}</span>
        </div>
      </UiButton>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useModal, type ModalState } from "~/composables/useModal";

type Contact = { id: number; name: string };

const contacts = ref<Contact[]>([
  { id: 1, name: "Ada Lovelace" },
  { id: 2, name: "Chinedu Otutu" },
  { id: 3, name: "Grace Hopper" },
]);

const { open, modalState } = useModal();
const delModal = modalState("delete-modal");

function askDelete(id: number, name: string) {
  open("delete-modal", {
    title: "Delete contact?",
    message: `This will permanently remove ${name}.`,
    itemId: id,
  });
}

async function confirmDelete(done: () => void) {
  const s = delModal.value as ModalState & { itemId?: unknown };
  const id = typeof s.itemId === "number" ? s.itemId : undefined;
  if (id === undefined) return;
  await new Promise((r) => setTimeout(r, 800));
  contacts.value = contacts.value.filter((c) => c.id !== id);
  done();
}
function cancelDelete() {
  // optional: toast/log
}

const note = ref("");
const role = ref<"admin" | "user" | "guest">("user");
const saving = ref(false);

async function saveStuff(done: () => void) {
  await new Promise((r) => setTimeout(r, 800));
  // use note.value if needed
  done();
}

async function simulateSave() {
  if (saving.value) return;
  saving.value = true;
  await new Promise((r) => setTimeout(r, 1200));
  saving.value = false;
}
</script>
