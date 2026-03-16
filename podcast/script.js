const episodes = [
  {
    id: 1,
    title: "Как внимательность становится конкурентным преимуществом",
    description: "Разбираем, почему в шумной среде выигрывают не самые громкие, а самые точные команды и авторы.",
    duration: "00:24",
    date: "14.03.2026",
    audioSrc: "podcast/assets/audio/episode-1.wav",
    cover: "podcast/assets/images/episode-1.svg"
  },
  {
    id: 2,
    title: "Редактор как архитектор смысла",
    description: "Говорим о редактуре, ответственности за тон и том, как строится доверие к медиа-продукту.",
    duration: "00:28",
    date: "07.03.2026",
    audioSrc: "podcast/assets/audio/episode-2.wav",
    cover: "podcast/assets/images/episode-2.svg"
  },
  {
    id: 3,
    title: "Почему устойчивые привычки важнее вдохновения",
    description: "Эпизод о рабочем ритме, креативной дисциплине и системах, которые спасают от выгорания.",
    duration: "00:32",
    date: "28.02.2026",
    audioSrc: "podcast/assets/audio/episode-3.wav",
    cover: "podcast/assets/images/episode-3.svg"
  },
  {
    id: 4,
    title: "Тихие технологии: как сервисы учатся не мешать человеку",
    description: "Исследуем цифровые продукты, которые помогают быть внимательнее, а не удерживают любой ценой.",
    duration: "00:36",
    date: "21.02.2026",
    audioSrc: "podcast/assets/audio/episode-4.wav",
    cover: "podcast/assets/images/episode-4.svg"
  }
];

const guests = [
  {
    id: 1,
    name: "Анна Петрова",
    role: "писатель и эссеист",
    description: "О том, как длинное письмо и хорошее редактирование спасают мысль от поверхностности.",
    image: "podcast/assets/images/guest-1.svg",
    episodeId: 2
  },
  {
    id: 2,
    name: "Илья Смирнов",
    role: "продуктовый дизайнер",
    description: "Об интерфейсах, которые помогают сосредоточиться, а не уводят в бесконечный скролл.",
    image: "podcast/assets/images/guest-2.svg",
    episodeId: 4
  },
  {
    id: 3,
    name: "Марина Левина",
    role: "редактор медиа",
    description: "О тональности бренда, медиадисциплине и честности как редакторском инструменте.",
    image: "podcast/assets/images/guest-3.svg",
    episodeId: 1
  },
  {
    id: 4,
    name: "Кирилл Орлов",
    role: "основатель студии",
    description: "О том, как небольшие команды выстраивают устойчивые процессы и не теряют живость.",
    image: "podcast/assets/images/guest-4.svg",
    episodeId: 3
  },
  {
    id: 5,
    name: "Софья Власова",
    role: "культурный исследователь",
    description: "О новых культурных сигналах, внимании аудитории и том, почему контекст снова важен.",
    image: "podcast/assets/images/guest-5.svg",
    episodeId: 1
  }
];

const episodesList = document.getElementById("episodes-list");
const playerCover = document.getElementById("player-cover");
const playerDate = document.getElementById("player-date");
const playerTitle = document.getElementById("player-title");
const playerDescription = document.getElementById("player-description");
const playerStatus = document.getElementById("player-status");
const playButton = document.getElementById("play-button");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const progressBar = document.getElementById("progress-bar");
const progressFill = document.getElementById("progress-fill");
const currentTimeLabel = document.getElementById("current-time");
const durationTimeLabel = document.getElementById("duration-time");
const volumeRange = document.getElementById("volume-range");
const speedSelect = document.getElementById("speed-select");
const audio = document.getElementById("audio");
const guestsTrack = document.getElementById("guests-track");
const guestsViewport = document.getElementById("guests-viewport");
const guestsPrevButton = document.getElementById("guests-prev");
const guestsNextButton = document.getElementById("guests-next");
const heroPlayButton = document.querySelector("[data-hero-play]");
const contactForm = document.getElementById("contact-form");
const formSuccess = document.getElementById("form-success");
const revealElements = document.querySelectorAll(".reveal");

let currentEpisodeIndex = 0;
let currentGuestSlide = 0;
let cardsPerView = 3;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatTime(timeInSeconds) {
  if (!Number.isFinite(timeInSeconds) || timeInSeconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updatePlayButton() {
  const isPlaying = !audio.paused;
  playButton.textContent = isPlaying ? "Pause" : "Play";
  playButton.setAttribute("aria-label", isPlaying ? "Пауза" : "Воспроизвести");
}

function updateProgressUi() {
  const duration = audio.duration || 0;
  const progress = duration ? (audio.currentTime / duration) * 100 : 0;

  progressFill.style.width = `${progress}%`;
  progressBar.style.setProperty("--progress-percent", `${progress}%`);
  progressBar.setAttribute("aria-valuenow", String(Math.round(progress)));
  progressBar.setAttribute("aria-valuetext", `${formatTime(audio.currentTime)} из ${formatTime(duration)}`);
  currentTimeLabel.textContent = formatTime(audio.currentTime);
  durationTimeLabel.textContent = formatTime(duration);
}

function setStatus(message) {
  playerStatus.textContent = message;
}

function renderEpisodes() {
  episodesList.innerHTML = episodes
    .map((episode, index) => {
      const isActive = index === currentEpisodeIndex;

      return `
        <button class="episode-card ${isActive ? "active" : ""}" type="button" data-episode-index="${index}" aria-pressed="${isActive}">
          <span class="episode-topline">
            <span class="episode-number">EP ${String(episode.id).padStart(2, "0")}</span>
            <span>${episode.date}</span>
          </span>
          <strong class="episode-title">${episode.title}</strong>
          <p class="episode-description">${episode.description}</p>
          <span class="episode-meta">
            <span>${episode.duration}</span>
            <span>Демо-запись</span>
          </span>
          <span class="episode-listen">${isActive ? "Активный выпуск" : "Слушать выпуск"}</span>
        </button>
      `;
    })
    .join("");

  const episodeButtons = episodesList.querySelectorAll("[data-episode-index]");
  episodeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextIndex = Number(button.dataset.episodeIndex);
      setEpisode(nextIndex, { autoplay: true, resetTime: true });
    });
  });
}

function updatePlayerMeta() {
  const episode = episodes[currentEpisodeIndex];

  playerCover.src = episode.cover;
  playerCover.alt = `Обложка эпизода «${episode.title}»`;
  playerDate.textContent = `${episode.date} · ${episode.duration}`;
  playerTitle.textContent = episode.title;
  playerDescription.textContent = episode.description;
}

function setEpisode(index, options = {}) {
  const { autoplay = false, resetTime = true, scrollIntoView = false } = options;
  const normalizedIndex = (index + episodes.length) % episodes.length;
  const selectedEpisode = episodes[normalizedIndex];
  const nextSource = new URL(selectedEpisode.audioSrc, window.location.href).href;
  const currentSource = audio.currentSrc || new URL(audio.getAttribute("src") || "", window.location.href).href;
  const shouldReplaceSource = currentSource !== nextSource;

  currentEpisodeIndex = normalizedIndex;
  updatePlayerMeta();
  renderEpisodes();

  if (shouldReplaceSource) {
    audio.src = selectedEpisode.audioSrc;
  }

  if (resetTime) {
    audio.currentTime = 0;
    updateProgressUi();
  }

  if (scrollIntoView) {
    document.getElementById("episodes").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  setStatus(`Выбран выпуск: ${selectedEpisode.title}`);

  if (autoplay) {
    const playAttempt = audio.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {
        updatePlayButton();
        setStatus("Браузер заблокировал автозапуск. Нажмите Play, чтобы продолжить.");
      });
    }
  } else {
    audio.pause();
    updatePlayButton();
  }
}

function playAdjacentEpisode(direction, autoplay = true) {
  setEpisode(currentEpisodeIndex + direction, { autoplay, resetTime: true });
}

function togglePlayback() {
  if (!audio.src) {
    setEpisode(currentEpisodeIndex, { autoplay: true, resetTime: false });
    return;
  }

  if (audio.paused) {
    const playAttempt = audio.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {
        setStatus("Не удалось запустить демо-аудио. Проверьте, что файл доступен.");
        updatePlayButton();
      });
    }
  } else {
    audio.pause();
  }
}

function seekFromPointer(clientX) {
  const rect = progressBar.getBoundingClientRect();
  const ratio = Math.min(Math.max(clientX - rect.left, 0), rect.width) / rect.width;
  audio.currentTime = ratio * (audio.duration || 0);
  updateProgressUi();
}

function handleProgressKeyboard(event) {
  if (!audio.duration) {
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    audio.currentTime = Math.max(audio.currentTime - 5, 0);
  }

  if (event.key === "Home") {
    event.preventDefault();
    audio.currentTime = 0;
  }

  if (event.key === "End") {
    event.preventDefault();
    audio.currentTime = audio.duration;
  }

  updateProgressUi();
}

function renderGuests() {
  guestsTrack.innerHTML = guests
    .map((guest) => {
      const relatedEpisode = episodes.find((episode) => episode.id === guest.episodeId);

      return `
        <article class="guest-card">
          <div class="guest-media">
            <img src="${guest.image}" alt="${guest.name}">
          </div>
          <span class="guest-role">${guest.role}</span>
          <h3>${guest.name}</h3>
          <p>${guest.description}</p>
          <button class="guest-link" type="button" data-guest-episode="${guest.episodeId}">
            К выпуску ${relatedEpisode ? `«${relatedEpisode.title}»` : ""}
          </button>
        </article>
      `;
    })
    .join("");

  guestsTrack.querySelectorAll("[data-guest-episode]").forEach((button) => {
    button.addEventListener("click", () => {
      const episodeId = Number(button.dataset.guestEpisode);
      const targetIndex = episodes.findIndex((episode) => episode.id === episodeId);

      if (targetIndex !== -1) {
        setEpisode(targetIndex, { autoplay: false, resetTime: true, scrollIntoView: true });
        setStatus("Гость связан с выбранным выпуском. Можете сразу нажать Play.");
      }
    });
  });
}

function getCardsPerView() {
  if (window.innerWidth < 640) {
    return 1;
  }

  if (window.innerWidth < 860) {
    return 2;
  }

  return 3;
}

function updateGuestControls() {
  const maxSlide = Math.max(guests.length - cardsPerView, 0);
  guestsPrevButton.disabled = currentGuestSlide === 0;
  guestsNextButton.disabled = currentGuestSlide >= maxSlide;
  guestsPrevButton.style.opacity = currentGuestSlide === 0 ? "0.45" : "1";
  guestsNextButton.style.opacity = currentGuestSlide >= maxSlide ? "0.45" : "1";
}

function updateGuestCarousel() {
  cardsPerView = getCardsPerView();
  document.documentElement.style.setProperty("--guest-visible", String(cardsPerView));

  const maxSlide = Math.max(guests.length - cardsPerView, 0);
  currentGuestSlide = Math.min(currentGuestSlide, maxSlide);

  const firstCard = guestsTrack.querySelector(".guest-card");
  const gap = parseFloat(getComputedStyle(guestsTrack).columnGap || getComputedStyle(guestsTrack).gap || "0");
  const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : guestsViewport.clientWidth;
  const offset = currentGuestSlide * (cardWidth + gap);

  guestsTrack.style.transform = `translateX(-${offset}px)`;
  updateGuestControls();
}

function moveGuestCarousel(direction) {
  const maxSlide = Math.max(guests.length - cardsPerView, 0);
  currentGuestSlide = Math.min(Math.max(currentGuestSlide + direction, 0), maxSlide);
  updateGuestCarousel();
}

function setFieldError(fieldName, message) {
  const field = contactForm.elements[fieldName];
  const error = contactForm.querySelector(`[data-error-for="${fieldName}"]`);

  if (field) {
    field.classList.toggle("input-invalid", Boolean(message));
  }

  if (error) {
    error.textContent = message;
  }
}

function validateForm() {
  const formData = new FormData(contactForm);
  const values = Object.fromEntries(formData.entries());
  const errors = {};

  if (!String(values.name || "").trim()) {
    errors.name = "Введите имя.";
  }

  if (!emailPattern.test(String(values.email || "").trim())) {
    errors.email = "Укажите корректный email.";
  }

  if (!String(values.message || "").trim()) {
    errors.message = "Сообщение не должно быть пустым.";
  }

  if (!contactForm.elements.consent.checked) {
    errors.consent = "Нужно подтвердить согласие перед отправкой.";
  }

  ["name", "email", "message", "consent"].forEach((fieldName) => {
    setFieldError(fieldName, errors[fieldName] || "");
  });

  return {
    isValid: Object.keys(errors).length === 0,
    values
  };
}

function setupRevealObserver() {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -5% 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function initPlayerEvents() {
  playButton.addEventListener("click", togglePlayback);
  prevButton.addEventListener("click", () => playAdjacentEpisode(-1, true));
  nextButton.addEventListener("click", () => playAdjacentEpisode(1, true));
  volumeRange.addEventListener("input", (event) => {
    audio.volume = Number(event.target.value);
    setStatus(`Громкость: ${Math.round(audio.volume * 100)}%`);
  });
  speedSelect.addEventListener("change", (event) => {
    audio.playbackRate = Number(event.target.value);
    setStatus(`Скорость воспроизведения: ${event.target.value}x`);
  });

  progressBar.addEventListener("click", (event) => {
    if (audio.duration) {
      seekFromPointer(event.clientX);
    }
  });
  progressBar.addEventListener("keydown", handleProgressKeyboard);

  audio.addEventListener("play", () => {
    updatePlayButton();
    setStatus(`Сейчас играет: ${episodes[currentEpisodeIndex].title}`);
  });

  audio.addEventListener("pause", () => {
    updatePlayButton();
    if (audio.currentTime > 0 && audio.currentTime < (audio.duration || Number.MAX_SAFE_INTEGER)) {
      setStatus(`Пауза на ${formatTime(audio.currentTime)}`);
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    durationTimeLabel.textContent = formatTime(audio.duration);
    updateProgressUi();
  });

  audio.addEventListener("timeupdate", updateProgressUi);

  audio.addEventListener("ended", () => {
    setStatus("Эпизод закончился. Переключаем следующий выпуск.");
    playAdjacentEpisode(1, true);
  });

  audio.addEventListener("error", () => {
    setStatus("Не удалось загрузить аудиофайл. Проверьте локальные ассеты.");
    updatePlayButton();
  });
}

function initGuestEvents() {
  guestsPrevButton.addEventListener("click", () => moveGuestCarousel(-1));
  guestsNextButton.addEventListener("click", () => moveGuestCarousel(1));
  window.addEventListener("resize", updateGuestCarousel);
}

function initFormEvents() {
  ["name", "email", "message"].forEach((fieldName) => {
    contactForm.elements[fieldName].addEventListener("input", () => {
      setFieldError(fieldName, "");
      formSuccess.hidden = true;
    });
  });

  contactForm.elements.consent.addEventListener("change", () => {
    setFieldError("consent", "");
    formSuccess.hidden = true;
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formSuccess.hidden = true;

    const { isValid } = validateForm();
    if (!isValid) {
      setStatus("Форма содержит ошибки. Проверьте поля и попробуйте снова.");
      return;
    }

    setTimeout(() => {
      contactForm.reset();
      setFieldError("name", "");
      setFieldError("email", "");
      setFieldError("message", "");
      setFieldError("consent", "");
      formSuccess.hidden = false;
      setStatus("Сообщение отправлено. Спасибо за обратную связь.");
    }, 250);
  });
}

function initHeroAction() {
  heroPlayButton.addEventListener("click", (event) => {
    event.preventDefault();
    setEpisode(0, { autoplay: true, resetTime: true, scrollIntoView: true });
  });
}

function init() {
  renderEpisodes();
  renderGuests();
  updatePlayerMeta();
  audio.volume = Number(volumeRange.value);
  audio.playbackRate = Number(speedSelect.value);
  setEpisode(currentEpisodeIndex, { autoplay: false, resetTime: true });
  initPlayerEvents();
  initGuestEvents();
  initFormEvents();
  initHeroAction();
  updateGuestCarousel();
  setupRevealObserver();
}

window.addEventListener("DOMContentLoaded", init);
