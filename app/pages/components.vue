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
      <UiLink to="/login" classes="mr-4" underline="hover">Internal Link to Login</UiLink>
      <UiLink to="https://example.com" external new-tab underline classes="mr-4"
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

    <!-- Form example -->
    <section class="max-w-md">
      <h2 class="text-xl font-semibold mb-4">Form Example</h2>
      <form class="space-y-4" @submit="onFormSubmit">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            v-model="form.values.name"
            type="text"
            class="w-full rounded border px-3 py-2"
            :class="{ 'border-red-500': form.touched.name && form.errors.name }"
          >
          <p v-if="form.touched.name && form.errors.name" class="mt-1 text-sm text-red-600">
            {{ form.errors.name }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.values.email"
            type="email"
            class="w-full rounded border px-3 py-2"
            :class="{ 'border-red-500': form.touched.email && form.errors.email }"
          >
          <p v-if="form.touched.email && form.errors.email" class="mt-1 text-sm text-red-600">
            {{ form.errors.email }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="form.values.password"
            type="password"
            class="w-full rounded border px-3 py-2"
            :class="{ 'border-red-500': form.touched.password && form.errors.password }"
          >
          <p v-if="form.touched.password && form.errors.password" class="mt-1 text-sm text-red-600">
            {{ form.errors.password }}
          </p>
        </div>

        <UiButton type="submit" :disabled="form.submitting">
          <div class="flex gap-2 items-center justify-center">
            <UiSpinner v-if="form.submitting" size="xs" />
            <span>{{ form.submitting ? "Submitting..." : "Submit" }}</span>
          </div>
        </UiButton>
      </form>
    </section>

    <!-- New Form Components Test -->
    <section class="bg-white p-6 rounded-lg shadow-sm mb-8">
      <h2 class="text-xl font-semibold mb-4">New Form Components Test</h2>
      <form class="space-y-4" @submit.prevent="handleFormSubmit">
        <UiInput
          v-model="values.name"
          name="name"
          label="Name"
          :rules="[{ type: 'required' }]"
          live
        />

        <UiInput
          v-model="values.email"
          name="email"
          type="email"
          label="Email"
          :rules="[
            { type: 'required' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]"
          live
        />

        <UiInput
          v-model="values.password"
          name="password"
          type="password"
          label="Password"
          :rules="[
            { type: 'required' },
            { type: 'password', level: 'strong' }
          ]"
          live
        />

        <div class="space-y-2">
          <UiCheckbox
            v-model="values.terms"
            name="terms"
            label="I agree to the Terms and Conditions"
          />
          <UiCheckbox
            v-model="values.newsletter"
            name="newsletter"
            label="Subscribe to newsletter"
          />
        </div>

        <UiButton type="submit" :disabled="submitting">
          Submit Form
        </UiButton>

        <pre v-if="formResult" class="mt-4 p-4 bg-gray-100 rounded">{{ formResult }}</pre>
      </form>
    </section>

    <section>
      <h2 class="text-xl font-semibold mb-2">Custom Section</h2>
      <p>This is a custom section added for demonstration purposes.</p>

     <UiLink to="/components" variant="nav" classes="mr-4">Components</UiLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useModal, type ModalState } from "~/composables/useModal";
import { useForm } from "~/composables/useForm";

definePageMeta({
  middleware: ['auth'],
})

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

interface FormData extends Record<string, unknown> {
  name: string;
  email: string;
  password: string;
}

// First form for legacy code
const form = useForm<FormData>(
  {
    name: '',
    email: '',
    password: ''
  },
  {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' }
    ],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Please enter a valid email address' }
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      { type: 'password', level: 'strong' }
    ]
  }
);

// New form using our updated components
const initial = {
  name: '',
  email: '',
  password: '',
  terms: false,
  newsletter: false
}

const { values, submitting, onSubmit } = useForm(initial)
const formResult = ref('')

const handleFormSubmit = onSubmit(async (vals) => {
  formResult.value = JSON.stringify(vals, null, 2)
  await new Promise(r => setTimeout(r, 1000)) // Simulate API call
});

const onFormSubmit = form.onSubmit(async (values) => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
  console.log('Form submitted:', values);
});

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
