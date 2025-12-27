<template>
  <div class="min-h-screen flex flex-col items-center justify-start pt-20">
    <div class="w-full max-w-md">
      <form class="bg-white p-6 rounded shadow-md w-full" @submit.prevent="handleSubmit">
        <h2 class="text-2xl font-bold mb-4 text-zinc-950">Reset Password</h2>

        <!-- Step 1: Enter email -->
        <template v-if="step === 1">
          <p class="text-gray-600 mb-4">Enter your email address to retrieve your security question.</p>

          <div class="mb-4">
            <UiInput
              v-model="email"
              name="email"
              type="email"
              label="Email"
              :error="errors.email"
            />
          </div>

          <UiButton type="submit" :disabled="isLoading" class="w-full">
            <div class="flex items-center justify-center gap-2">
              <UiSpinner v-if="isLoading" size="xs" />
              {{ isLoading ? 'Loading...' : 'Continue' }}
            </div>
          </UiButton>
        </template>

        <!-- Step 2: Answer question and set new password -->
        <template v-if="step === 2">
          <p class="text-gray-600 mb-4">Answer your security question and set a new password.</p>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Security Question</label>
            <p class="p-2 bg-gray-50 rounded border border-gray-200 text-gray-800">{{ getSecurityQuestionLabel(securityQuestionId) }}</p>
          </div>

          <div class="mb-4">
            <UiInput
              v-model="securityAnswer"
              name="securityAnswer"
              label="Your Answer"
              placeholder="Enter your answer"
              :error="errors.securityAnswer"
            />
          </div>

          <div class="mb-4">
            <UiInput
              v-model="newPassword"
              name="newPassword"
              type="password"
              label="New Password"
              :error="errors.newPassword"
            />
          </div>

          <div class="mb-4">
            <UiInput
              v-model="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm New Password"
              :error="errors.confirmPassword"
            />
          </div>

          <div class="flex gap-2">
            <UiButton type="button" color="gray" class="flex-1" @click="goBack">
              Back
            </UiButton>
            <UiButton type="submit" :disabled="isLoading" class="flex-1">
              <div class="flex items-center justify-center gap-2">
                <UiSpinner v-if="isLoading" size="xs" />
                {{ isLoading ? 'Resetting...' : 'Reset Password' }}
              </div>
            </UiButton>
          </div>
        </template>

        <!-- Success message -->
        <template v-if="step === 3">
          <div class="text-center">
            <div class="mb-4 text-green-600">
              <CheckCircleIcon class="h-16 w-16 mx-auto" />
            </div>
            <p class="text-gray-700 mb-4">Your password has been reset successfully!</p>
            <UiButton type="button" class="w-full" @click="navigateTo('/login')">
              Go to Login
            </UiButton>
          </div>
        </template>

        <p v-if="submitError" class="text-red-500 mt-3 text-center">{{ submitError }}</p>

        <p v-if="step < 3" class="text-sm text-gray-600 mt-4 text-center">
          Remember your password?
          <UiLink to="/login">Sign in</UiLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import UiButton from '~/components/ui/Button.vue'
import UiSpinner from '~/components/ui/Spinner.vue'
import UiInput from '~/components/ui/Input.vue'
import UiLink from '~/components/ui/Link.vue'
import { useAuth } from '~/composables/useAuth'
import { getSecurityQuestionLabel } from '~/constants/securityQuestions'

definePageMeta({
  middleware: ['guest'],
})

const { getSecurityQuestion, resetPassword } = useAuth()

const step = ref(1)
const email = ref('')
const securityQuestionId = ref('')
const securityAnswer = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const submitError = ref('')

const errors = reactive({
  email: '',
  securityAnswer: '',
  newPassword: '',
  confirmPassword: ''
})

function validateEmail(): boolean {
  errors.email = ''
  if (!email.value.trim()) {
    errors.email = 'Email is required'
    return false
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'Please enter a valid email'
    return false
  }
  return true
}

function validateStep2(): boolean {
  let valid = true
  errors.securityAnswer = ''
  errors.newPassword = ''
  errors.confirmPassword = ''

  if (!securityAnswer.value.trim()) {
    errors.securityAnswer = 'Security answer is required'
    valid = false
  }

  if (!newPassword.value) {
    errors.newPassword = 'New password is required'
    valid = false
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword.value)) {
    errors.newPassword = 'Password must be at least 8 characters and include uppercase, lowercase, number and special character'
    valid = false
  }

  if (!confirmPassword.value) {
    errors.confirmPassword = 'Please confirm your password'
    valid = false
  } else if (newPassword.value !== confirmPassword.value) {
    errors.confirmPassword = 'Passwords do not match'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  submitError.value = ''

  if (step.value === 1) {
    if (!validateEmail()) return

    isLoading.value = true
    try {
      const questionId = await getSecurityQuestion(email.value)
      securityQuestionId.value = questionId
      step.value = 2
    } catch (err) {
      if (err instanceof Error) {
        submitError.value = err.message
      } else {
        submitError.value = 'Failed to retrieve security question'
      }
    } finally {
      isLoading.value = false
    }
  } else if (step.value === 2) {
    if (!validateStep2()) return

    isLoading.value = true
    try {
      await resetPassword({
        email: email.value,
        securityAnswer: securityAnswer.value,
        newPassword: newPassword.value
      })
      step.value = 3
    } catch (err) {
      if (err instanceof Error) {
        submitError.value = err.message
      } else {
        submitError.value = 'Failed to reset password'
      }
    } finally {
      isLoading.value = false
    }
  }
}

function goBack() {
  step.value = 1
  securityAnswer.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  submitError.value = ''
}
</script>
