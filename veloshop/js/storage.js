export const STORAGE_KEYS = {
  cart: "veloshop-cart",
  compare: "veloshop-compare"
};

export function loadFromStorage(key, fallback = []) {
  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch (error) {
    return fallback;
  }
}

export function saveToStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    return;
  }
}

export function removeFromStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    return;
  }
}
