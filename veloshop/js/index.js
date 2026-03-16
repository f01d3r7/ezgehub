import { bindCartEvents } from "./cart.js";
import { bindCompareEvents } from "./compare.js";
import { products } from "./data.js";
import { renderFeaturedProducts } from "./render.js";
import { setCurrentYear } from "./utils.js";

function initIndexPage() {
  const featuredContainer = document.getElementById("featured-products");
  const featuredProducts = products.filter((product) => product.isPopular || product.isPromo);

  renderFeaturedProducts(featuredContainer, featuredProducts);
  bindCartEvents(products);
  bindCompareEvents(products);
  setCurrentYear();
}

document.addEventListener("DOMContentLoaded", initIndexPage);
