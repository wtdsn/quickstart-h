export function isEmpty(
  data: string | number | unknown[] | object | null | undefined,
) {
  if (data === null || data === undefined) {
    return true;
  }
  if (typeof data === 'string') {
    if (data.trim() === '') return true;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return true;
  }

  if (typeof data === 'object') {
    if (Object.keys(data).length === 0) return true;
  }
  return false;
}
