const priceFormatter = new Intl.NumberFormat("ru-RU");

const typeLabels = {
  all: "Все модели",
  mountain: "Горные",
  road: "Шоссейные",
  city: "Городские",
  bmx: "BMX",
  electric: "Электро"
};

export function formatPrice(value) {
  return `${priceFormatter.format(value)} $`;
}

export function getQueryParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search).entries());
}

export function debounce(fn, delay = 200) {
  let timeoutId = 0;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}

export function isValidArray(value) {
  return Array.isArray(value);
}

export function getTypeLabel(type) {
  return typeLabels[type] || "Другое";
}

export function pluralizeModels(count) {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "моделей";
  }

  if (lastDigit === 1) {
    return "модель";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "модели";
  }

  return "моделей";
}

export function syncBodyLock() {
  const hasActiveLayer = Boolean(
    document.querySelector(".cart-drawer.is-active, .compare-modal.is-active")
  );

  document.body.classList.toggle("body-locked", hasActiveLayer);
}

export function showToast(message, tone = "info") {
  let region = document.getElementById("toast-region");

  if (!region) {
    region = document.createElement("div");
    region.id = "toast-region";
    region.className = "toast-region";
    document.body.append(region);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast--${tone}`;
  toast.textContent = message;
  region.append(toast);

  window.requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });

  window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => {
      toast.remove();
    }, 220);
  }, 2600);
}

export function setCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}
