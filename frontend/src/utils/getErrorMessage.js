/**
 * Normalizes API errors (Express + axios) for user-facing messages.
 */
export function getErrorMessage(error, fallback = 'Something went wrong') {
  const data = error?.response?.data;
  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message.trim();
  }
  if (error?.code === 'ECONNABORTED') {
    return 'The request took too long. Please try again.';
  }
  if (error?.message === 'Network Error') {
    return 'Unable to reach the server. Check your connection and API URL.';
  }
  return fallback;
}
