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
 * @param absolute - Force absolute URL even in browser (useful for QR codes, sharing)
 * @returns Fully-qualified URL
 * 
 * @example
 * buildUrl('/admin/users') // 'https://yourdomain.com/admin/users'
 * buildUrl('/auth/verify?token=abc') // 'https://yourdomain.com/auth/verify?token=abc'
 * buildUrl('/pwa', true) // 'http://brutons-tribunal.localtest.me:3000/pwa' (even in browser)
 */
export function buildUrl(path: string, absolute = false): string {
  let baseUrl = getBaseUrl();
  
  // If absolute is requested and we're in the browser, use NEXT_PUBLIC_URL
  if (absolute && typeof window !== 'undefined' && process.env.NEXT_PUBLIC_URL) {
    baseUrl = process.env.NEXT_PUBLIC_URL;
  }
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Build a URL with query parameters
 * @overload
 * @param path - The base path
 * @param absolute - Force absolute URL even in browser
 * @returns Fully-qualified URL
 */
export function buildUrlWithParams(path: string, absolute: boolean): string;

/**
 * Build a URL with query parameters
 * @overload
 * @param path - The base path
 * @param params - Query parameters object
 * @param absolute - Force absolute URL even in browser (useful for QR codes, sharing)
 * @returns Fully-qualified URL with query string
 */
export function buildUrlWithParams(
  path: string,
  params: Record<string, string | number | boolean | undefined | null>,
  absolute?: boolean
): string;

/**
 * Build a URL with query parameters
 * 
 * @example
 * // With query parameters
 * buildUrlWithParams('/admin/users', { page: 2, search: 'john' })
 * // 'https://yourdomain.com/admin/users?page=2&search=john'
 * 
 * // With query parameters and absolute flag
 * buildUrlWithParams('/pwa', { returnUrl: '/' }, true)
 * // 'http://brutons-tribunal.localtest.me:3000/pwa?returnUrl=%2F' (even in browser)
 * 
 * // Without query parameters, just absolute flag
 * buildUrlWithParams('/pwa', true)
 * // 'http://brutons-tribunal.localtest.me:3000/pwa' (params optional)
 */
export function buildUrlWithParams(
  path: string,
  params: Record<string, string | number | boolean | undefined | null> | boolean,
  absolute?: boolean
): string {
  // Handle overload: buildUrlWithParams(path, absolute)
  if (typeof params === 'boolean') {
    return buildUrl(path, params);
  }

  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  
  const separator = path.includes('?') ? '&' : '?';
  const queryString = filteredParams ? `${separator}${filteredParams}` : '';
  
  return buildUrl(`${path}${queryString}`, absolute ?? false);
}

