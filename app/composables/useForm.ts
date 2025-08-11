import { reactive } from 'vue'

export type ValidationRule =
  | { type: 'required'; message?: string }
  | { type: 'email'; message?: string }
  | { type: 'minLength'; value: number; message?: string }
  | { type: 'maxLength'; value: number; message?: string }
  | { type: 'password'; level?: 'weak' | 'medium' | 'strong'; message?: string }
  | { type: 'pattern'; value: RegExp; message?: string }
  | { type: 'custom'; validate: (value: unknown) => boolean | string; message?: string }

export type FormSchema<T> = {
  [K in keyof T]?: ValidationRule[]
}

interface FormState<T extends Record<string, unknown>> {
  values: T
  errors: Record<string, string | null>
  touched: Record<string, boolean>
  submitting: boolean
}

export function useForm<T extends Record<string, unknown>>(initial: T, schema: FormSchema<T> = {}) {
  // Create a shallow clone of initial values
  const initialValues = { ...initial }

  const state = reactive({
    values: initialValues,
    errors: Object.keys(initialValues).reduce<Record<string, string | null>>((acc, key) => {
      acc[key] = null
      return acc
    }, {}),
    touched: Object.keys(initialValues).reduce<Record<string, boolean>>((acc, key) => {
      acc[key] = false
      return acc
    }, {}),
    submitting: false
  }) as FormState<T>

  function setError(key: string, message: string | null) {
    state.errors[key] = message
  }

  function validateField(key: keyof T): boolean {
    const rules = schema[key] || []
    const value = state.values[key as string]

    for (const rule of rules) {
      let errorMessage: string | null = null

      switch (rule.type) {
        case 'required':
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            errorMessage = rule.message || 'This field is required'
          }
          break

        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
            errorMessage = rule.message || 'Invalid email address'
          }
          break

        case 'minLength':
          if (value && String(value).length < rule.value) {
            errorMessage = rule.message || `Must be at least ${rule.value} characters`
          }
          break

        case 'maxLength':
          if (value && String(value).length > rule.value) {
            errorMessage = rule.message || `Must be no more than ${rule.value} characters`
          }
          break

        case 'pattern':
          if (value && !rule.value.test(String(value))) {
            errorMessage = rule.message || 'Invalid format'
          }
          break

        case 'password': {
          if (value) {
            const input = String(value)
            const strongRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}/
            const mediumRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}/
            const level = rule.level || 'medium'
            
            if (level === 'strong' && !strongRegex.test(input)) {
              errorMessage = rule.message || 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
            } else if (level === 'medium' && !mediumRegex.test(input)) {
              errorMessage = rule.message || 'Password must be at least 6 characters and contain uppercase, lowercase, and number'
            }
          }
          break
        }

        case 'custom': {
          const result = rule.validate(value)
          if (typeof result === 'string') {
            errorMessage = result
          } else if (!result) {
            errorMessage = rule.message || 'Invalid value'
          }
          break
        }
      }

      if (errorMessage) {
        setError(String(key), errorMessage)
        return false
      }
    }
    
    setError(String(key), null)
    return true
  }

  function validateAll(): boolean {
    let isValid = true
    for (const key of Object.keys(state.values) as Array<keyof T>) {
      state.touched[key as string] = true
      if (!validateField(key)) {
        isValid = false
      }
    }
    return isValid
  }

  function onSubmit(handler: (values: T) => Promise<void> | void) {
    return async (e?: Event) => {
      if (e) {
        e.preventDefault()
      }
      if (!validateAll()) {
        return
      }
      state.submitting = true
      try {
        // Clone the values to ensure we pass a clean object
        const values = { ...state.values } as T
        await handler(values)
      } finally {
        state.submitting = false
      }
    }
  }

  function reset(newValues?: Partial<T>) {
    Object.assign(state.values, { ...initialValues, ...(newValues || {}) })
    for (const key of Object.keys(state.values)) {
      state.errors[key] = null
      state.touched[key] = false
    }
  }

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    submitting: state.submitting,
    validateField,
    validateAll,
    onSubmit,
    reset
  }
}
