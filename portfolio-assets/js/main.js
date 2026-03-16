const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const yearNodes = document.querySelectorAll("[data-current-year]");
const revealNodes = document.querySelectorAll("[data-reveal]");
const contactForm = document.querySelector("[data-contact-form]");
const formSuccess = document.querySelector("[data-form-success]");

function setCurrentYear() {
  const currentYear = String(new Date().getFullYear());

  yearNodes.forEach((node) => {
    node.textContent = currentYear;
  });
}

function syncHeaderState() {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function closeMenu() {
  if (!menu || !menuToggle) {
    return;
  }

  menu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("is-menu-open");
}

function openMenu() {
  if (!menu || !menuToggle) {
    return;
  }

  menu.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("is-menu-open");
}

function bindMenu() {
  if (!menu || !menuToggle) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

function initReveal() {
  if (!revealNodes.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function setFieldError(fieldName, message) {
  const input = contactForm?.querySelector(`[data-field="${fieldName}"]`);
  const error = contactForm?.querySelector(`[data-error-for="${fieldName}"]`);

  if (!input || !error) {
    return;
  }

  input.setAttribute("aria-invalid", message ? "true" : "false");
  error.textContent = message;
}

function validateField(fieldName, value) {
  const trimmedValue = value.trim();

  if (fieldName === "name" && trimmedValue.length < 2) {
    return "Введите имя минимум из двух символов.";
  }

  if (fieldName === "email") {
    if (!trimmedValue) {
      return "Укажите email, чтобы можно было ответить.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedValue)) {
      return "Введите корректный email.";
    }
  }

  if (fieldName === "projectType" && !trimmedValue) {
    return "Выберите тип задачи, чтобы было проще оценить запрос.";
  }

  if (fieldName === "message" && trimmedValue.length < 20) {
    return "Опишите задачу чуть подробнее, минимум в 20 символов.";
  }

  return "";
}

function bindContactForm() {
  if (!contactForm) {
    return;
  }

  const fields = ["name", "email", "projectType", "message"];

  fields.forEach((fieldName) => {
    const input = contactForm.querySelector(`[data-field="${fieldName}"]`);

    input?.addEventListener("blur", () => {
      setFieldError(fieldName, validateField(fieldName, input.value));
    });

    input?.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") {
        setFieldError(fieldName, validateField(fieldName, input.value));
      }
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let hasErrors = false;

    fields.forEach((fieldName) => {
      const input = contactForm.querySelector(`[data-field="${fieldName}"]`);
      const message = validateField(fieldName, input?.value || "");

      setFieldError(fieldName, message);
      if (message) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      formSuccess?.setAttribute("hidden", "");
      return;
    }

    formSuccess?.removeAttribute("hidden");
    contactForm.reset();
    fields.forEach((fieldName) => setFieldError(fieldName, ""));
  });
}

setCurrentYear();
bindMenu();
initReveal();
bindContactForm();
syncHeaderState();

window.addEventListener("scroll", syncHeaderState, { passive: true });
