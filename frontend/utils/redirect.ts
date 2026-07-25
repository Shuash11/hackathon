/** Allows only safe, root-relative application paths. */
export function safeInternalRedirect(value: unknown): string | null {
  if (
    typeof value !== 'string'
    || !value.startsWith('/')
    || value.startsWith('//')
    || value.includes('\\')
    || /[\u0000-\u001F\u007F]/.test(value)
  ) return null
  return value
}
