export type PasswordStrength = 'easy' | 'medium' | 'hard';

interface PasswordConfig {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

const strengthConfigs: Record<PasswordStrength, PasswordConfig> = {
  easy: {
    length: 8,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
  },
  medium: {
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  },
  hard: {
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  },
};

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export function generatePassword(strength: PasswordStrength): string {
  const config = strengthConfigs[strength];
  let charset = '';
  let password = '';

  if (config.includeLowercase) charset += LOWERCASE;
  if (config.includeUppercase) charset += UPPERCASE;
  if (config.includeNumbers) charset += NUMBERS;
  if (config.includeSymbols) charset += SYMBOLS;

  // Ensure at least one character from each required set
  if (config.includeLowercase) {
    password += LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)];
  }
  if (config.includeUppercase) {
    password += UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)];
  }
  if (config.includeNumbers) {
    password += NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
  }
  if (config.includeSymbols) {
    password += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  }

  // Fill the rest randomly
  for (let i = password.length; i < config.length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

export function calculatePasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;

  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 20;
  if (password.length >= 16) score += 10;
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^a-zA-Z0-9]/.test(password)) score += 10;

  let label = 'Weak';
  let color = '#ef4444';

  if (score >= 70) {
    label = 'Strong';
    color = '#22c55e';
  } else if (score >= 50) {
    label = 'Medium';
    color = '#f59e0b';
  }

  return { score, label, color };
}


