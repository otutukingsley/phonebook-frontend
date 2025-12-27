export const SECURITY_QUESTIONS: Record<string, string> = {
  '1': "What is your pet's name?",
  '2': 'What city were you born in?',
  '3': "What is your mother's maiden name?",
  '4': 'What was the name of your first school?',
  '5': 'What is your favorite movie?'
}

export const SECURITY_QUESTION_OPTIONS = Object.entries(SECURITY_QUESTIONS).map(
  ([value, label]) => ({ value, label })
)

export function getSecurityQuestionLabel(id: string): string {
  return SECURITY_QUESTIONS[id] || 'Unknown question'
}
