<template>
  <form class="bg-white p-6 rounded shadow-md w-full max-w-md" @submit.prevent="handleSubmit">
    <h2 class="text-2xl font-bold mb-4 text-zinc-950">{{ mode === 'register' ? 'Create account' : 'Sign in' }}</h2>

    <div v-if="mode === 'register'" class="mb-4">
      <UiInput
        v-model="values.name"
        name="name"
        label="Name"
        :error="errors.name"
      />
    </div>

    <div class="mb-4">
      <UiInput
        v-model="values.email"
        name="email"
        type="email"
        label="Email"
        :error="errors.email"
      />
    </div>

    <div class="mb-4">
      <UiInput
        v-model="values.password"
        name="password"
        type="password"
        label="Password"
        :error="errors.password"
      />
    </div>

    <div v-if="mode === 'login'" class="mb-4">
      <UiCheckbox
        v-model="values.remember"
        name="remember"
        label="Remember me"
      />
    </div>

    <UiButton type="submit" :disabled="isSubmitting || submitting" class="w-full">
      <div class="flex items-center justify-center gap-2">
        <UiSpinner v-if="isSubmitting || submitting" size="xs" />
        {{ mode === 'register' 
          ? (isSubmitting ? 'Creating account...' : 'Create account')
          : (isSubmitting ? 'Signing in...' : 'Sign in')
        }}
      </div>
    </UiButton>

    <p v-if="submitError" class="text-red-500 mt-3 text-center">{{ submitError }}</p>

    <p class="text-sm text-gray-600 mt-4 text-center">
      <template v-if="mode === 'login'">
        Don't have an account?
        <UiLink to="/register">Register</UiLink>
      </template>
      <template v-else>
        Already have an account?
        <UiLink to="/login">Login</UiLink>
      </template>
    </p>
  </form>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/Button.vue'
import UiSpinner from '~/components/ui/Spinner.vue'
import UiInput from '~/components/ui/Input.vue'
import UiCheckbox from '~/components/ui/Checkbox.vue'
import UiLink from '~/components/ui/Link.vue'
import { useForm } from '~/composables/useForm'

export interface BaseFormValues {
  email: string
  password: string
}

export interface LoginFormValues extends BaseFormValues {
  remember?: boolean
}

export interface RegisterFormValues extends BaseFormValues {
  name: string
}

const props = withDefaults(defineProps<{
  mode?: 'login' | 'register'
  isSubmitting?: boolean
  submitError?: string
}>(), {
  mode: 'login',
  isSubmitting: false,
  submitError: ''
})

const initialValues = {
  name: '',
  email: '',
  password: '',
  remember: false
} as const

// Validation rules that change based on form mode
const rules = computed(() => ({
  name: props.mode === 'register' ? [
    { type: 'required' as const, message: 'Name is required' },
    { 
      type: 'custom' as const,
      validate: (value: unknown) => {
        if (typeof value !== 'string') return false
        return /^[a-zA-Z\s]{2,}$/.test(value)
      },
      message: 'Name must be at least 2 characters and contain only letters'
    }
  ] : [],
  email: [
    { type: 'required' as const, message: 'Email is required' },
    { type: 'email' as const, message: 'Please enter a valid email' }
  ],
  password: props.mode === 'register' ? [
    { type: 'required' as const, message: 'Password is required' },
    { 
      type: 'custom' as const,
      validate: (value: unknown) => {
        if (typeof value !== 'string') return false
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
      },
      message: 'Password must be at least 8 characters and include uppercase, lowercase, number and special character'
    }
  ] : [
    { type: 'required' as const, message: 'Password is required' }
  ]
}))

const emit = defineEmits<{
  (e: 'submit', values: LoginFormValues | RegisterFormValues): void
}>()

const { values, errors, submitting, onSubmit, reset } = useForm(initialValues, rules.value)

// Reset form when mode changes
watch(() => props.mode, () => {
  reset()
})

const handleSubmit = onSubmit(async (vals) => {
  try {
    const basePayload = {
      email: String(vals.email || ''),
      password: String(vals.password || '')
    }

    if (props.mode === 'register') {
      const payload: RegisterFormValues = {
        ...basePayload,
        name: String(vals.name || '')
      }
      emit('submit', payload)
    } else {
      const payload: LoginFormValues = {
        ...basePayload,
        remember: Boolean(vals.remember)
      }
      emit('submit', payload)
    }
  } catch (err) {
    console.error('Form validation error:', err)
  }
})
</script>