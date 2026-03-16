import { STORAGE_KEYS, loadFromStorage, saveToStorage } from "./storage.js";
import { formatPrice, getTypeLabel, isValidArray, showToast, syncBodyLock } from "./utils.js";

const MAX_COMPARE_ITEMS = 3;

let compareList = normalizeCompareList(loadFromStorage(STORAGE_KEYS.compare, []));
let productsCache = [];
let isBound = false;

function normalizeCompareList(items) {
  if (!isValidArray(items)) {
    return [];
  }

  return items
    .map((item) => Number(item))
    .filter((item, index, source) => Number.isFinite(item) && source.indexOf(item) === index)
    .slice(0, MAX_COMPARE_ITEMS);
}

function getCompareModal() {
  return document.getElementById("compare-modal");
}

function saveCompareList(nextList) {
  compareList = normalizeCompareList(nextList);
  saveToStorage(STORAGE_KEYS.compare, compareList);
  updateCompareCounter();
  syncCompareButtons();
}

export function getCompareList() {
  return [...compareList];
}

export function addToCompare(productId) {
  const id = Number(productId);

  if (compareList.includes(id)) {
    return { ok: false, reason: "exists" };
  }

  if (compareList.length >= MAX_COMPARE_ITEMS) {
    return { ok: false, reason: "limit" };
  }

  saveCompareList([...compareList, id]);
  return { ok: true, reason: "added" };
}

export function removeFromCompare(productId) {
  const id = Number(productId);
  saveCompareList(compareList.filter((item) => item !== id));
}

export function clearCompare() {
  saveCompareList([]);
}

export function getCompareItems(products) {
  return compareList
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);
}

export function updateCompareCounter() {
  document.querySelectorAll("[data-compare-counter]").forEach((element) => {
    element.textContent = String(compareList.length);
  });
}

export function syncCompareButtons() {
  document.querySelectorAll('[data-action="add-to-compare"]').forEach((button) => {
    const id = Number(button.dataset.productId);
    const isActive = compareList.includes(id);

    button.classList.toggle("is-active", isActive);
    button.textContent = isActive ? "В сравнении" : "В сравнение";
  });
}

function buildCompareRow(label, items, content) {
  return `
    <tr class="compare-table__row">
      <th>${label}</th>
      ${items.map(content).join("")}
    </tr>
  `;
}

export function renderCompareModal(products) {
  const container = document.getElementById("compare-content");

  if (!container) {
    return;
  }

  const items = getCompareItems(products);

  if (!items.length) {
    container.innerHTML = `
      <div class="empty-state">
        <p class="empty-state__title">Добавьте модели в сравнение</p>
        <p class="empty-state__text">Выберите до трёх велосипедов, чтобы быстро сравнить ключевые характеристики.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="compare-table-wrapper">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Параметр</th>
            ${items
              .map(
                (item) => `
                  <th>
                    <div class="compare-table__product">
                      <span>${item.name}</span>
                      <button type="button" data-action="remove-compare-item" data-product-id="${item.id}">
                        Убрать
                      </button>
                    </div>
                  </th>
                `
              )
              .join("")}
          </tr>
        </thead>
        <tbody>
          ${buildCompareRow(
            "Фото",
            items,
            (item) => `<td><img class="compare-table__image" src="${item.image}" alt="${item.name}"></td>`
          )}
          ${buildCompareRow("Тип", items, (item) => `<td>${getTypeLabel(item.type)}</td>`)}
          ${buildCompareRow("Цена", items, (item) => `<td>${formatPrice(item.price)}</td>`)}
          ${buildCompareRow("Рама", items, (item) => `<td>${item.frame}</td>`)}
          ${buildCompareRow("Колёса", items, (item) => `<td>${item.wheelSize}"</td>`)}
          ${buildCompareRow("Тормоза", items, (item) => `<td>${item.brakes}</td>`)}
          ${buildCompareRow("Назначение", items, (item) => `<td>${item.purpose}</td>`)}
        </tbody>
      </table>
    </div>
    <div class="compare-modal__actions">
      <button class="btn btn--ghost btn--small" type="button" data-action="clear-compare">Очистить сравнение</button>
    </div>
  `;
}

export function openCompareModal() {
  const modal = getCompareModal();
  const cartDrawer = document.getElementById("cart-drawer");

  if (!modal) {
    return;
  }

  if (cartDrawer) {
    cartDrawer.classList.remove("is-active");
    cartDrawer.setAttribute("aria-hidden", "true");
  }

  modal.classList.add("is-active");
  modal.setAttribute("aria-hidden", "false");
  syncBodyLock();
}

export function closeCompareModal() {
  const modal = getCompareModal();

  if (!modal) {
    return;
  }

  modal.classList.remove("is-active");
  modal.setAttribute("aria-hidden", "true");
  syncBodyLock();
}

function handleClick(event) {
  const target = event.target;
  const compareToggleButton = target.closest('[data-action="add-to-compare"]');
  const openButton = target.closest("#compare-open-btn, [data-action=\"open-compare\"]");
  const closeButton = target.closest('[data-action="close-compare"]');
  const removeButton = target.closest('[data-action="remove-compare-item"]');
  const clearButton = target.closest('[data-action="clear-compare"]');

  if (compareToggleButton) {
    const productId = Number(compareToggleButton.dataset.productId);

    if (compareList.includes(productId)) {
      removeFromCompare(productId);
      renderCompareModal(productsCache);
      showToast("Модель убрана из сравнения", "info");
      return;
    }

    const result = addToCompare(productId);

    if (!result.ok && result.reason === "limit") {
      showToast("Можно сравнить максимум 3 велосипеда", "error");
      return;
    }

    renderCompareModal(productsCache);
    showToast("Модель добавлена в сравнение", "success");
    return;
  }

  if (openButton) {
    renderCompareModal(productsCache);
    openCompareModal();
    return;
  }

  if (closeButton) {
    closeCompareModal();
    return;
  }

  if (removeButton) {
    removeFromCompare(removeButton.dataset.productId);
    renderCompareModal(productsCache);
    return;
  }

  if (clearButton) {
    clearCompare();
    renderCompareModal(productsCache);
  }
}

function handleKeydown(event) {
  if (event.key === "Escape") {
    closeCompareModal();
  }
}

export function bindCompareEvents(products) {
  productsCache = products;
  renderCompareModal(productsCache);
  updateCompareCounter();
  syncCompareButtons();

  if (isBound) {
    return;
  }

  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", handleKeydown);
  isBound = true;
}
