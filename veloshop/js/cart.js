import { STORAGE_KEYS, loadFromStorage, saveToStorage } from "./storage.js";
import { formatPrice, isValidArray, showToast, syncBodyLock } from "./utils.js";

let cart = normalizeCart(loadFromStorage(STORAGE_KEYS.cart, []));
let productsCache = [];
let isBound = false;

function normalizeCart(items) {
  if (!isValidArray(items)) {
    return [];
  }

  return items
    .map((item) => ({
      id: Number(item.id),
      quantity: Number(item.quantity)
    }))
    .filter((item) => Number.isFinite(item.id) && item.quantity > 0);
}

function getCartDrawer() {
  return document.getElementById("cart-drawer");
}

function setCart(nextCart) {
  cart = normalizeCart(nextCart);
  saveToStorage(STORAGE_KEYS.cart, cart);
  updateCartCounter();
}

export function getCart() {
  return [...cart];
}

export function saveCart(nextCart) {
  setCart(nextCart);
}

export function addToCart(productId) {
  const id = Number(productId);
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }

  setCart(cart);
}

export function removeFromCart(productId) {
  const id = Number(productId);
  setCart(cart.filter((item) => item.id !== id));
}

export function increaseQuantity(productId) {
  const id = Number(productId);
  const existingItem = cart.find((item) => item.id === id);

  if (!existingItem) {
    return;
  }

  existingItem.quantity += 1;
  setCart(cart);
}

export function decreaseQuantity(productId) {
  const id = Number(productId);
  const existingItem = cart.find((item) => item.id === id);

  if (!existingItem) {
    return;
  }

  existingItem.quantity -= 1;

  if (existingItem.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  setCart(cart);
}

export function clearCart() {
  setCart([]);
}

export function getCartDetailedItems(products) {
  return cart
    .map((item) => {
      const product = products.find((candidate) => candidate.id === item.id);

      if (!product) {
        return null;
      }

      return {
        ...product,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    })
    .filter(Boolean);
}

export function getCartTotal(products) {
  return getCartDetailedItems(products).reduce((sum, item) => sum + item.subtotal, 0);
}

export function updateCartCounter() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.querySelectorAll("[data-cart-counter]").forEach((element) => {
    element.textContent = String(totalItems);
  });
}

export function renderCart(products) {
  const itemsContainer = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");
  const checkoutButton = document.querySelector('[data-action="checkout"]');

  if (!itemsContainer || !totalElement) {
    return;
  }

  const detailedItems = getCartDetailedItems(products);

  if (!detailedItems.length) {
    itemsContainer.innerHTML = `
      <div class="empty-state empty-state--compact">
        <p class="empty-state__title">Ваша корзина пока пуста</p>
        <p class="empty-state__text">Добавьте модель, чтобы быстро вернуться к ней перед покупкой.</p>
      </div>
    `;
    totalElement.textContent = formatPrice(0);

    if (checkoutButton) {
      checkoutButton.disabled = true;
    }

    return;
  }

  itemsContainer.innerHTML = detailedItems
    .map(
      (item) => `
        <article class="cart-item" data-product-id="${item.id}">
          <img class="cart-item__media" src="${item.image}" alt="${item.name}">
          <div class="cart-item__content">
            <div class="cart-item__top">
              <div>
                <h3 class="cart-item__title">${item.name}</h3>
                <p class="cart-item__meta">${item.brand} · ${item.wheelSize}"</p>
              </div>
              <button class="cart-item__remove" type="button" data-action="remove-cart-item" data-product-id="${item.id}">
                Удалить
              </button>
            </div>
            <div class="cart-item__bottom">
              <div class="cart-item__controls">
                <button type="button" aria-label="Уменьшить количество" data-action="decrease-cart-item" data-product-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button type="button" aria-label="Увеличить количество" data-action="increase-cart-item" data-product-id="${item.id}">+</button>
              </div>
              <div class="cart-item__prices">
                <strong>${formatPrice(item.subtotal)}</strong>
                <span>${formatPrice(item.price)} за штуку</span>
              </div>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  totalElement.textContent = formatPrice(getCartTotal(products));

  if (checkoutButton) {
    checkoutButton.disabled = false;
  }
}

export function openCart() {
  const drawer = getCartDrawer();
  const compareModal = document.getElementById("compare-modal");

  if (!drawer) {
    return;
  }

  if (compareModal) {
    compareModal.classList.remove("is-active");
    compareModal.setAttribute("aria-hidden", "true");
  }

  drawer.classList.add("is-active");
  drawer.setAttribute("aria-hidden", "false");
  syncBodyLock();
}

export function closeCart() {
  const drawer = getCartDrawer();

  if (!drawer) {
    return;
  }

  drawer.classList.remove("is-active");
  drawer.setAttribute("aria-hidden", "true");
  syncBodyLock();
}

function handleClick(event) {
  const target = event.target;
  const addButton = target.closest('[data-action="add-to-cart"]');
  const openButton = target.closest("#cart-open-btn, [data-action=\"open-cart\"]");
  const closeButton = target.closest('[data-action="close-cart"]');
  const increaseButton = target.closest('[data-action="increase-cart-item"]');
  const decreaseButton = target.closest('[data-action="decrease-cart-item"]');
  const removeButton = target.closest('[data-action="remove-cart-item"]');
  const checkoutButton = target.closest('[data-action="checkout"]');

  if (addButton) {
    addToCart(addButton.dataset.productId);
    renderCart(productsCache);
    showToast("Модель добавлена в корзину", "success");
    return;
  }

  if (openButton) {
    renderCart(productsCache);
    openCart();
    return;
  }

  if (closeButton) {
    closeCart();
    return;
  }

  if (increaseButton) {
    increaseQuantity(increaseButton.dataset.productId);
    renderCart(productsCache);
    return;
  }

  if (decreaseButton) {
    decreaseQuantity(decreaseButton.dataset.productId);
    renderCart(productsCache);
    return;
  }

  if (removeButton) {
    removeFromCart(removeButton.dataset.productId);
    renderCart(productsCache);
    return;
  }

  if (checkoutButton) {
    showToast("Оформление появится на следующем этапе проекта", "info");
  }
}

function handleKeydown(event) {
  if (event.key === "Escape") {
    closeCart();
  }
}

export function bindCartEvents(products) {
  productsCache = products;
  renderCart(productsCache);
  updateCartCounter();

  if (isBound) {
    return;
  }

  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", handleKeydown);
  isBound = true;
}
