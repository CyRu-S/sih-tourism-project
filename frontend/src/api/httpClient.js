import { API_BASE_URL } from '../config/env';

const TIMEOUT_MS = 10000;

export async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.message || `Request failed (${response.status})`);
    return payload;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('The request timed out. Please try again.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
