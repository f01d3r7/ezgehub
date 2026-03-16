import { formatPrice, getTypeLabel, pluralizeModels } from "./utils.js";

function createBadges(product) {
  const badges = [];

  if (product.isPopular) {
    badges.push('<span class="badge badge--soft">Хит</span>');
  }

  if (product.isPromo) {
    badges.push('<span class="badge badge--accent">Скидка</span>');
  }

  return badges.join("");
}

export function createProductCard(product, options = {}) {
  const variant = options.variant || "catalog";
  const detailsHref = `catalog.html?type=${product.type}#product-${product.id}`;
  const oldPriceMarkup = product.oldPrice
    ? `<span class="product-card__old-price">${formatPrice(product.oldPrice)}</span>`
    : "";

  return `
    <article class="product-card card product-card--${variant}" id="product-${product.id}" data-product-id="${product.id}">
      <div class="product-card__media">
        <div class="product-card__badges">${createBadges(product)}</div>
        <img class="product-card__image" src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-card__body">
        <div class="product-card__meta">
          <span class="product-card__type">${getTypeLabel(product.type)}</span>
          <span class="product-card__rating">Рейтинг ${product.rating.toFixed(1)}</span>
        </div>
        <h3 class="product-card__title">${product.name}</h3>
        <p class="product-card__brand">${product.brand}</p>
        <p class="product-card__purpose">${product.purpose}</p>
        <ul class="product-card__specs">
          ${product.shortSpecs.map((spec) => `<li>${spec}</li>`).join("")}
        </ul>
        <div class="product-card__footer">
          <div class="product-card__price-wrap">
            <span class="product-card__price">${formatPrice(product.price)}</span>
            ${oldPriceMarkup}
          </div>
          <div class="product-card__actions">
            <a class="btn btn--ghost btn--small" href="${detailsHref}" data-action="view-details">Подробнее</a>
            <button class="btn btn--secondary btn--small" type="button" data-action="add-to-compare" data-product-id="${product.id}">В сравнение</button>
            <button class="btn btn--primary btn--small" type="button" data-action="add-to-cart" data-product-id="${product.id}">В корзину</button>
          </div>
        </div>
      </div>
    </article>
  `;
}

export function renderEmptyState(container, text) {
  if (!container) {
    return;
  }

  container.innerHTML = `
    <div class="empty-state">
      <p class="empty-state__title">${text}</p>
      <p class="empty-state__text">Попробуйте изменить фильтры или открыть весь каталог.</p>
    </div>
  `;
}

export function renderProducts(container, products, options = {}) {
  if (!container) {
    return;
  }

  if (!products.length) {
    renderEmptyState(container, options.emptyText || "Подходящие модели пока не найдены");
    return;
  }

  container.innerHTML = products
    .map((product) => createProductCard(product, options))
    .join("");
}

export function renderResultsCount(container, count) {
  if (!container) {
    return;
  }

  container.textContent = `Найдено: ${count} ${pluralizeModels(count)}`;
}

export function renderFeaturedProducts(container, products) {
  renderProducts(container, products.slice(0, 6), {
    variant: "featured",
    emptyText: "Популярные модели скоро появятся"
  });
}
