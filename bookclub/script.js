const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const heroArt = document.querySelector(".hero-art");
const viewport = document.getElementById("books-viewport");
const prevButton = document.querySelector(".carousel-btn-prev");
const nextButton = document.querySelector(".carousel-btn-next");
const calendarGrid = document.getElementById("calendar-grid");
const monthLabel = document.getElementById("calendar-month-label");
const eventDetails = document.getElementById("event-details");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const calendarWidget = document.querySelector(".calendar-widget");
const form = document.getElementById("joinClubForm");
const formSuccess = document.getElementById("formSuccess");
const heroMeetingDate = document.getElementById("heroMeetingDate");
const heroMeetingTheme = document.getElementById("heroMeetingTheme");
const heroMeetingFormat = document.getElementById("heroMeetingFormat");
const heroMeetingBook = document.getElementById("heroMeetingBook");
const heroMeetingSpots = document.getElementById("heroMeetingSpots");
const joinMeetingChip = document.getElementById("joinMeetingChip");
const joinMeetingNote = document.getElementById("joinMeetingNote");

const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const today = new Date();
const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

const pad = (value) => String(value).padStart(2, "0");
const formatKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const formatMonthLabel = (date) =>
  date.toLocaleDateString("ru-RU", { month: "long", year: "numeric" }).replace(/^\S/, (letter) => letter.toUpperCase());

const createEvents = () => {
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const buildDate = (monthOffset, day) => {
    const date = new Date(currentYear, currentMonth + monthOffset, day);
    return formatKey(date);
  };

  return {
    [buildDate(0, 12)]: {
      title: "Обсуждение «451° по Фаренгейту»",
      book: "Рэй Брэдбери — «451° по Фаренгейту»",
      time: "19:30",
      format: "Онлайн",
      spots: "12 мест",
      theme: "Говорим о памяти, запрете на сложность и внутренней свободе читателя."
    },
    [buildDate(0, 19)]: {
      title: "Открытая встреча для новых участников",
      book: "Подборка коротких эссе и любимых фрагментов участников",
      time: "19:30",
      format: "Гибридно",
      spots: "8 мест",
      theme: "Знакомимся, рассказываем о любимых книгах и пробуем формат клуба без давления."
    },
    [buildDate(0, 27)]: {
      title: "Дискуссия по современной прозе",
      book: "Ханья Янагихара — «Маленькая жизнь»",
      time: "19:00",
      format: "Офлайн",
      spots: "6 мест",
      theme: "Обсуждаем, как роман работает с эмпатией, травмой и близостью."
    },
    [buildDate(1, 5)]: {
      title: "Встреча по роману «Норвежский лес»",
      book: "Харуки Мураками — «Норвежский лес»",
      time: "20:00",
      format: "Онлайн",
      spots: "15 мест",
      theme: "Ищем музыку, паузы и недосказанность в тексте."
    },
    [buildDate(1, 16)]: {
      title: "Клубный вечер классики",
      book: "Михаил Булгаков — «Мастер и Маргарита»",
      time: "19:00",
      format: "Гибридно",
      spots: "10 мест",
      theme: "Разбираем, где в романе спрятаны ирония, страх и свобода."
    },
    [buildDate(2, 8)]: {
      title: "Разговор о голосе героя",
      book: "Дж. Д. Сэлинджер — «Над пропастью во ржи»",
      time: "19:30",
      format: "Онлайн",
      spots: "14 мест",
      theme: "Смотрим, почему искренний и нервный голос романа все еще звучит современно."
    }
  };
};

const events = createEvents();
let currentMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
let selectedDateKey = "";

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const setHeroParallax = () => {
  if (reducedMotion || !heroArt) {
    return;
  }

  const offset = Math.min(window.scrollY * 0.12, 70);
  root.style.setProperty("--hero-shift", `${offset}px`);
};

const toggleNav = () => {
  const isOpen = siteNav.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
};

const closeNav = () => {
  siteNav.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
};

const setupSmoothScroll = () => {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const target = targetId ? document.querySelector(targetId) : null;

      if (!target) {
        return;
      }

      event.preventDefault();
      const headerOffset = header.offsetHeight + 10;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top,
        behavior: reducedMotion ? "auto" : "smooth"
      });

      closeNav();
    });
  });
};

const setupRevealAnimations = () => {
  const elements = document.querySelectorAll(".hidden");

  if (!("IntersectionObserver" in window) || reducedMotion) {
    elements.forEach((element) => {
      element.classList.add("visible");
      element.classList.remove("hidden");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const delay = entry.target.dataset.delay || "0";
        entry.target.style.setProperty("--delay", `${delay}s`);
        entry.target.classList.add("visible");
        entry.target.classList.remove("hidden");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  elements.forEach((element) => observer.observe(element));
};

const getScrollAmount = () => {
  const firstCard = viewport.querySelector(".book-card");

  if (!firstCard) {
    return 0;
  }

  const styles = window.getComputedStyle(viewport.querySelector(".books-track"));
  const parsedColumnGap = parseFloat(styles.columnGap);
  const parsedGap = parseFloat(styles.gap);
  const gap = Number.isNaN(parsedColumnGap) ? (Number.isNaN(parsedGap) ? 0 : parsedGap) : parsedColumnGap;
  return firstCard.getBoundingClientRect().width + gap;
};

const updateCarouselButtons = () => {
  if (!viewport || !prevButton || !nextButton) {
    return;
  }

  const maxScroll = Math.round(viewport.scrollWidth - viewport.clientWidth);
  prevButton.disabled = viewport.scrollLeft <= 4;
  nextButton.disabled = viewport.scrollLeft >= maxScroll - 4;
};

const setupCarousel = () => {
  if (!viewport || !prevButton || !nextButton) {
    return;
  }

  const scrollByCards = (direction) => {
    viewport.scrollBy({
      left: getScrollAmount() * direction * (window.innerWidth > 860 ? 2 : 1),
      behavior: reducedMotion ? "auto" : "smooth"
    });
  };

  prevButton.addEventListener("click", () => scrollByCards(-1));
  nextButton.addEventListener("click", () => scrollByCards(1));
  viewport.addEventListener("scroll", updateCarouselButtons, { passive: true });
  window.addEventListener("resize", updateCarouselButtons);
  updateCarouselButtons();
};

const findBestEventForMonth = (visibleDate) => {
  const monthEvents = Object.entries(events)
    .filter(([key]) => {
      const date = new Date(`${key}T00:00:00`);
      return date.getFullYear() === visibleDate.getFullYear() && date.getMonth() === visibleDate.getMonth();
    })
    .sort(([a], [b]) => new Date(`${a}T00:00:00`) - new Date(`${b}T00:00:00`));

  if (monthEvents.length) {
    return monthEvents[0][0];
  }

  const futureEvents = Object.keys(events)
    .filter((key) => new Date(`${key}T00:00:00`) >= todayStart)
    .sort((a, b) => new Date(`${a}T00:00:00`) - new Date(`${b}T00:00:00`));

  return futureEvents[0] || Object.keys(events)[0] || "";
};

const getNearestEventKey = () => {
  const sortedEvents = Object.keys(events)
    .sort((a, b) => new Date(`${a}T00:00:00`) - new Date(`${b}T00:00:00`));

  const preferredOpenEvent = sortedEvents.find((key) => {
    const eventDate = new Date(`${key}T00:00:00`);
    return eventDate >= todayStart && events[key].title.toLowerCase().includes("открытая");
  });

  if (preferredOpenEvent) {
    return preferredOpenEvent;
  }

  return sortedEvents.find((key) => new Date(`${key}T00:00:00`) >= todayStart) || sortedEvents[0] || "";
};

const populateMeetingHighlights = () => {
  const nearestEventKey = getNearestEventKey();
  const nearestEvent = events[nearestEventKey];

  if (!nearestEvent) {
    return;
  }

  const nearestDate = new Date(`${nearestEventKey}T00:00:00`);
  const chipDate = nearestDate.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  const fullDate = nearestDate.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  heroMeetingDate.textContent = `${chipDate}, ${nearestEvent.time}`;
  heroMeetingTheme.textContent = nearestEvent.theme;
  heroMeetingFormat.textContent = `Формат: ${nearestEvent.format}`;
  heroMeetingBook.textContent = `Книга / тема: ${nearestEvent.book}`;
  heroMeetingSpots.textContent = `Места: ${nearestEvent.spots}`;
  joinMeetingChip.textContent = `Встреча ${chipDate}`;
  joinMeetingNote.innerHTML = `
    <strong>Ближайшая открытая встреча:</strong>
    ${fullDate} в ${nearestEvent.time}. Тема вечера: «${nearestEvent.title}».
  `;
};

const renderEventDetails = (dateKey) => {
  const event = events[dateKey];

  if (!event) {
    eventDetails.innerHTML = `
      <div class="event-empty">
        <strong>На эту дату встреча не запланирована</strong>
        <p>Выберите другую подсвеченную дату, чтобы увидеть детали ближайшего обсуждения.</p>
      </div>
    `;
    return;
  }

  const eventDate = new Date(`${dateKey}T00:00:00`);
  const formattedDate = eventDate.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  eventDetails.innerHTML = `
    <div class="event-date">${formattedDate}</div>
    <h3>${event.title}</h3>
    <p>${event.theme}</p>
    <div class="event-card-list">
      <div class="event-card-item">
        <strong>Книга</strong>
        <span>${event.book}</span>
      </div>
      <div class="event-card-item">
        <strong>Время</strong>
        <span>${event.time}</span>
      </div>
      <div class="event-card-item">
        <strong>Формат</strong>
        <span>${event.format}</span>
      </div>
      <div class="event-card-item">
        <strong>Места</strong>
        <span>${event.spots}</span>
      </div>
    </div>
  `;
};

const renderCalendar = () => {
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekDay = (firstDay.getDay() + 6) % 7;
  const totalCells = Math.ceil((firstWeekDay + lastDay.getDate()) / 7) * 7;

  monthLabel.textContent = formatMonthLabel(currentMonthDate);
  calendarGrid.innerHTML = "";

  const bestMonthEvent = findBestEventForMonth(currentMonthDate);

  if (!selectedDateKey || !events[selectedDateKey]) {
    selectedDateKey = bestMonthEvent;
  } else {
    const selectedDate = new Date(`${selectedDateKey}T00:00:00`);
    const isSelectedMonthVisible =
      selectedDate.getFullYear() === year && selectedDate.getMonth() === month;

    if (!isSelectedMonthVisible && bestMonthEvent) {
      selectedDateKey = bestMonthEvent;
    }
  }

  for (let index = 0; index < totalCells; index += 1) {
    const cellDate = new Date(year, month, index - firstWeekDay + 1);
    const dateKey = formatKey(cellDate);
    const isCurrentMonth = cellDate.getMonth() === month;
    const isToday = dateKey === formatKey(today);
    const hasEvent = Boolean(events[dateKey]);
    const isSelected = dateKey === selectedDateKey;
    const button = document.createElement("button");

    button.type = "button";
    button.className = "calendar-day";
    if (!isCurrentMonth) {
      button.classList.add("is-outside");
    }
    if (isToday) {
      button.classList.add("is-today");
    }
    if (hasEvent) {
      button.classList.add("has-event");
    }
    if (isSelected) {
      button.classList.add("is-selected");
    }

    const ariaParts = [
      cellDate.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
    ];

    if (hasEvent) {
      ariaParts.push(`есть событие: ${events[dateKey].title}`);
    }

    button.setAttribute("aria-label", ariaParts.join(", "));
    button.dataset.date = dateKey;
    button.innerHTML = `
      <span class="day-number">${cellDate.getDate()}</span>
      ${hasEvent ? '<span class="day-label">встреча</span>' : ""}
    `;

    if (hasEvent) {
      button.addEventListener("click", () => {
        selectedDateKey = dateKey;
        renderCalendar();
        renderEventDetails(dateKey);
      });
    } else {
      button.classList.add("is-passive");
      button.setAttribute("aria-disabled", "true");
      button.tabIndex = -1;
    }

    calendarGrid.appendChild(button);
  }

  renderEventDetails(selectedDateKey || bestMonthEvent);
};

const switchMonth = (direction) => {
  currentMonthDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + direction, 1);

  if (!reducedMotion) {
    calendarWidget.classList.add("is-switching");
    window.setTimeout(() => calendarWidget.classList.remove("is-switching"), 180);
  }

  renderCalendar();
};

const validateField = (fieldName) => {
  const field = form.querySelector(`[data-field="${fieldName}"]`);
  const errorElement = field.querySelector(".field-error");
  let isValid = true;
  let message = "";

  if (fieldName === "name") {
    const value = form.elements.name.value.trim();
    if (value.length < 2) {
      isValid = false;
      message = "Введите имя не короче 2 символов.";
    }
  }

  if (fieldName === "email") {
    const value = form.elements.email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      isValid = false;
      message = "Укажите корректный email.";
    }
  }

  if (fieldName === "contact") {
    const value = form.elements.contact.value.trim();
    const looksLikeTelegram = /^@[\w.]{4,}$/i.test(value);
    const digits = value.replace(/[^\d+]/g, "");
    const looksLikePhone = /^[+]?\d{7,15}$/.test(digits);

    if (!looksLikeTelegram && !looksLikePhone) {
      isValid = false;
      message = "Укажите телефон или Telegram в понятном формате.";
    }
  }

  if (fieldName === "genre") {
    const value = form.elements.genre.value.trim();
    if (value.length < 3) {
      isValid = false;
      message = "Расскажите хотя бы коротко, что любите читать.";
    }
  }

  if (fieldName === "format") {
    const selected = form.querySelector('input[name="format"]:checked');
    if (!selected) {
      isValid = false;
      message = "Выберите удобный формат участия.";
    }
  }

  if (fieldName === "comment") {
    const value = form.elements.comment.value.trim();
    if (value && value.length < 10) {
      isValid = false;
      message = "Если оставляете комментарий, напишите чуть подробнее.";
    }
  }

  field.classList.toggle("is-invalid", !isValid);
  errorElement.textContent = message;
  return isValid;
};

const setupFormValidation = () => {
  if (!form) {
    return;
  }

  const fieldsToValidate = ["name", "email", "contact", "genre", "format", "comment"];

  fieldsToValidate.forEach((fieldName) => {
    if (fieldName === "format") {
      const radios = form.querySelectorAll('input[name="format"]');
      radios.forEach((radio) => {
        radio.addEventListener("change", () => validateField(fieldName));
      });
      return;
    }

    const field = form.querySelector(`[name="${fieldName}"]`);
    if (!field) {
      return;
    }

    field.addEventListener("blur", () => validateField(fieldName));
    field.addEventListener("input", () => {
      if (form.querySelector(`[data-field="${fieldName}"]`).classList.contains("is-invalid")) {
        validateField(fieldName);
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const isFormValid = fieldsToValidate.every((fieldName) => validateField(fieldName));

    if (!isFormValid) {
      return;
    }

    formSuccess.classList.add("is-visible");
    form.reset();

    fieldsToValidate.forEach((fieldName) => {
      const fieldWrapper = form.querySelector(`[data-field="${fieldName}"]`);
      if (fieldWrapper) {
        fieldWrapper.classList.remove("is-invalid");
      }

      const errorElement = fieldWrapper ? fieldWrapper.querySelector(".field-error") : null;
      if (errorElement) {
        errorElement.textContent = "";
      }
    });
  });
};

navToggle.addEventListener("click", toggleNav);
document.addEventListener("click", (event) => {
  if (!siteNav.contains(event.target) && !navToggle.contains(event.target)) {
    closeNav();
  }
});

window.addEventListener(
  "scroll",
  () => {
    setHeaderState();
    setHeroParallax();
  },
  { passive: true }
);

prevMonthButton.addEventListener("click", () => switchMonth(-1));
nextMonthButton.addEventListener("click", () => switchMonth(1));

setHeaderState();
setHeroParallax();
setupSmoothScroll();
setupRevealAnimations();
setupCarousel();
populateMeetingHighlights();
renderCalendar();
setupFormValidation();
