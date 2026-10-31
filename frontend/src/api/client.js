/**
 * Centralized API client.
 * Base URL is read from VITE_API_BASE_URL env variable (falls back to /api for Vite proxy).
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(method, path, body) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(`${BASE_URL}${path}`, options);
  const data = await response.json();
  if (!response.ok) {
    const message =
      typeof data.detail === 'string'
        ? data.detail
        : Array.isArray(data.detail)
        ? data.detail.map((e) => e.msg).join('; ')
        : 'An unexpected error occurred.';
    throw new Error(message);
  }
  return data;
}

export const api = {
  health: () => request('GET', '/health'),
  stuff: (bits) => request('POST', '/stuff', { bits }),
  destuff: (bits) => request('POST', '/destuff', { bits }),
  examples: () => request('GET', '/examples'),
  quiz: () => request('GET', '/quiz'),
};
