// Validation utilities
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export const validateField = (value: string, rules: ValidationRule): string | null => {
  if (rules.required && !value.trim()) {
    return rules.message || 'This field is required';
  }

  if (rules.minLength && value.length < rules.minLength) {
    return `Minimum ${rules.minLength} characters required`;
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return `Maximum ${rules.maxLength} characters allowed`;
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.message || 'Invalid format';
  }

  return null;
};

export const validateForm = (data: Record<string, string>, rules: ValidationRules): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach(field => {
    const error = validateField(data[field] || '', rules[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  mobile: /^[6-9]\d{9}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  aadhaar: /^\d{12}$/,
  pinCode: /^\d{6}$/,
};

// Common validation rules
export const commonRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: 'Name must be 2-50 characters',
  },
  email: {
    required: true,
    pattern: patterns.email,
    message: 'Valid email required',
  },
  mobile: {
    required: true,
    pattern: patterns.mobile,
    message: 'Valid 10-digit mobile number required',
  },
  password: {
    required: true,
    minLength: 8,
    pattern: patterns.password,
    message: 'Password must be 8+ chars with uppercase, lowercase, number, and special char',
  },
  aadhaar: {
    required: true,
    pattern: patterns.aadhaar,
    message: 'Valid 12-digit Aadhaar number required',
  },
  pinCode: {
    required: true,
    pattern: patterns.pinCode,
    message: 'Valid 6-digit PIN code required',
  },
};
