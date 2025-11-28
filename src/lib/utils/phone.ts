/**
 * Normalize US phone number to E.164 format (+1XXXXXXXXXX)
 * Accepts various formats:
 * - (555) 555-1212
 * - 555-555-1212
 * - 555.555.1212
 * - 5555551212
 * - +15555551212
 */
export function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it starts with 1 and has 11 digits, it's already correct
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  // If it has 10 digits, add +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  
  // Return as-is if it doesn't match expected formats
  return phone;
}

/**
 * Validate US phone number format
 * Returns true if the phone number is valid
 */
export function isValidUSPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?1?\s*\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
  return phoneRegex.test(phone);
}

/**
 * Format phone number for display
 * Converts +15555551212 to (555) 555-1212
 */
export function formatPhoneNumber(phone: string | null): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Extract the 10-digit number (remove country code if present)
  const number = digits.length === 11 && digits.startsWith('1') 
    ? digits.slice(1) 
    : digits;
  
  if (number.length !== 10) return phone;
  
  return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
}
