const apiBase = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

export function apiUrl(path) {
  if (typeof path !== 'string' || !path.startsWith('/api/')) return path;
  return `${apiBase}${path}`;
}
