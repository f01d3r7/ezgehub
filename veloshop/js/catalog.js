import { bindCartEvents } from "./cart.js";
import { bindCompareEvents, syncCompareButtons } from "./compare.js";
import { products, typeOptions } from "./data.js";
import {
  applyFilters,
  filtersState,
  resetFilters,
  setPriceFilter,
  setSort,
  setTypeFilter
} from "./filters.js";
import { renderProducts, renderResultsCount } from "./render.js";
import { getQueryParams, setCurrentYear } from "./utils.js";

const catalogContainer = document.getElementById("catalog-products");
const resultsCounter = document.getElementById("results-count");
const sortSelect = document.getElementById("sort-select");
const filtersForm = document.getElementById("catalog-filters");

function syncFiltersFromQuery() {
  const { type } = getQueryParams();
  const isSupportedType = typeOptions.some((option) => option.value === type);

  if (type && isSupportedType) {
    setTypeFilter(type);
  }
}

function syncFilterControls() {
  const activeType = document.querySelector(`[name="bike-type"][value="${filtersState.type}"]`);
  const activePrice = document.querySelector(`[name="price-range"][value="${filtersState.priceRange}"]`);

  if (activeType) {
    activeType.checked = true;
  }

  if (activePrice) {
    activePrice.checked = true;
  }

  if (sortSelect) {
    sortSelect.value = filtersState.sortBy;
  }
}

function syncUrlWithState() {
  const url = new URL(window.location.href);

  if (filtersState.type === "all") {
    url.searchParams.delete("type");
  } else {
    url.searchParams.set("type", filtersState.type);
  }

  window.history.replaceState({}, "", url);
}

function applyFiltersAndRender() {
  const visibleProducts = applyFilters(products, filtersState);

  renderProducts(catalogContainer, visibleProducts, {
    variant: "catalog",
    emptyText: "По выбранным фильтрам ничего не найдено"
  });
  renderResultsCount(resultsCounter, visibleProducts.length);
  syncCompareButtons();
}

function bindCatalogEvents() {
  if (filtersForm) {
    filtersForm.addEventListener("change", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLInputElement)) {
        return;
      }

      if (target.name === "bike-type") {
        setTypeFilter(target.value);
      }

      if (target.name === "price-range") {
        setPriceFilter(target.value);
      }

      syncUrlWithState();
      applyFiltersAndRender();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
      setSort(event.target.value);
      applyFiltersAndRender();
    });
  }

  document
    .querySelector('[data-action="reset-filters"]')
    ?.addEventListener("click", () => {
      resetFilters();
      syncFilterControls();
      syncUrlWithState();
      applyFiltersAndRender();
    });
}

function initCatalogPage() {
  syncFiltersFromQuery();
  syncFilterControls();
  applyFiltersAndRender();
  bindCatalogEvents();
  bindCartEvents(products);
  bindCompareEvents(products);
  setCurrentYear();
}

document.addEventListener("DOMContentLoaded", initCatalogPage);
