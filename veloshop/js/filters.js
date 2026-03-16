export const filtersState = {
  type: "all",
  priceRange: "all",
  sortBy: "popular"
};

const priceMatchers = {
  all: () => true,
  "under-500": (product) => product.price < 500,
  "500-1000": (product) => product.price >= 500 && product.price <= 1000,
  "1000-2000": (product) => product.price > 1000 && product.price <= 2000,
  "over-2000": (product) => product.price > 2000
};

export function setTypeFilter(type) {
  filtersState.type = type;
}

export function setPriceFilter(range) {
  filtersState.priceRange = range;
}

export function setSort(sortBy) {
  filtersState.sortBy = sortBy;
}

export function resetFilters() {
  filtersState.type = "all";
  filtersState.priceRange = "all";
  filtersState.sortBy = "popular";
}

export function filterProducts(products, state = filtersState) {
  return products.filter((product) => {
    const matchesType = state.type === "all" || product.type === state.type;
    const matchesPrice =
      (priceMatchers[state.priceRange] || priceMatchers.all)(product);

    return matchesType && matchesPrice;
  });
}

export function sortProducts(products, sortBy = filtersState.sortBy) {
  const sorted = [...products];

  switch (sortBy) {
    case "price-asc":
      sorted.sort((first, second) => first.price - second.price);
      break;
    case "price-desc":
      sorted.sort((first, second) => second.price - first.price);
      break;
    case "name-asc":
      sorted.sort((first, second) => first.name.localeCompare(second.name));
      break;
    case "popular":
    default:
      sorted.sort((first, second) => {
        return (
          Number(Boolean(second.isPopular)) - Number(Boolean(first.isPopular)) ||
          (second.rating || 0) - (first.rating || 0) ||
          first.price - second.price
        );
      });
      break;
  }

  return sorted;
}

export function applyFilters(products, state = filtersState) {
  return sortProducts(filterProducts(products, state), state.sortBy);
}
