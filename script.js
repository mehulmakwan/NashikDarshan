const translations = {
  en: {
    landingEyebrow: "Sacred journeys begin with intention",
    landingTitle: "Welcome to Nashik Darshan Yatra",
    landingSubtitle: "Discover spiritual landmarks and local heritage across Nashik.",
    selectLanguageLabel: "Select Your Language",
    continueButton: "Continue",
    footerText: "B.A.P.S Swaminarayan Mandir, Nasik",
    placesEyebrow: "Explore divine and cultural destinations",
    placesTitle: "Sacred Places in Nashik",
    placesSubtitle: "Tap a destination to read a short history or open directions in Google Maps.",
    changeLanguage: "Change Language",
    viewHistory: "View History",
    getDirections: "Get Directions",
    modalPrompt: "Choose an option to explore this destination.",
    cardHint: "Tap to open details, history, and directions.",
    historyHeading: "History",
    historyBack: "Back",
    closeModal: "Close modal"
  },
  hi: {
    landingEyebrow: "पवित्र यात्रा संकल्प से शुरू होती है",
    landingTitle: "नाशिक दर्शन यात्रा में आपका स्वागत है",
    landingSubtitle: "नाशिक के आध्यात्मिक स्थलों और स्थानीय विरासत को खोजें।",
    selectLanguageLabel: "अपनी भाषा चुनें",
    continueButton: "आगे बढ़ें",
    footerText: "बी.ए.पी.एस स्वामीनारायण मंदिर, नासिक",
    placesEyebrow: "दिव्य और सांस्कृतिक स्थलों का अन्वेषण करें",
    placesTitle: "नाशिक के पवित्र स्थल",
    placesSubtitle: "किसी स्थान पर टैप करें, उसका संक्षिप्त इतिहास पढ़ें या गूगल मैप्स में दिशा देखें।",
    changeLanguage: "भाषा बदलें",
    viewHistory: "इतिहास देखें",
    getDirections: "दिशा प्राप्त करें",
    modalPrompt: "इस स्थान के बारे में जानने के लिए एक विकल्प चुनें।",
    cardHint: "विवरण, इतिहास और दिशा देखने के लिए टैप करें।",
    historyHeading: "इतिहास",
    historyBack: "वापस जाएं",
    closeModal: "मोडल बंद करें"
  },
  gu: {
    landingEyebrow: "પવિત્ર યાત્રા સંકલ્પથી શરૂ થાય છે",
    landingTitle: "નાશિક દર્શન યાત્રામાં આપનું સ્વાગત છે",
    landingSubtitle: "નાશિકના આધ્યાત્મિક સ્થળો અને સ્થાનિક વારસા શોધો.",
    selectLanguageLabel: "તમારી ભાષા પસંદ કરો",
    continueButton: "આગળ વધો",
    footerText: "બી.એ.પી.એસ સ્વામિનારાયણ મંદિર, નાસિક",
    placesEyebrow: "દિવ્ય અને સાંસ્કૃતિક સ્થળોની મુલાકાત લો",
    placesTitle: "નાશિકના પવિત્ર સ્થળો",
    placesSubtitle: "કોઈ સ્થાન પર ટેપ કરો, તેનો સંક્ષિપ્ત ઈતિહાસ વાંચો અથવા ગૂગલ મેપ્સમાં દિશા ખોલો.",
    changeLanguage: "ભાષા બદલો",
    viewHistory: "ઈતિહાસ જુઓ",
    getDirections: "દિશા મેળવો",
    modalPrompt: "આ સ્થળ વિશે વધુ જાણવા માટે એક વિકલ્પ પસંદ કરો.",
    cardHint: "વિગતો, ઇતિહાસ અને દિશા જોવા માટે ટેપ કરો.",
    historyHeading: "ઈતિહાસ",
    historyBack: "પાછા જાઓ",
    closeModal: "મોડલ બંધ કરો"
  }
};

const places = Array.isArray(window.PLACE_CONTENT) ? window.PLACE_CONTENT : [];

const fallbackLanguage = "en";
let selectedLanguage = getStoredLanguage();
let activePlace = null;
let modalMode = "actions";

document.addEventListener("DOMContentLoaded", () => {
  // Apply saved language first so the correct copy is shown immediately.
  applyTranslations(selectedLanguage);
  initializeLandingPage();
  initializePlacesPage();
});

function initializeLandingPage() {
  const select = document.getElementById("languageSelect");
  const continueBtn = document.getElementById("continueBtn");

  if (!select || !continueBtn) {
    return;
  }

  select.value = selectedLanguage;

  select.addEventListener("change", (event) => {
    selectedLanguage = normalizeLanguage(event.target.value);
    persistLanguage(selectedLanguage);
    applyTranslations(selectedLanguage);
  });

  continueBtn.addEventListener("click", () => {
    persistLanguage(selectedLanguage);
    const nextUrl = new URL("places.html", window.location.href);
    nextUrl.searchParams.set("lang", selectedLanguage);
    window.location.href = nextUrl.toString();
  });
}

function initializePlacesPage() {
  const grid = document.getElementById("placesGrid");
  const modal = document.getElementById("placeModal");

  if (!grid || !modal) {
    return;
  }

  const languageFromUrl = new URLSearchParams(window.location.search).get("lang");
  selectedLanguage = normalizeLanguage(languageFromUrl || selectedLanguage);
  persistLanguage(selectedLanguage);
  applyTranslations(selectedLanguage);
  renderPlaceCards();
  setupModal();
}

function renderPlaceCards() {
  const grid = document.getElementById("placesGrid");

  if (!grid) {
    return;
  }

  const languagePack = translations[selectedLanguage];

  // Card content is generated from one data source so translations stay aligned.
  grid.innerHTML = places.map((place) => `
    <article class="place-card fade-up" data-place-id="${place.id}" tabindex="0" role="button" aria-label="${place.name[selectedLanguage]}">
      <img class="place-card__image" src="${place.image}" alt="${place.name[selectedLanguage]}">
      <div class="place-card__body">
        <h2 class="place-card__title">${place.name[selectedLanguage]}</h2>
        <p class="place-card__subtitle">${languagePack.cardHint}</p>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".place-card").forEach((card) => {
    card.addEventListener("click", () => openPlaceModal(card.dataset.placeId));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPlaceModal(card.dataset.placeId);
      }
    });
  });
}

function setupModal() {
  const modal = document.getElementById("placeModal");
  const closeBtn = document.getElementById("modalClose");

  if (!modal || !closeBtn) {
    return;
  }

  closeBtn.setAttribute("aria-label", translations[selectedLanguage].closeModal);

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.closeModal === "true") {
      closeModal();
      return;
    }

    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    if (event.target.matches("[data-action='history']")) {
      modalMode = "history";
      renderModalContent();
    }

    if (event.target.matches("[data-action='directions']")) {
      openDirections();
    }

    if (event.target.matches("[data-action='back']")) {
      modalMode = "actions";
      renderModalContent();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

function openPlaceModal(placeId) {
  activePlace = places.find((place) => place.id === placeId) || null;

  if (!activePlace) {
    return;
  }

  modalMode = "actions";
  renderModalContent();

  const modal = document.getElementById("placeModal");
  if (!modal) {
    return;
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("placeModal");
  if (!modal) {
    return;
  }

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function renderModalContent() {
  const modalContent = document.getElementById("modalContent");

  if (!modalContent || !activePlace) {
    return;
  }

  const languagePack = translations[selectedLanguage];
  const placeName = activePlace.name[selectedLanguage];
  const historySections = activePlace.historySections[selectedLanguage] || [];

  if (modalMode === "history") {
    modalContent.innerHTML = `
      <h2 id="modalTitle" class="modal__title">${placeName}</h2>
      <div class="history-stack">
        ${historySections.map((section) => formatHistorySection(section)).join("")}
      </div>
      <div class="modal__actions">
        <button class="btn btn--secondary" type="button" data-action="back">${languagePack.historyBack}</button>
        <button class="btn btn--primary" type="button" data-action="directions">${languagePack.getDirections}</button>
      </div>
    `;
    return;
  }

  modalContent.innerHTML = `
    <h2 id="modalTitle" class="modal__title">${placeName}</h2>
    <p class="modal__text">${languagePack.modalPrompt}</p>
    <div class="modal__actions">
      <button class="btn btn--secondary" type="button" data-action="history">${languagePack.viewHistory}</button>
      <button class="btn btn--primary" type="button" data-action="directions">${languagePack.getDirections}</button>
    </div>
  `;
}

function openDirections() {
  if (!activePlace) {
    return;
  }

  window.open(activePlace.query, "_blank", "noopener");
}

function applyTranslations(language) {
  const normalizedLanguage = normalizeLanguage(language);
  const languagePack = translations[normalizedLanguage];

  document.documentElement.lang = normalizedLanguage;
  document.body.dataset.language = normalizedLanguage;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (languagePack[key]) {
      element.textContent = languagePack[key];
    }
  });

  const closeBtn = document.getElementById("modalClose");
  if (closeBtn) {
    closeBtn.setAttribute("aria-label", languagePack.closeModal);
  }

  if (document.getElementById("placesGrid")) {
    renderPlaceCards();
    if (activePlace) {
      renderModalContent();
    }
  }
}

function getStoredLanguage() {
  const languageFromUrl = new URLSearchParams(window.location.search).get("lang");
  return normalizeLanguage(languageFromUrl || localStorage.getItem("nashikDarshanLanguage") || fallbackLanguage);
}

function persistLanguage(language) {
  localStorage.setItem("nashikDarshanLanguage", normalizeLanguage(language));
}

function normalizeLanguage(language) {
  return translations[language] ? language : fallbackLanguage;
}

function formatHistorySection(section) {
  const trimmed = section.trim();
  const match = trimmed.match(/^([^:]{1,60}):\s*(.*)$/);

  if (!match) {
    return `<div class="history-section"><p class="history-section__body">${escapeHtml(trimmed)}</p></div>`;
  }

  const [, title, body] = match;
  return `
    <section class="history-section">
      <h3 class="history-section__title">${escapeHtml(title.trim())}</h3>
      <p class="history-section__body">${escapeHtml(body.trim())}</p>
    </section>
  `;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
