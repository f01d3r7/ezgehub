const drinks = {
  classic: [
    {
      name: "Эспрессо",
      description: "Плотный шот с карамельной сладостью и чистым долгим послевкусием.",
      price: "от 3.20 €",
      tag: "Для тех, кто любит вкус зерна без лишнего",
      image:
        "https://images.unsplash.com/photo-1769264963847-7686ce678d91?auto=format&fit=crop&w=1200&q=80",
      label: "Classic",
    },
    {
      name: "Капучино",
      description: "Эспрессо, молоко и нежная текстура пены для идеального баланса.",
      price: "от 4.50 €",
      tag: "Самый мягкий утренний выбор",
      image:
        "https://images.unsplash.com/photo-1524671710025-d79530c2f957?auto=format&fit=crop&w=1200&q=80",
      label: "Classic",
    },
    {
      name: "Флэт уайт",
      description: "Насыщенный кофе с бархатистой молочной текстурой и акцентом на зерне.",
      price: "от 4.90 €",
      tag: "Для спокойного, длинного первого глотка",
      image:
        "https://images.unsplash.com/photo-1553962311-62f2471b159d?auto=format&fit=crop&w=1200&q=80",
      label: "Classic",
    },
  ],
  signature: [
    {
      name: "Лавандовый раф",
      description: "Сливочный кофе с цветочным акцентом и мягкой ванильной глубиной.",
      price: "от 5.80 €",
      tag: "Наш фирменный уют в чашке",
      image:
        "https://images.unsplash.com/photo-1749280806216-4f247baac722?auto=format&fit=crop&w=1200&q=80",
      label: "Signature",
    },
    {
      name: "Солёная карамель",
      description: "Нежный латте с карамельным сиропом, щепоткой соли и тёплым послевкусием.",
      price: "от 5.60 €",
      tag: "Сладкий акцент без перегруза",
      image:
        "https://images.unsplash.com/photo-1764416002220-976a7ed6b455?auto=format&fit=crop&w=1200&q=80",
      label: "Signature",
    },
    {
      name: "Апельсиновый эспрессо",
      description: "Яркий цитрус, короткий шот и чистая свежесть в неожиданно мягком сочетании.",
      price: "от 5.10 €",
      tag: "Контрастный вкус для нового настроения",
      image:
        "https://images.unsplash.com/photo-1769264963847-7686ce678d91?auto=format&fit=crop&w=1200&q=80",
      label: "Signature",
    },
  ],
  cold: [
    {
      name: "Айс-латте",
      description: "Освежающий кофейный напиток со льдом, мягким молоком и чистой сладостью.",
      price: "от 5.20 €",
      tag: "Лёгкий вариант для тёплого дня",
      image:
        "https://images.unsplash.com/photo-1759259639354-830bc3120807?auto=format&fit=crop&w=1200&q=80",
      label: "Cold",
    },
    {
      name: "Cold brew citrus",
      description: "Холодная экстракция, яркий цитрус и спокойная бодрость без лишней горечи.",
      price: "от 5.40 €",
      tag: "Свежий тон и долгое послевкусие",
      image:
        "https://images.unsplash.com/photo-1760304737368-7d8376bde94c?auto=format&fit=crop&w=1200&q=80",
      label: "Cold",
    },
  ],
};

const menuGrid = document.querySelector("#menuGrid");
const menuTabs = document.querySelectorAll(".menu-tab");
const hero = document.querySelector(".hero");
const topbar = document.querySelector(".topbar");
const revealItems = document.querySelectorAll(".reveal");
const galleryCards = document.querySelectorAll(".gallery-card");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector(".lightbox__image");
const lightboxCaption = lightbox.querySelector(".lightbox__caption");
const lightboxClose = lightbox.querySelector(".lightbox__close");
const lightboxBackdrop = lightbox.querySelector(".lightbox__backdrop");
const bookingForm = document.querySelector("#bookingForm");
const successMessage = document.querySelector("#formSuccess");

let activeCategory = "classic";

function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function updateHeaderState() {
  topbar.classList.toggle("is-scrolled", window.scrollY > 36);
}

function renderMenu(category) {
  const items = drinks[category];

  menuGrid.innerHTML = items
    .map(
      (item, index) => `
        <article class="menu-card menu-card--entering" style="--delay: ${index * 90}ms">
          <div class="menu-card__media">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
          </div>
          <div class="menu-card__content">
            <div class="menu-card__meta">
              <span class="menu-card__category">${item.label}</span>
              <strong class="menu-card__price">${item.price}</strong>
            </div>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <span class="menu-card__tag">${item.tag}</span>
          </div>
        </article>
      `
    )
    .join("");
}

function switchCategory(category) {
  if (category === activeCategory) {
    return;
  }

  activeCategory = category;

  menuTabs.forEach((tab) => {
    const isActive = tab.dataset.category === category;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  menuGrid.classList.add("is-switching");

  window.setTimeout(() => {
    renderMenu(category);
    menuGrid.classList.remove("is-switching");
  }, 180);
}

function setupMenuTabs() {
  renderMenu(activeCategory);

  menuTabs.forEach((tab) => {
    tab.addEventListener("click", () => switchCategory(tab.dataset.category));
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function setupRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupParallax() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  updateHeaderState();

  if (prefersReducedMotion) {
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    return;
  }

  const updateParallax = () => {
    const scrollY = window.scrollY;
    hero.style.setProperty("--hero-shift", `${scrollY * 0.08}px`);
    updateHeaderState();

    galleryCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const offset = (window.innerHeight / 2 - rect.top) * (0.012 + index * 0.0012);
      card.style.setProperty("--parallax-offset", `${Math.max(-10, Math.min(10, offset))}px`);
    });
  };

  updateParallax();

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) {
      return;
    }

    window.requestAnimationFrame(() => {
      updateParallax();
      ticking = false;
    });

    ticking = true;
  });

  window.addEventListener("resize", updateParallax);
}

function openLightbox(src, alt, caption) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightboxCaption.textContent = caption;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");

  window.setTimeout(() => {
    lightboxImage.src = "";
    lightboxImage.alt = "";
    lightboxCaption.textContent = "";
  }, 180);
}

function setupLightbox() {
  galleryCards.forEach((card) => {
    card.addEventListener("click", () => {
      const image = card.querySelector("img");
      openLightbox(
        card.dataset.lightboxSrc,
        image.alt,
        card.dataset.lightboxCaption || image.alt
      );
    });
  });

  lightboxBackdrop.addEventListener("click", closeLightbox);
  lightboxClose.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}

function setFieldError(field, message) {
  const errorElement = field.querySelector(".field__error");
  field.classList.toggle("is-invalid", Boolean(message));
  errorElement.textContent = message || "";
}

function validateForm() {
  let isValid = true;

  const nameField = bookingForm.querySelector('[name="name"]').closest(".field");
  const phoneField = bookingForm.querySelector('[name="phone"]').closest(".field");
  const dateField = bookingForm.querySelector('[name="date"]').closest(".field");
  const timeField = bookingForm.querySelector('[name="time"]').closest(".field");
  const guestsField = bookingForm.querySelector('[name="guests"]').closest(".field");

  const nameInput = nameField.querySelector("input");
  const phoneInput = phoneField.querySelector("input");
  const dateInput = dateField.querySelector("input");
  const timeInput = timeField.querySelector("input");
  const guestsSelect = guestsField.querySelector("select");

  const normalizedName = nameInput.value.trim();
  const normalizedPhone = phoneInput.value.trim();
  const normalizedDate = dateInput.value;
  const normalizedTime = timeInput.value;
  const normalizedGuests = guestsSelect.value;

  setFieldError(
    nameField,
    normalizedName.length >= 2 ? "" : "Введите имя не короче двух символов."
  );
  setFieldError(
    phoneField,
    /^[+\d][\d\s()-]{9,}$/.test(normalizedPhone)
      ? ""
      : "Укажите телефон в корректном формате."
  );

  if (!normalizedDate) {
    setFieldError(dateField, "Выберите дату визита.");
  } else {
    const selectedDate = new Date(`${normalizedDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setFieldError(
      dateField,
      selectedDate >= today ? "" : "Дата бронирования не может быть в прошлом."
    );
  }

  setFieldError(timeField, normalizedTime ? "" : "Выберите удобное время.");
  setFieldError(guestsField, normalizedGuests ? "" : "Укажите количество гостей.");

  [nameField, phoneField, dateField, timeField, guestsField].forEach((field) => {
    if (field.classList.contains("is-invalid")) {
      isValid = false;
    }
  });

  return isValid;
}

function setupBookingForm() {
  const dateInput = bookingForm.querySelector('[name="date"]');
  dateInput.min = getLocalDateString();

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    successMessage.hidden = true;

    if (!validateForm()) {
      const invalidField = bookingForm.querySelector(
        ".field.is-invalid input, .field.is-invalid select"
      );

      if (invalidField) {
        invalidField.focus();
      }

      return;
    }

    bookingForm.reset();
    successMessage.hidden = false;
  });

  bookingForm.querySelectorAll("input, select, textarea").forEach((control) => {
    const clearState = () => {
      const field = control.closest(".field");
      setFieldError(field, "");
      successMessage.hidden = true;
    };

    control.addEventListener("input", clearState);
    control.addEventListener("change", clearState);
  });
}

setupMenuTabs();
setupSmoothScroll();
setupRevealAnimations();
setupParallax();
setupLightbox();
setupBookingForm();
