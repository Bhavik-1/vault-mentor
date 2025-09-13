export interface PasswordGenerationOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export interface PasswordAnalysis {
  score: number;
  strength: 'weak' | 'medium' | 'strong';
  suggestions: string[];
}

export const generatePassword = (options: PasswordGenerationOptions): string => {
  const {
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols
  } = options;

  let charset = '';
  
  if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (includeNumbers) charset += '0123456789';
  if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (charset === '') {
    throw new Error('At least one character type must be selected');
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};

export const analyzePasswordStrength = (password: string): PasswordAnalysis => {
  let score = 0;
  const suggestions: string[] = [];

  // Length check
  if (password.length >= 12) {
    score += 2;
  } else if (password.length >= 8) {
    score += 1;
  } else {
    suggestions.push('Use at least 8 characters (12+ recommended)');
  }

  // Character variety checks
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);

  if (hasLowercase) score += 1;
  else suggestions.push('Include lowercase letters (a-z)');

  if (hasUppercase) score += 1;
  else suggestions.push('Include uppercase letters (A-Z)');

  if (hasNumbers) score += 1;
  else suggestions.push('Include numbers (0-9)');

  if (hasSymbols) score += 2;
  else suggestions.push('Include special characters (!@#$%^&*)');

  // Complexity checks
  const uniqueChars = new Set(password.split('')).size;
  if (uniqueChars >= password.length * 0.7) {
    score += 1;
  } else {
    suggestions.push('Avoid repeating characters');
  }

  // Common patterns check
  const commonPatterns = [
    /123/,
    /abc/i,
    /qwe/i,
    /password/i,
    /admin/i,
    /(.)\1{2,}/i // repeated characters
  ];

  let hasCommonPattern = false;
  commonPatterns.forEach(pattern => {
    if (pattern.test(password)) {
      hasCommonPattern = true;
    }
  });

  if (!hasCommonPattern) {
    score += 1;
  } else {
    suggestions.push('Avoid common patterns like "123", "abc", or repeated characters');
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong';
  if (score >= 8) {
    strength = 'strong';
  } else if (score >= 5) {
    strength = 'medium';
  } else {
    strength = 'weak';
  }

  return {
    score: Math.min(score, 10),
    strength,
    suggestions
  };
};