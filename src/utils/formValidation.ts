/**
 * Comprehensive form validation utilities matching JSP project validation rules
 * Based on backend validation constraints from UserRegistrationRequest.java
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any, formData?: any) => string | undefined;
  message?: string;
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule[];
}

export interface ValidationErrors {
  [fieldName: string]: string;
}

// Pre-defined validation patterns matching backend
export const VALIDATION_PATTERNS = {
  // Name: only letters and spaces
  NAME: /^[A-Za-z\s]+$/,

  // Email: standard email format
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Password: at least 8 chars, uppercase, lowercase, number, special character (@#$%)
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%]).{8,}$/,

  // Phone: 8-15 digits only
  PHONE: /^[0-9]{8,15}$/,

  // City: only letters and spaces
  CITY: /^[A-Za-z\s]+$/,

  // Post code: 4-10 digits only
  POST_CODE: /^[0-9]{4,10}$/,

  // Civil ID: alphanumeric, 8-20 characters
  CIVIL_ID: /^[A-Za-z0-9]{8,20}$/,

  // Captcha: 6 alphanumeric characters
  CAPTCHA: /^[A-Za-z0-9]{6}$/
} as const;

// Standard validation rules for user registration form
export const USER_REGISTRATION_RULES: ValidationRules = {
  name: [
    { required: true, message: 'Name is required' },
    { minLength: 2, message: 'Name must be at least 2 characters' },
    { maxLength: 100, message: 'Name cannot exceed 100 characters' },
    { pattern: VALIDATION_PATTERNS.NAME, message: 'Name can only contain letters and spaces' }
  ],

  email: [
    { required: true, message: 'Email is required' },
    { pattern: VALIDATION_PATTERNS.EMAIL, message: 'Invalid email format' }
  ],

  password: [
    { required: true, message: 'Password is required' },
    { minLength: 8, message: 'Password must be at least 8 characters' },
    { pattern: VALIDATION_PATTERNS.PASSWORD, message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@#$%)' }
  ],

  confirmPassword: [
    { required: true, message: 'Confirm password is required' },
    { customValidator: (value: string, formData: any) =>
        value !== formData?.password ? 'Passwords do not match' : undefined
    }
  ],

  phoneNumber: [
    { required: true, message: 'Phone number is required' },
    { pattern: VALIDATION_PATTERNS.PHONE, message: 'Phone number must be between 8 and 15 digits' }
  ],

  userType: [
    { required: true, message: 'User type is required' },
    { customValidator: (value: string) =>
        !['Individual', 'Business'].includes(value) ? 'User type must be Individual or Business' : undefined
    }
  ],

  address1: [
    { required: true, message: 'Address line 1 is required' },
    { maxLength: 200, message: 'Address line 1 cannot exceed 200 characters' }
  ],

  address2: [
    { maxLength: 200, message: 'Address line 2 cannot exceed 200 characters' }
  ],

  city: [
    { required: true, message: 'City is required' },
    { maxLength: 50, message: 'City cannot exceed 50 characters' },
    { pattern: VALIDATION_PATTERNS.CITY, message: 'City can only contain letters and spaces' }
  ],

  postCode: [
    { required: true, message: 'Post code is required' },
    { pattern: VALIDATION_PATTERNS.POST_CODE, message: 'Post code must be between 4 and 10 digits' }
  ],

  civilId: [
    { required: true, message: 'Civil ID is required' },
    { minLength: 8, message: 'Civil ID must be at least 8 characters' },
    { maxLength: 20, message: 'Civil ID cannot exceed 20 characters' }
  ],

  civilIdCopy: [
    { required: true, message: 'Civil ID copy is required' }
  ],

  paymentMethod: [
    { required: true, message: 'Payment method is required' },
    { customValidator: (value: string) =>
        !['Credit Card', 'Debit Card'].includes(value) ? 'Payment method must be Credit Card or Debit Card' : undefined
    }
  ],

  captcha: [
    { required: true, message: 'Captcha is required' },
    { pattern: VALIDATION_PATTERNS.CAPTCHA, message: 'Invalid captcha format' }
  ],

  agreeTerms: [
    { required: true, message: 'You must agree to the Terms and Conditions' }
  ]
};

/**
 * Validates a single field against its validation rules
 */
export function validateField(
  fieldName: string,
  value: any,
  rules: ValidationRule[],
  formData?: any
): string | undefined {
  for (const rule of rules) {
    // Required validation
    if (rule.required) {
      if (value === null || value === undefined || value === '' ||
          (typeof value === 'boolean' && !value) ||
          (value instanceof File && !value)) {
        return rule.message || `${fieldName} is required`;
      }
    }

    // Skip other validations if value is empty and not required
    if (!rule.required && (!value || value === '')) {
      continue;
    }

    // Min length validation
    if (rule.minLength && value.toString().length < rule.minLength) {
      return rule.message || `${fieldName} must be at least ${rule.minLength} characters`;
    }

    // Max length validation
    if (rule.maxLength && value.toString().length > rule.maxLength) {
      return rule.message || `${fieldName} cannot exceed ${rule.maxLength} characters`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value.toString())) {
      return rule.message || `${fieldName} format is invalid`;
    }

    // Custom validation
    if (rule.customValidator) {
      const customError = rule.customValidator(value, formData);
      if (customError) {
        return customError;
      }
    }
  }

  return undefined;
}

/**
 * Validates all fields in form data against their rules
 */
export function validateForm(formData: any, validationRules: ValidationRules): ValidationErrors {
  const errors: ValidationErrors = {};

  Object.keys(validationRules).forEach(fieldName => {
    const rules = validationRules[fieldName];
    const value = formData[fieldName];
    const error = validateField(fieldName, value, rules, formData);

    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
}

/**
 * Validates captcha against generated captcha
 */
export function validateCaptcha(userCaptcha: string, generatedCaptcha: string): string | undefined {
  if (!userCaptcha || userCaptcha.trim() === '') {
    return 'Captcha is required';
  }

  if (userCaptcha !== generatedCaptcha) {
    return 'Captcha does not match';
  }

  return undefined;
}

/**
 * File validation utilities
 */
export const FileValidation = {
  ALLOWED_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],

  MAX_SIZE_MB: 10,

  validateType: (file: File): boolean => {
    return FileValidation.ALLOWED_TYPES.includes(file.type);
  },

  validateSize: (file: File, maxSizeMB: number = FileValidation.MAX_SIZE_MB): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },

  getFileExtension: (fileName: string): string => {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }
};

/**
 * Input sanitization utilities
 */
export const InputSanitizers = {
  // Remove all non-numeric characters
  numericOnly: (value: string): string => {
    return value.replace(/\D/g, '');
  },

  // Remove all characters except letters and spaces
  lettersSpacesOnly: (value: string): string => {
    return value.replace(/[^A-Za-z\s]/g, '');
  },

  // Remove extra spaces and trim
  normalizeSpaces: (value: string): string => {
    return value.replace(/\s+/g, ' ').trim();
  },

  // Convert to title case
  toTitleCase: (value: string): string => {
    return value.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
};

export default {
  VALIDATION_PATTERNS,
  USER_REGISTRATION_RULES,
  validateField,
  validateForm,
  validateCaptcha,
  FileValidation,
  InputSanitizers
};