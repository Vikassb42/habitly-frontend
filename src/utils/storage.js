// Tiny localStorage wrapper used by the mock service layer.
// Swap these out for HTTP calls later — see src/services/api.js.

export const getItem = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage might be full / unavailable — fail silently in mock mode */
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    /* noop */
  }
};