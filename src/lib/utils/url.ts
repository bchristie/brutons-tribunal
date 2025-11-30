/**
 * Get the base URL for the application
 * Uses NEXT_PUBLIC_URL environment variable or falls back to localhost
 */
export function getBaseUrl(): string {
  // Browser should use relative path
  if (typeof window !== 'undefined') {
    return '';
  }

  // Use NEXT_PUBLIC_URL if set
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  }

  // Fallback for development
  return 'http://localhost:3000';
}

/**
 * Build a fully-qualified URL for the application
 * @param path - The path to append (should start with /)
 * @returns Fully-qualified URL
 * 
 * @example
 * buildUrl('/admin/users') // 'https://yourdomain.com/admin/users'
 * buildUrl('/auth/verify?token=abc') // 'https://yourdomain.com/auth/verify?token=abc'
 */
export function buildUrl(path: string): string {
  const baseUrl = getBaseUrl();
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Build a URL with query parameters
 * @param path - The base path
 * @param params - Query parameters object
 * @returns Fully-qualified URL with query string
 * 
 * @example
 * buildUrlWithParams('/admin/users', { page: 2, search: 'john' })
 * // 'https://yourdomain.com/admin/users?page=2&search=john'
 */
export function buildUrlWithParams(
  path: string,
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  
  const separator = path.includes('?') ? '&' : '?';
  const queryString = filteredParams ? `${separator}${filteredParams}` : '';
  
  return buildUrl(`${path}${queryString}`);
}
