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

// node process 获取当前设备平台
export function getPlatform() {
  if (process.platform === 'win32') {
    return 'win';
  } else if (process.platform === 'darwin') {
    return 'mac';
  } else {
    return 'unix';
  }
}

export function splitOnce(str: string, separator: string) {
  const index = str.indexOf(separator);
  if (index === -1) {
    return [str, ''];
  } else {
    return [str.slice(0, index), str.slice(index + separator.length)];
  }
}
