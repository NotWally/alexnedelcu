const CONFIG = {
  PASSWORD: "T&A08!",
  STORAGE_KEY: "natflix-watched-v4",
  TOAST_MS: 2200,
  DEFAULT_POSTER: "https://dummyimage.com/600x900/2b2027/fff4fb&text=Poster",
  HERO_ROTATE_MS: 5500,
  HERO_PREVIEW_COUNT: 3,
  HERO_RECENT_LIMIT: 8,
  HERO_HISTORY_LIMIT: 18,
  SPLASH_MIN_MS: 1350,
  SECRET_CLICK_COUNT: 3,
  GENRE_ORDER: [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Drama",
    "Family",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Romcom",
    "Sci-Fi",
    "Thriller"
  ]
};

const appState = {
  movies: [],
  selectedGenre: "All",
  searchQuery: "",
  activeMovieId: null,
  heroActiveId: null,
  heroRecentIds: [],
  heroHistoryIds: [],
  secretBrandClicks: 0,
  pendingWatchMovieId: null,
  watchedMap: loadWatchedMap()
};

const els = {
  searchInput: document.getElementById("searchInput"),
  genreFilter: document.getElementById("genreFilter"),
  quickFilters: document.getElementById("quickFilters"),
  rowsContainer: document.getElementById("rowsContainer"),
  resultsSummary: document.getElementById("resultsSummary"),
  resetFiltersBtn: document.getElementById("resetFiltersBtn"),
  detailsModal: document.getElementById("detailsModal"),
  modalContent: document.getElementById("modalContent"),
  closeDetailsBtn: document.getElementById("closeDetailsBtn"),
  passwordModal: document.getElementById("passwordModal"),
  closePasswordBtn: document.getElementById("closePasswordBtn"),
  watchForm: document.getElementById("watchForm"),
  watchPassword: document.getElementById("watchPassword"),
  toast: document.getElementById("toast"),
  heroSection: document.getElementById("heroSection"),
  heroEyebrow: document.getElementById("heroEyebrow"),
  heroTitle: document.getElementById("heroTitle"),
  heroText: document.getElementById("heroText"),
  heroMeta: document.getElementById("heroMeta"),
  heroSubline: document.getElementById("heroSubline"),
  heroPosterBtn: document.getElementById("heroPosterBtn"),
  heroPoster: document.getElementById("heroPoster"),
  heroPosterBadge: document.getElementById("heroPosterBadge"),
  heroDetailsBtn: document.getElementById("heroDetailsBtn"),
  heroRandomBtn: document.getElementById("heroRandomBtn"),
  heroTashaBtn: document.getElementById("heroTashaBtn"),
  heroPrevBtn: document.getElementById("heroPrevBtn"),
  heroNextBtn: document.getElementById("heroNextBtn"),
  heroMiniList: document.getElementById("heroMiniList"),
  heroMiniLabel: document.getElementById("heroMiniLabel"),
  splashScreen: document.getElementById("splashScreen"),
  brandLogo: document.getElementById("brandLogo"),
  brandPill: document.getElementById("brandPill"),
  footerMessage: document.getElementById("footerMessage"),
  heartBurst: document.getElementById("heartBurst"),
  secretNoteModal: document.getElementById("secretNoteModal"),
  closeSecretBtn: document.getElementById("closeSecretBtn"),
  secretNoteTitle: document.getElementById("secretNoteTitle"),
  secretNoteBody: document.getElementById("secretNoteBody")
};

let heroRotationTimer = null;
let brandClickTimer = null;

const SECRET_NOTES = [
  {
    title: "For you",
    body: "I made this for you because I wanted our movie nights to feel like their own little world."
  },
  {
    title: "A small truth",
    body: "No matter what we end up watching, you always make the night better."
  },
  {
    title: "In case you found this",
    body: "I hid little things in here for you because making you smile felt like a good enough reason."
  },
  {
    title: "One more thing",
    body: "If this feels cosy or a bit romantic, that is me trying to build something that feels like us."
  },
  {
    title: "Just so you know",
    body: "Even with all these films, you are still the reason this feels fun."
  }
];

const SWEET_TOASTS = [
  "I added that one to our story ♡",
  "That one is ours now.",
  "That was a good one for us.",
  "I’m counting that as a very good choice by us."
];

const SEARCH_EGGS = {
  tasha: {
    title: "Hi Tasha",
    body: "If you found this by typing your name, that makes me very happy. I put this here just for you."
  }
};

// duplicate removed


document.addEventListener("DOMContentLoaded", init);
window.addEventListener("storage", handleStorageSync);

async function init() {
  const splashDelay = wait(CONFIG.SPLASH_MIN_MS);
  document.body.classList.add("splash-active");

  try {
    bindUI();
    await loadMovies();
    populateGenreFilter();
    renderQuickFilters();
    render();
  } catch (error) {
    console.error("NATFLIX init failed:", error);
  } finally {
    await splashDelay;
    hideSplash();
  }
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function hideSplash() {
  if (!els.splashScreen) return;
  els.splashScreen.classList.add("is-hidden");
  document.body.classList.remove("splash-active");
}

function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function launchHeartBurst(count = 14) {
  if (!els.heartBurst) return;

  const hearts = ["♡", "♥", "✦"];
  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("span");
    particle.className = "heart-particle";
    particle.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    particle.style.left = `${6 + Math.random() * 88}%`;
    particle.style.animationDelay = `${Math.random() * 220}ms`;
    particle.style.fontSize = `${12 + Math.random() * 12}px`;
    particle.style.color = Math.random() > 0.25 ? "#ff7aa4" : "#ffd7e5";
    els.heartBurst.appendChild(particle);
    window.setTimeout(() => particle.remove(), 1600);
  }
}

function openSecretNote(note = null) {
  const chosenNote = note || getRandomItem(SECRET_NOTES);
  els.secretNoteTitle.textContent = chosenNote.title;
  els.secretNoteBody.textContent = chosenNote.body;
  els.secretNoteModal.classList.remove("hidden");
  els.secretNoteModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeSecretNote() {
  els.secretNoteModal.classList.add("hidden");
  els.secretNoteModal.setAttribute("aria-hidden", "true");
  maybeUnlockBody();
}

function revealFooterMessage() {
  if (!els.footerMessage) return;
  const original = "Made by Alex for Tasha… and a few secrets";
  els.footerMessage.textContent = "P.S. I still think you make this better.";
  launchHeartBurst(10);
  clearTimeout(revealFooterMessage._timer);
  revealFooterMessage._timer = window.setTimeout(() => {
    els.footerMessage.textContent = original;
  }, 3600);
}

function maybeTriggerSearchEgg(query) {
  const normalized = String(query || "").trim().toLowerCase();
  if (!normalized) return false;

  const egg = SEARCH_EGGS[normalized];
  if (!egg) return false;

  openSecretNote(egg);
  launchHeartBurst(12);
  showToast("I left that one there for you.");
  return true;
}

function bindUI() {
  let searchDebounce;

  els.searchInput.addEventListener("input", () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      const attemptedQuery = els.searchInput.value.trim();

      if (maybeTriggerSearchEgg(attemptedQuery)) {
        appState.searchQuery = "";
        els.searchInput.value = "";
        render();
        return;
      }

      appState.searchQuery = attemptedQuery;
      render();
    }, 120);
  });

  els.genreFilter.addEventListener("change", () => {
    appState.selectedGenre = els.genreFilter.value;
    renderQuickFilters();
    render();
  });

  els.quickFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-genre-chip]");
    if (!button) return;
    const value = button.dataset.genreChip;
    appState.selectedGenre = value;
    els.genreFilter.value = value;
    renderQuickFilters();
    render();
  });

  els.resetFiltersBtn.addEventListener("click", () => {
    appState.searchQuery = "";
    appState.selectedGenre = "All";
    els.searchInput.value = "";
    els.genreFilter.value = "All";
    renderQuickFilters();
    render();
  });

  els.brandLogo.addEventListener("click", () => {
    appState.secretBrandClicks += 1;
    clearTimeout(brandClickTimer);
    brandClickTimer = window.setTimeout(() => {
      appState.secretBrandClicks = 0;
    }, 1500);

    if (appState.secretBrandClicks >= CONFIG.SECRET_CLICK_COUNT) {
      appState.secretBrandClicks = 0;
      openSecretNote({
        title: "You found one",
        body: "I hid this in the logo because I liked the idea of you discovering it by accident."
      });
      launchHeartBurst(16);
      showToast("I left a secret there for you.");
    }
  });

  els.brandLogo.addEventListener("dblclick", () => {
    openSecretNote({
      title: "For Tasha",
      body: "I made this site to feel like a little place that belongs to us."
    });
    launchHeartBurst(12);
  });

  els.brandPill.addEventListener("click", () => {
    openSecretNote({
      title: "Movie night",
      body: "I wanted this to feel like our own tiny cinema, except softer and a bit more us."
    });
    launchHeartBurst(10);
  });

  if (els.heroTashaBtn) {
    els.heroTashaBtn.addEventListener("click", () => {
      openSecretNote({
        title: "For Tasha",
        body: "If I could add one thing to every film on here, it would be the fact that I get to watch them with you."
      });
      launchHeartBurst(14);
    });
  }

  els.footerMessage.addEventListener("click", () => {
    openSecretNote({
      title: "One more thing",
      body: "The footer says I made this for you, but the real part is that I wanted this to make you smile every time you opened it."
    });
  });

  els.footerMessage.addEventListener("dblclick", revealFooterMessage);

  if (els.closeSecretBtn) els.closeSecretBtn.addEventListener("click", closeSecretNote);

  els.heroDetailsBtn.addEventListener("click", () => {
    if (appState.heroActiveId) openDetailsModal(appState.heroActiveId);
  });

  els.heroPosterBtn.addEventListener("click", () => {
    if (appState.heroActiveId) openDetailsModal(appState.heroActiveId);
  });

  els.heroRandomBtn.addEventListener("click", pickRandomHero);
  els.heroPrevBtn.addEventListener("click", () => shiftHero(-1));
  els.heroNextBtn.addEventListener("click", () => shiftHero(1));

  els.heroMiniList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-hero-pick]");
    if (!button) return;
    setHeroMovie(button.dataset.heroPick, { announce: true });
  });

  els.closeDetailsBtn.addEventListener("click", closeDetailsModal);
  els.closePasswordBtn.addEventListener("click", closePasswordModal);

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (target.matches("[data-close-modal='true']")) closeDetailsModal();
    if (target.matches("[data-close-password='true']")) closePasswordModal();
    if (target.matches("[data-close-secret='true']")) closeSecretNote();

    const watchButton = target.closest("[data-action='mark-watched']");
    if (watchButton) {
      event.stopPropagation();
      appState.pendingWatchMovieId = watchButton.dataset.movieId;
      openPasswordModal();
      return;
    }

    const unwatchButton = target.closest("[data-action='mark-unwatched']");
    if (unwatchButton) {
      event.stopPropagation();
      markMovieUnwatched(unwatchButton.dataset.movieId);
      closeDetailsModal();
      render();
      showToast("Back on the list.");
      return;
    }

    const card = target.closest(".movie-card");
    if (card && !card.classList.contains("disabled")) {
      openDetailsModal(card.dataset.movieId);
    }
  });

  document.addEventListener("pointermove", handleCardTilt);
  document.addEventListener("pointerout", (event) => {
    const card = event.target.closest(".movie-card");
    if (card && !card.contains(event.relatedTarget)) resetCardTilt(card);
  });
  document.addEventListener("pointerleave", resetAllCardTilts);

  els.watchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!appState.pendingWatchMovieId) return;

    if (els.watchPassword.value !== CONFIG.PASSWORD) {
      showToast("That password didn’t match.");
      return;
    }

    markMovieWatched(appState.pendingWatchMovieId);
    closePasswordModal();
    closeDetailsModal();
    render();
    showToast(getRandomItem(SWEET_TOASTS));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSecretNote();
      closePasswordModal();
      closeDetailsModal();
    }

    const activeTag = document.activeElement?.tagName || "";
    const typingIntoField = ["INPUT", "TEXTAREA"].includes(activeTag);

    if ((event.altKey && event.key.toLowerCase() === "t") || (!typingIntoField && event.key.toLowerCase() === "t")) {
      openSecretNote({
        title: "You pressed T",
        body: "That one really is just for you."
      });
      launchHeartBurst(10);
    }
  });
}

async function loadMovies() {
  try {
    const response = await fetch("films.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`films.json could not be loaded (${response.status})`);
    const raw = await response.json();
    const list = Array.isArray(raw) ? raw : raw.movies;
    if (!Array.isArray(list)) throw new Error("films.json is not in the expected format.");
    appState.movies = list.map(normalizeMovie).filter(Boolean);
  } catch (error) {
    console.error(error);
    appState.movies = [];
    els.resultsSummary.textContent = "Couldn’t load your film list.";
    els.rowsContainer.innerHTML = `
      <div class="empty-page">
        <h3>Couldn’t load the film list</h3>
        <p>Make sure <strong>films.json</strong> is in the same folder as the website and open the site through a simple local server.</p>
      </div>
    `;
  }
}

function normalizeMovie(movie) {
  if (!movie || !movie.title) return null;

  const genres = normalizeGenres(movie.genres || []);
  const year = movie.year ? String(movie.year) : "—";

  return {
    id: movie.id || buildMovieId(movie.title, year),
    title: String(movie.title),
    year,
    genres,
    primaryGenre: genres[0] || "Drama",
    description: movie.description || "No description yet.",
    rtRating: movie.rtRating || "N/A",
    poster: movie.poster || CONFIG.DEFAULT_POSTER,
    runtime: movie.runtime || "Runtime not added",
    certificate: movie.certificate || "Certificate not added",
    availability: normalizeAvailability(movie.availability)
  };
}

function normalizeGenres(genres) {
  const list = Array.isArray(genres) ? genres.map((item) => String(item).trim()).filter(Boolean) : [];
  const hasRomance = list.includes("Romance");
  const hasComedy = list.includes("Comedy");
  if (hasRomance && hasComedy && !list.includes("Romcom")) list.push("Romcom");
  return [...new Set(list)];
}

function normalizeAvailability(availability = {}) {
  return {
    netflix: availability.netflix || "Not listed",
    amazon: availability.amazon || "Not listed",
    disney: availability.disney || "Not listed",
    other: Array.isArray(availability.other) && availability.other.length ? availability.other : ["Not listed"]
  };
}

function buildMovieId(title, year) {
  return `${title}-${year}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/(^-|-$)/g, "");
}

function populateGenreFilter() {
  const genreList = getVisibleGenreList();
  els.genreFilter.innerHTML = `
    <option value="All">All genres</option>
    ${genreList.map((genre) => `<option value="${escapeHtml(genre)}">${escapeHtml(genre)}</option>`).join("")}
  `;
  els.genreFilter.value = appState.selectedGenre;
}

function getVisibleGenreList() {
  const primaryGenres = appState.movies.map((movie) => movie.primaryGenre).filter(Boolean);
  const merged = [...CONFIG.GENRE_ORDER, ...primaryGenres];
  return [...new Set(merged)].filter(Boolean);
}

function renderQuickFilters() {
  const chips = ["All", ...getVisibleGenreList().filter((genre) => ["Romcom", "Comedy", "Drama", "Horror", "Action", "Thriller"].includes(genre))];

  els.quickFilters.innerHTML = chips.map((genre) => `
    <button
      type="button"
      class="quick-chip ${appState.selectedGenre === genre ? "is-active" : ""}"
      data-genre-chip="${escapeHtml(genre)}"
    >
      ${escapeHtml(genre)}
    </button>
  `).join("");
}

function getFilteredMovies() {
  const query = appState.searchQuery.toLowerCase().trim();

  return appState.movies.filter((movie) => {
    const matchesGenre = appState.selectedGenre === "All" || movie.primaryGenre === appState.selectedGenre;
    const matchesQuery = !query ||
      movie.title.toLowerCase().includes(query) ||
      movie.description.toLowerCase().includes(query) ||
      movie.genres.some((genre) => genre.toLowerCase().includes(query));

    return matchesGenre && matchesQuery;
  });
}

function render() {
  const filtered = getFilteredMovies();
  renderSummary(filtered);
  renderHero(filtered);
  renderRows(filtered);
}

function renderSummary(filtered) {
  const genreText = appState.selectedGenre === "All" ? "all genres" : appState.selectedGenre;

  if (appState.searchQuery) {
    els.resultsSummary.textContent = `${filtered.length} film${filtered.length === 1 ? "" : "s"} matching “${appState.searchQuery}”.`;
  } else {
    els.resultsSummary.textContent = `${filtered.length} film${filtered.length === 1 ? "" : "s"} in ${genreText}.`;
  }
}

function getHeroCandidates(filtered) {
  const hasScopedView = Boolean(appState.searchQuery.trim()) || appState.selectedGenre !== "All";
  const pool = filtered.length ? filtered : hasScopedView ? [] : appState.movies;
  const unwatched = pool.filter((movie) => !appState.watchedMap[movie.id]);
  return unwatched.length ? unwatched : pool;
}

function shuffleArray(items) {
  const clone = [...items];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }
  return clone;
}

function getRecentHeroIds(candidates, limit = CONFIG.HERO_RECENT_LIMIT) {
  const candidateIds = new Set(candidates.map((movie) => movie.id));
  return appState.heroRecentIds.filter((id) => candidateIds.has(id)).slice(0, limit);
}

function rememberHero(id, { addToHistory = true } = {}) {
  if (!id) return;

  appState.heroRecentIds = [id, ...appState.heroRecentIds.filter((item) => item !== id)]
    .slice(0, CONFIG.HERO_RECENT_LIMIT);

  if (!addToHistory) return;

  appState.heroHistoryIds = [...appState.heroHistoryIds, id]
    .slice(-CONFIG.HERO_HISTORY_LIMIT);
}

function chooseRandomHero(candidates, { excludeId = null, avoidRecent = true } = {}) {
  if (!candidates.length) return null;

  let pool = candidates.filter((movie) => movie.id !== excludeId);

  if (!pool.length) {
    pool = [...candidates];
  }

  if (avoidRecent && pool.length > 2) {
    const recent = new Set(
      getRecentHeroIds(
        candidates,
        Math.min(CONFIG.HERO_RECENT_LIMIT, Math.max(1, pool.length - 1))
      )
    );
    const freshPool = pool.filter((movie) => !recent.has(movie.id));
    if (freshPool.length) {
      pool = freshPool;
    }
  }

  return shuffleArray(pool)[0] || null;
}

function setHeroMovie(movieId, { restart = true, addToHistory = true, announce = false } = {}) {
  const movie = appState.movies.find((item) => item.id === movieId);
  if (!movie) return;

  appState.heroActiveId = movie.id;
  rememberHero(movie.id, { addToHistory });
  renderHero(getFilteredMovies(), restart);

  if (announce) {
    showToast(`Now featuring: ${movie.title}`);
  }
}

function getActiveHeroMovie(candidates) {
  if (!candidates.length) return null;

  const existing = candidates.find((movie) => movie.id === appState.heroActiveId);
  if (existing) {
    rememberHero(existing.id, { addToHistory: false });
    return existing;
  }

  const picked = chooseRandomHero(candidates, { avoidRecent: true }) || candidates[0];
  appState.heroActiveId = picked.id;
  rememberHero(picked.id, { addToHistory: false });
  return picked;
}

function restartHeroRotation(candidates) {
  clearInterval(heroRotationTimer);
  heroRotationTimer = null;

  if (candidates.length <= 1) return;

  heroRotationTimer = window.setInterval(() => {
    shiftHero(1, false);
  }, CONFIG.HERO_ROTATE_MS);
}

function shiftHero(direction, restart = true) {
  const candidates = getHeroCandidates(getFilteredMovies());
  if (!candidates.length) return;

  if (direction < 0) {
    const currentId = appState.heroActiveId;
    const validHistory = appState.heroHistoryIds
      .filter((id) => id !== currentId)
      .filter((id) => candidates.some((movie) => movie.id === id));

    const previousId = validHistory.length ? validHistory[validHistory.length - 1] : null;

    if (previousId) {
      const lastIndex = appState.heroHistoryIds.lastIndexOf(previousId);
      if (lastIndex >= 0) {
        appState.heroHistoryIds.splice(lastIndex, 1);
      }
      setHeroMovie(previousId, { restart, addToHistory: false });
      return;
    }
  }

  const nextMovie =
    chooseRandomHero(candidates, { excludeId: appState.heroActiveId, avoidRecent: true }) ||
    chooseRandomHero(candidates, { excludeId: appState.heroActiveId, avoidRecent: false }) ||
    candidates[0];

  setHeroMovie(nextMovie.id, { restart, addToHistory: true });
}

function pickRandomHero() {
  const candidates = getHeroCandidates(getFilteredMovies());
  if (!candidates.length) return;

  const choice =
    chooseRandomHero(candidates, { excludeId: appState.heroActiveId, avoidRecent: true }) ||
    chooseRandomHero(candidates, { excludeId: appState.heroActiveId, avoidRecent: false }) ||
    candidates[0];

  setHeroMovie(choice.id, { announce: true });
}

function getHeroAvailabilityLabel(availability) {
  if (isActuallyListed(availability.netflix)) return "Netflix";
  if (isActuallyListed(availability.amazon)) return "Amazon";
  if (isActuallyListed(availability.disney)) return "Disney+";

  const other = (availability.other || []).find(isActuallyListed);
  return other || "Watch info soon";
}

function renderHero(filtered, restartRotation = true) {
  const candidates = getHeroCandidates(filtered);
  const featured = getActiveHeroMovie(candidates);

  if (!featured) {
    clearInterval(heroRotationTimer);
    els.heroSection.style.setProperty("--hero-image", "none");
    els.heroEyebrow.textContent = "Tonight's pick";
    els.heroTitle.textContent = "Nothing to see here yet.";
    els.heroText.textContent = "Add a few films to films.json and they’ll appear here.";
    els.heroMeta.innerHTML = "";
    els.heroSubline.textContent = "";
    els.heroMiniLabel.textContent = "Add a few films";
    els.heroMiniList.innerHTML = `<div class="hero-empty-note">Nothing to choose from yet.</div>`;
    els.heroPoster.src = CONFIG.DEFAULT_POSTER;
    els.heroPoster.alt = "No film selected";
    els.heroPosterBadge.textContent = "Waiting for picks";
    return;
  }

  const scoped = Boolean(appState.searchQuery.trim()) || appState.selectedGenre !== "All";
  const unwatchedInView = filtered.filter((movie) => !appState.watchedMap[movie.id]).length;
  const unwatchedOverall = appState.movies.filter((movie) => !appState.watchedMap[movie.id]).length;
  const rewatchMode = candidates.every((movie) => appState.watchedMap[movie.id]);
  const previewPool = candidates.filter((movie) => movie.id !== featured.id);
  const recentPreviewIds = new Set(getRecentHeroIds(candidates, Math.ceil(CONFIG.HERO_RECENT_LIMIT / 2)));
  const fresherPreviewPool = previewPool.filter((movie) => !recentPreviewIds.has(movie.id));
  const previewSource = fresherPreviewPool.length >= CONFIG.HERO_PREVIEW_COUNT ? fresherPreviewPool : previewPool;
  const preview = shuffleArray(previewSource).slice(0, CONFIG.HERO_PREVIEW_COUNT);

  els.heroSection.style.setProperty("--hero-image", `url("${featured.poster}")`);
  els.heroEyebrow.textContent = rewatchMode ? "Rewatch pick" : "Tonight's pick";
  els.heroTitle.textContent = featured.title;
  els.heroText.textContent = featured.description;
  els.heroPoster.src = featured.poster;
  els.heroPoster.alt = `${featured.title} poster`;
  els.heroPosterBadge.textContent = appState.watchedMap[featured.id] ? "Watched" : "Unwatched";

  els.heroMeta.innerHTML = [
    featured.primaryGenre,
    featured.runtime,
    `🍅 ${featured.rtRating}`,
    getHeroAvailabilityLabel(featured.availability)
  ].map((value) => `<span class="hero-meta-chip">${escapeHtml(value)}</span>`).join("");

  const hiddenHeroLine = getRandomItem([
    "I made this little corner of the internet for you.",
    "I’m quietly rooting for a very good movie night for us.",
    "I wanted this to feel like our own small thing."
  ]);

  els.heroSubline.textContent = scoped
    ? `${unwatchedInView} unwatched in this view. ${hiddenHeroLine}`
    : `${unwatchedOverall} still left to watch. ${hiddenHeroLine}`;

  els.heroMiniLabel.textContent = rewatchMode ? "Everything here is watched" : "Tap a card to swap";

  els.heroMiniList.innerHTML = preview.length
    ? preview.map((movie) => `
      <button
        type="button"
        class="hero-mini-card"
        data-hero-pick="${escapeHtml(movie.id)}"
        aria-label="Show ${escapeAttribute(movie.title)}"
      >
        <img src="${escapeAttribute(movie.poster)}" alt="${escapeAttribute(movie.title)} poster" loading="lazy" />
        <div class="hero-mini-copy">
          <strong>${escapeHtml(movie.title)}</strong>
          <span>${escapeHtml(movie.primaryGenre)} · ${escapeHtml(movie.year)}</span>
        </div>
      </button>
    `).join("")
    : `<div class="hero-empty-note">This is the only pick in view right now.</div>`;

  if (restartRotation) {
    restartHeroRotation(candidates);
  }
}

function renderRows(filtered) {
  const allGenres = getVisibleGenreList();
  const queryActive = Boolean(appState.searchQuery.trim());

  const genresToRender = appState.selectedGenre !== "All"
    ? [appState.selectedGenre]
    : queryActive
      ? allGenres.filter((genre) => filtered.some((movie) => movie.primaryGenre === genre))
      : allGenres;

  if (!genresToRender.length) {
    els.rowsContainer.innerHTML = `
      <div class="empty-page">
        <h3>Nothing to see here yet!</h3>
        <p>Try a different search or clear the filter.</p>
      </div>
    `;
    return;
  }

  els.rowsContainer.innerHTML = genresToRender.map((genre) => {
    const genreMovies = filtered.filter((movie) => movie.primaryGenre === genre);

    return `
      <section class="genre-row">
        <div class="row-heading">
          <h3>${escapeHtml(genre)}</h3>
          <p>${genreMovies.length ? `${genreMovies.length} title${genreMovies.length === 1 ? "" : "s"}` : "Nothing to see here yet!"}</p>
        </div>

        ${
          genreMovies.length
            ? `<div class="card-rail">${genreMovies.map(renderMovieCard).join("")}</div>`
            : `<div class="empty-slot">Nothing to see here yet.</div>`
        }
      </section>
    `;
  }).join("");
}

function renderMovieCard(movie) {
  const watched = appState.watchedMap[movie.id];

  return `
    <button
      class="movie-card ${watched ? "disabled" : ""}"
      type="button"
      data-movie-id="${escapeHtml(movie.id)}"
      aria-label="${escapeHtml(movie.title)}"
    >
      <div class="poster-wrap">
        <img src="${escapeAttribute(movie.poster)}" alt="${escapeAttribute(`${movie.title} poster`)}" loading="lazy" />

        <div class="card-badges">
          <span class="badge rt">🍅 ${escapeHtml(movie.rtRating)}</span>
          <span class="badge">${escapeHtml(shortAvailability(movie.availability))}</span>
        </div>

        <div class="card-bottom">
          <h4 class="card-title">${escapeHtml(movie.title)}</h4>
          <div class="card-sub">
            <span>${escapeHtml(movie.year)}</span>
            <span>${escapeHtml(movie.primaryGenre)}</span>
          </div>
        </div>

        ${watched ? renderWatchedOverlay(watched.watchedAt) : ""}
      </div>
    </button>
  `;
}

function shortAvailability(availability) {
  if (String(availability.netflix).toLowerCase().includes("included")) return "Netflix";
  if (String(availability.disney).toLowerCase().includes("included")) return "Disney+";
  if (String(availability.amazon).toLowerCase().includes("included")) return "Prime";
  if (String(availability.amazon).toLowerCase().includes("purchase")) return "Amazon";
  return "Streaming varies";
}

function renderWatchedOverlay(isoDate) {
  return `
    <div class="watched-overlay">
      <div class="watched-overlay-inner">
        <span class="watched-label">WATCHED</span>
        <span class="watched-time">${escapeHtml(formatWatchedDate(isoDate))}</span>
      </div>
    </div>
  `;
}

function openDetailsModal(movieId) {
  const movie = appState.movies.find((item) => item.id === movieId);
  if (!movie) return;

  const watched = appState.watchedMap[movie.id];
  appState.activeMovieId = movie.id;

  els.modalContent.innerHTML = `
    <div class="modal-poster">
      <img src="${escapeAttribute(movie.poster)}" alt="${escapeAttribute(`${movie.title} poster`)}" />
    </div>

    <div class="modal-details">
      <div class="modal-title-row">
        <div>
          <h2 class="modal-title">${escapeHtml(movie.title)}</h2>
          <div class="modal-year">${escapeHtml(movie.year)}</div>
        </div>

        <div class="rating-line">
          <span class="rating-pill">🍅 Rotten Tomatoes: ${escapeHtml(movie.rtRating)}</span>
        </div>
      </div>

      <div class="detail-stack">
        <div>
          <div class="section-title">About</div>
          <p class="description">${escapeHtml(movie.description)}</p>
        </div>

        <div>
          <div class="section-title">Genres</div>
          <div class="genre-tags">
            ${movie.genres.map((genre) => `<span class="genre-pill">${escapeHtml(genre)}</span>`).join("")}
          </div>
        </div>

        <div>
          <div class="section-title">Details</div>
          <div class="meta-line">
            <span class="meta-pill">${escapeHtml(movie.runtime)}</span>
            <span class="meta-pill">${escapeHtml(movie.certificate)}</span>
          </div>
        </div>

        <div class="provider-section">
          <h4>Where to watch</h4>
          ${renderAvailabilitySection(movie)}
        </div>

        <div class="watch-actions">
          ${
            watched
              ? `
                <span class="meta-pill">Watched on ${escapeHtml(formatWatchedDate(watched.watchedAt))}</span>
                <button type="button" class="secondary-btn" data-action="mark-unwatched" data-movie-id="${escapeHtml(movie.id)}">Mark as unwatched</button>
              `
              : `<button type="button" class="watch-btn" data-action="mark-watched" data-movie-id="${escapeHtml(movie.id)}">Watched</button>`
          }
        </div>
      </div>
    </div>
  `;

  els.detailsModal.classList.remove("hidden");
  els.detailsModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function renderAvailabilitySection(movie) {
  const listedProviders = [];

  const addProvider = (label, value) => {
    if (!isActuallyListed(value)) return;
    listedProviders.push(
      `<span class="provider-pill ${providerClass(value)}">${escapeHtml(label)}: ${escapeHtml(value)}</span>`
    );
  };

  addProvider("Netflix", movie.availability.netflix);
  addProvider("Amazon", movie.availability.amazon);
  addProvider("Disney+", movie.availability.disney);

  const otherProviders = (movie.availability.other || [])
    .filter(isActuallyListed)
    .map((item) => `<span class="provider-pill">${escapeHtml(item)}</span>`);

  const allProviders = [...listedProviders, ...otherProviders];

  if (!allProviders.length) {
    return `<div class="empty-slot">Watch options haven’t been added yet.</div>`;
  }

  return `<div class="providers-grid">${allProviders.join("")}</div>`;
}

function isActuallyListed(value) {
  const lower = String(value || "").trim().toLowerCase();
  if (!lower) return false;

  const hiddenValues = new Set([
    "not listed",
    "not currently listed",
    "check local services",
    "availability unknown",
    "streaming varies"
  ]);

  return !hiddenValues.has(lower);
}

function providerClass(text) {
  const lower = String(text || "").toLowerCase();
  if (lower.includes("included")) return "included";
  if (lower.includes("purchase") || lower.includes("rental")) return "purchase";
  return "";
}

function closeDetailsModal() {
  appState.activeMovieId = null;
  els.detailsModal.classList.add("hidden");
  els.detailsModal.setAttribute("aria-hidden", "true");
  maybeUnlockBody();
}

function openPasswordModal() {
  els.watchPassword.value = "";
  els.passwordModal.classList.remove("hidden");
  els.passwordModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setTimeout(() => els.watchPassword.focus(), 20);
}

function closePasswordModal() {
  appState.pendingWatchMovieId = null;
  els.passwordModal.classList.add("hidden");
  els.passwordModal.setAttribute("aria-hidden", "true");
  maybeUnlockBody();
}

function maybeUnlockBody() {
  const detailsOpen = !els.detailsModal.classList.contains("hidden");
  const passwordOpen = !els.passwordModal.classList.contains("hidden");
  if (!detailsOpen && !passwordOpen) {
    document.body.style.overflow = "";
  }
}

function markMovieWatched(movieId) {
  appState.watchedMap[movieId] = {
    watchedAt: new Date().toISOString()
  };
  saveWatchedMap();
}

function markMovieUnwatched(movieId) {
  delete appState.watchedMap[movieId];
  saveWatchedMap();
}

function loadWatchedMap() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error("Could not read watched list.", error);
    return {};
  }
}

function saveWatchedMap() {
  try {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(appState.watchedMap));
  } catch (error) {
    console.error("Could not save watched list.", error);
  }
}

function handleStorageSync(event) {
  if (event.key !== CONFIG.STORAGE_KEY) return;
  appState.watchedMap = loadWatchedMap();
  render();
}

function handleCardTilt(event) {
  const card = event.target.closest(".movie-card");
  if (!card || card.classList.contains("disabled")) return;

  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const px = clamp(x / rect.width, 0, 1);
  const py = clamp(y / rect.height, 0, 1);

  const rotateY = (px - 0.5) * 16.1;
  const rotateX = (0.5 - py) * 16.1;

  card.style.setProperty("--ry", `${rotateY}deg`);
  card.style.setProperty("--rx", `${rotateX}deg`);
}

function resetCardTilt(card) {
  card.style.setProperty("--ry", "0deg");
  card.style.setProperty("--rx", "0deg");
}

function resetAllCardTilts() {
  document.querySelectorAll(".movie-card").forEach(resetCardTilt);
}

function formatWatchedDate(isoDate) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    els.toast.classList.add("hidden");
  }, CONFIG.TOAST_MS);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
