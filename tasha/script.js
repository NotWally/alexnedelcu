const CONFIG = {
  PASSWORD: "T&A08!",
  STORAGE_KEY: "natflix-watched-v5",
  EASTER_EGG_KEY: "natflix-easter-eggs-v1",
  TOAST_MS: 2200,
  TOTAL_EASTER_EGGS: 3,
  ACTIVE_EASTER_EGG_IDS: ["footer", "press_t", "search_tasha"],
  DEFAULT_POSTER: "https://dummyimage.com/600x900/2b2027/fff4fb&text=Poster",
  HERO_ROTATE_MS: 5500,
  HERO_PREVIEW_COUNT: 3,
  HERO_RECENT_LIMIT: 8,
  HERO_HISTORY_LIMIT: 18,
  SPLASH_MIN_MS: 1350,
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
    "Thriller",
  ],
};

const appState = {
  movies: [],
  selectedGenre: "All",
  selectedRuntime: "All",
  searchQuery: "",
  isSearchFocused: false,
  activeMovieId: null,
  heroActiveId: null,
  heroRecentIds: [],
  heroHistoryIds: [],
  heroQueue: [],
  heroQueueKey: "",
  heroActiveIndex: 0,
  pendingWatchMovieId: null,
  watchedMap: loadWatchedMap(),
  easterEggsFound: loadEasterEggMap(),
};

const els = {
  searchInput: document.getElementById("searchInput"),
  genreFilter: document.getElementById("genreFilter"),
  runtimeFilter: document.getElementById("runtimeFilter"),
  brandTease: document.getElementById("brandTease"),
  quickFilters: document.getElementById("quickFilters"),
  searchMode: document.getElementById("searchMode"),
  searchModeEyebrow: document.getElementById("searchModeEyebrow"),
  searchModeMessage: document.getElementById("searchModeMessage"),
  searchModeSubtext: document.getElementById("searchModeSubtext"),
  searchModeResults: document.getElementById("searchModeResults"),
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
  watchRating: document.getElementById("watchRating"),
  watchRatingValue: document.getElementById("watchRatingValue"),
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
  heroPrevBtn: document.getElementById("heroPrevBtn"),
  heroNextBtn: document.getElementById("heroNextBtn"),
  heroMiniList: document.getElementById("heroMiniList"),
  heroMiniLabel: document.getElementById("heroMiniLabel"),
  splashScreen: document.getElementById("splashScreen"),
  footerMessage: document.getElementById("footerMessage"),
  statsSection: document.getElementById("statsSection"),
  statsTease: document.getElementById("statsTease"),
  statsWatchTime: document.getElementById("statsWatchTime"),
  statsWatchTimeMeta: document.getElementById("statsWatchTimeMeta"),
  statsWatchedCount: document.getElementById("statsWatchedCount"),
  statsWatchedMeta: document.getElementById("statsWatchedMeta"),
  statsAverageTime: document.getElementById("statsAverageTime"),
  statsAverageMeta: document.getElementById("statsAverageMeta"),
  statsEggsFound: document.getElementById("statsEggsFound"),
  statsEggMeta: document.getElementById("statsEggMeta"),
  statsProgressValue: document.getElementById("statsProgressValue"),
  statsProgressBar: document.getElementById("statsProgressBar"),
  statsTopGenre: document.getElementById("statsTopGenre"),
  statsTopGenreMeta: document.getElementById("statsTopGenreMeta"),
  statsAverageRating: document.getElementById("statsAverageRating"),
  statsAverageRatingMeta: document.getElementById("statsAverageRatingMeta"),
  statsAchievements: document.getElementById("statsAchievements"),
  statsAchievementsSummary: document.getElementById("statsAchievementsSummary"),
  heartBurst: document.getElementById("heartBurst"),
  secretNoteModal: document.getElementById("secretNoteModal"),
  closeSecretBtn: document.getElementById("closeSecretBtn"),
  secretNoteTitle: document.getElementById("secretNoteTitle"),
  secretNoteBody: document.getElementById("secretNoteBody"),
};

let heroRotationTimer = null;
let heroRefreshTimer = null;
let revealObserver = null;

const SECRET_NOTES = [
  {
    title: "For you",
    body: "I made this for you because I wanted our movie nights to feel like their own little world.",
  },
  {
    title: "A small truth",
    body: "No matter what we end up watching, you always make the night better.",
  },
  {
    title: "In case you found this",
    body: "I hid little things in here for you because making you smile felt like a good enough reason.",
  },
  {
    title: "One more thing",
    body: "If this feels cosy or a bit romantic, that is me trying to build something that feels like us.",
  },
  {
    title: "Just so you know",
    body: "Even with all these films, you are still the reason this feels fun.",
  },
  {
    title: "A quiet admission",
    body: "I wanted this to feel thoughtful without making a big deal out of it.",
  },
  {
    title: "Tiny design note",
    body: "If anything here feels a bit too specific, that is because I absolutely did it on purpose.",
  },
];

const SWEET_TOASTS = [
  "I added that one to our story ♡",
  "That one is ours now.",
  "That was a good one for us.",
  "I’m counting that as a very good choice by us.",
];

const SEARCH_EGGS = {
  tasha: {
    id: "search_tasha",
    note: () => getRandomItem(SEARCH_NOTE_VARIANTS),
    toast: "I left that one there for you.",
  },
  tashas: {
    id: "search_tasha",
    note: () => getRandomItem(SEARCH_NOTE_VARIANTS),
    toast: "I left that one there for you.",
  },
};

const BRAND_TEASES = [
  "I had a feeling you’d end up here.",
  "I still think you’d make the better pick.",
  "I made this so our indecisive nights feel a bit more fun.",
  "If this feels a bit too tailored, that was absolutely the idea.",
  "I was aiming for somewhere between useful and suspiciously thoughtful.",
  "I wanted this to feel like a little place with your name on it.",
];

const STATS_TEASES = [
  "I wanted this bit to feel like a tiny archive of our movie nights.",
  "This is basically me keeping score of our very serious viewing career.",
  "I liked the idea of this remembering the nights we actually watched something.",
  "This part is just me being sentimental with better styling.",
  "It felt right to let the site remember the good nights too.",
  "I wanted the numbers to feel a little more like memories.",
];

const SEARCH_TEASES = {
  empty:
    "Start typing a film title and I’ll try not to make my favourites too obvious.",
  none: "I don’t think I’ve added that one yet.",
};

const HERO_TEASES = [
  "I’m still quietly hoping you’ll pick a good one.",
  "I made this to feel like our own little cinema.",
  "This is nicer when you’re the one choosing.",
  "I like this most when it feels easy for you to use.",
  "I wanted the front page to feel a bit cinematic, but still ours.",
];

const SEARCH_NOTE_VARIANTS = [
  {
    title: "Hi Tasha",
    body: "If you found this by typing your name, that makes me very happy. I put this here just for you.",
  },
  {
    title: "That one was hidden",
    body: "I liked the idea of you finding at least one thing in here that was only ever meant for you.",
  },
  {
    title: "You found it",
    body: "I wasn’t going to make this obvious. It feels nicer when you stumble into it.",
  },
];

const FOOTER_SECRET_NOTES = [
  {
    title: "One more thing",
    body: "The footer says I made this for you, but the real part is that I wanted this to make you smile every time you opened it.",
  },
  {
    title: "A small extra",
    body: "I thought it would be nice if even the quietest part of the page still had something waiting for you.",
  },
  {
    title: "Down here too",
    body: "It felt wrong to leave the footer plain when I could hide something small for you in it.",
  },
];

const T_KEY_NOTES = [
  { title: "You pressed T", body: "That one really is just for you." },
  {
    title: "A tiny shortcut",
    body: "I left this here because I liked the idea that some parts of the site only reveal themselves if you know where to look.",
  },
  {
    title: "That key works",
    body: "I know this is a bit ridiculous, but I still liked adding one secret little shortcut for you.",
  },
];

const ALEX_SEARCH_NOTES = [
  {
    title: "You searched Alex",
    body: "That one felt only fair. If your name gets searched in here, it should still have something waiting behind it.",
  },
  {
    title: "That one was yours too",
    body: "I could not really hide things only for Tasha and not leave one with your name on it too.",
  },
  {
    title: "A small extra",
    body: "If she ever searched your name, I thought that should open something a little sweet as well.",
  },
];

const BIRTHDAY_SEARCH_NOTES = [
  {
    title: "08.12.2004",
    body: "You found the birthday code. I liked the idea that even the numbers could have something hidden behind them.",
  },
  {
    title: "Birthday math",
    body: "Turning 22 on 08/12/2026 means 08/12/2004, so yes, I absolutely turned that into an easter egg.",
  },
  {
    title: "That date means something",
    body: "I did the maths and hid the answer in here because that felt exactly like the kind of detail worth keeping.",
  },
];

const ACHIEVEMENTS = [
  {
    threshold: 5,
    name: "Opening Credits",
    icon: "fa-clapperboard",
    copy: "Five watched already. This thing has officially started.",
  },
  {
    threshold: 10,
    name: "Ticket Stubs",
    icon: "fa-ticket",
    copy: "Ten down. Proper movie-night history now.",
  },
  {
    threshold: 15,
    name: "Double Feature",
    icon: "fa-film",
    copy: "Fifteen watched and the pile is starting to feel real.",
  },
  {
    threshold: 20,
    name: "Couch Critic",
    icon: "fa-tv",
    copy: "Twenty watched. The sofa has seen some things.",
  },
  {
    threshold: 25,
    name: "Star Billing",
    icon: "fa-star",
    copy: "Twenty-five watched. A proper headline run.",
  },
  {
    threshold: 30,
    name: "Soft Spot",
    icon: "fa-heart",
    copy: "Thirty watched. At this point it is absolutely a thing.",
  },
  {
    threshold: 35,
    name: "Burn Bright",
    icon: "fa-fire",
    copy: "Thirty-five watched. The streak is looking serious.",
  },
  {
    threshold: 40,
    name: "Scene Stealer",
    icon: "fa-bolt",
    copy: "Forty watched. Big main-character energy.",
  },
  {
    threshold: 45,
    name: "Launch Sequence",
    icon: "fa-rocket",
    copy: "Forty-five watched. This list is flying now.",
  },
  {
    threshold: 50,
    name: "Halfway Legend",
    icon: "fa-crown",
    copy: "Fifty watched. That deserves a little ceremony.",
  },
  {
    threshold: 55,
    name: "Gem Cut",
    icon: "fa-gem",
    copy: "Fifty-five watched. Hidden gems and bad picks included.",
  },
  {
    threshold: 60,
    name: "Trophy Shelf",
    icon: "fa-trophy",
    copy: "Sixty watched. Enough for bragging rights.",
  },
  {
    threshold: 65,
    name: "Golden Run",
    icon: "fa-medal",
    copy: "Sixty-five watched. Now it feels like a collection.",
  },
  {
    threshold: 70,
    name: "Magic Hour",
    icon: "fa-wand-magic-sparkles",
    copy: "Seventy watched. A very respectable level of obsession.",
  },
  {
    threshold: 75,
    name: "Toast Worthy",
    icon: "fa-champagne-glasses",
    copy: "Seventy-five watched. That earns a little celebration.",
  },
  {
    threshold: 80,
    name: "Curtain Call",
    icon: "fa-masks-theater",
    copy: "Eighty watched. The archive is getting dramatic.",
  },
  {
    threshold: 85,
    name: "Night Creature",
    icon: "fa-ghost",
    copy: "Eighty-five watched. Late-night pickers only.",
  },
  {
    threshold: 90,
    name: "Impact Frame",
    icon: "fa-meteor",
    copy: "Ninety watched. You are absolutely committed now.",
  },
  {
    threshold: 95,
    name: "Moonlit Marathon",
    icon: "fa-moon",
    copy: "Ninety-five watched. One last push.",
  },
  {
    threshold: 100,
    name: "Centurion of the Sofa",
    icon: "fa-camera-retro",
    copy: "One hundred watched. Proper legendary behaviour.",
  },
];

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("storage", handleStorageSync);

async function init() {
  document.body.classList.add("splash-active");
  window.setTimeout(() => {
    hideSplash();
  }, CONFIG.SPLASH_MIN_MS);

  try {
    bindUI();
    await loadMovies();
    setTeasingCopy();
    populateGenreFilter();
    renderQuickFilters();
    render();
    document.body.classList.add("app-ready");
    setupRevealObserver();
    revealStaticSections();
  } catch (error) {
    console.error("NATFLIX init failed:", error);
    document.body.classList.add("app-ready");
  }
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

function normalizeSearchEggKey(query) {
  return String(query || "")
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function maybeTriggerSearchEgg(query) {
  const normalized = normalizeSearchEggKey(query);
  if (!normalized) return false;

  const egg = SEARCH_EGGS[normalized];
  if (!egg) return false;

  unlockEasterEgg(egg.id);
  openSecretNote(egg.note());
  launchHeartBurst(12);
  showToast(egg.toast || "I left that one there for you.");
  return true;
}

function setTeasingCopy() {
  if (els.brandTease) {
    els.brandTease.textContent = getRandomItem(BRAND_TEASES);
  }

  if (els.statsTease) {
    els.statsTease.textContent = getRandomItem(STATS_TEASES);
  }
}

function loadEasterEggMap() {
  try {
    const raw = localStorage.getItem(CONFIG.EASTER_EGG_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return Object.fromEntries(
      Object.entries(parsed).filter(([id]) =>
        CONFIG.ACTIVE_EASTER_EGG_IDS.includes(id),
      ),
    );
  } catch (error) {
    console.error("Could not read easter eggs.", error);
    return {};
  }
}

function saveEasterEggMap() {
  try {
    const safeEggs = Object.fromEntries(
      Object.entries(appState.easterEggsFound || {}).filter(([id]) =>
        CONFIG.ACTIVE_EASTER_EGG_IDS.includes(id),
      ),
    );
    localStorage.setItem(CONFIG.EASTER_EGG_KEY, JSON.stringify(safeEggs));
  } catch (error) {
    console.error("Could not save easter eggs.", error);
  }
}

function unlockEasterEgg(id) {
  if (!id || appState.easterEggsFound[id]) return false;
  appState.easterEggsFound[id] = new Date().toISOString();
  saveEasterEggMap();
  renderStats();
  return true;
}

function parseRuntimeToMinutes(runtimeText) {
  const text = String(runtimeText || "").toLowerCase();
  const hoursMatch = text.match(/(\d+)\s*h/);
  const minutesMatch = text.match(/(\d+)\s*m/);
  const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;
  return hours * 60 + minutes;
}

function formatMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function formatAverageWatchTimeFromMovies(watchedMovies) {
  if (!watchedMovies.length) return "—";

  const averageMinutes = Math.round(
    watchedMovies.reduce((sum, movie) => {
      const watchedAt = appState.watchedMap[movie.id]?.watchedAt;
      if (!watchedAt) return sum;

      const watchedDate = new Date(watchedAt);
      const runtimeMinutes = parseRuntimeToMinutes(movie.runtime);
      const estimatedStart = new Date(
        watchedDate.getTime() - runtimeMinutes * 60 * 1000,
      );

      return sum + estimatedStart.getHours() * 60 + estimatedStart.getMinutes();
    }, 0) / watchedMovies.length,
  );

  const hours24 = ((Math.floor(averageMinutes / 60) % 24) + 24) % 24;
  const minutes = ((averageMinutes % 60) + 60) % 60;
  const suffix = hours24 >= 12 ? "pm" : "am";
  const hours12 = ((hours24 + 11) % 12) + 1;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function renderStats() {
  if (!els.statsWatchTime) return;

  const watchedMovies = appState.movies.filter(
    (movie) => appState.watchedMap[movie.id],
  );
  const watchedCount = watchedMovies.length;
  const totalRuntimeMinutes = watchedMovies.reduce(
    (sum, movie) => sum + parseRuntimeToMinutes(movie.runtime),
    0,
  );
  const completionPercent = appState.movies.length
    ? Math.round((watchedCount / appState.movies.length) * 100)
    : 0;
  const topGenre = getTopWatchedGenre(watchedMovies);
  const averageRating = getAverageRating(watchedMovies);
  const unlockedAchievements = Math.min(
    Math.floor(watchedCount / 5),
    ACHIEVEMENTS.length,
  );

  els.statsWatchTime.textContent = watchedCount
    ? formatMinutes(totalRuntimeMinutes)
    : "0h 0m";
  els.statsWatchedCount.textContent = `${watchedCount} / ${appState.movies.length}`;
  els.statsAverageTime.textContent =
    formatAverageWatchTimeFromMovies(watchedMovies);
  const eggsFoundCount = Object.keys(appState.easterEggsFound || {}).filter((id) =>
    CONFIG.ACTIVE_EASTER_EGG_IDS.includes(id),
  ).length;

  els.statsEggsFound.textContent = `${eggsFoundCount} / ${CONFIG.TOTAL_EASTER_EGGS}`;

  if (els.statsWatchTimeMeta) {
    els.statsWatchTimeMeta.textContent = watchedCount
      ? `${Math.round(totalRuntimeMinutes / Math.max(watchedCount, 1))} mins per pick on average.`
      : "Built from everything you’ve marked watched.";
  }

  if (els.statsWatchedMeta) {
    els.statsWatchedMeta.textContent = watchedCount
      ? `${completionPercent}% of the list has been watched.`
      : "A running total of your shared watch list.";
  }

  if (els.statsAverageMeta) {
    els.statsAverageMeta.textContent = watchedCount
      ? "Estimated from when you marked it watched minus runtime."
      : "This starts filling in once you log a few watches.";
  }

  if (els.statsEggMeta) {
    els.statsEggMeta.textContent =
      eggsFoundCount < CONFIG.TOTAL_EASTER_EGGS
        ? "There are still a few little things hiding."
        : "You found all the hidden bits.";
  }

  if (els.statsProgressValue) {
    els.statsProgressValue.textContent = `${completionPercent}%`;
  }

  if (els.statsProgressBar) {
    els.statsProgressBar.style.width = `${completionPercent}%`;
  }

  if (els.statsTopGenre) {
    els.statsTopGenre.textContent = topGenre.genre;
  }

  if (els.statsTopGenreMeta) {
    els.statsTopGenreMeta.textContent = topGenre.count
      ? `${topGenre.count} watched title${topGenre.count === 1 ? "" : "s"} have landed there so far.`
      : "Once you start watching, this will figure itself out.";
  }

  if (els.statsAverageRating) {
    els.statsAverageRating.textContent = averageRating
      ? `${averageRating.toFixed(1)} / 10`
      : "—";
  }

  if (els.statsAverageRatingMeta) {
    els.statsAverageRatingMeta.textContent = averageRating
      ? "A quiet little average of everything you’ve rated."
      : "Your ratings will start shaping this.";
  }

  if (els.statsAchievementsSummary) {
    els.statsAchievementsSummary.textContent = `${unlockedAchievements} / ${ACHIEVEMENTS.length} unlocked`;
  }

  if (els.statsAchievements) {
    els.statsAchievements.innerHTML = ACHIEVEMENTS.map((achievement) =>
      renderAchievementCard(achievement, watchedCount),
    ).join("");
  }
}

function setupRevealObserver() {
  if (revealObserver) return;

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.12 },
  );

  revealStaticSections();
}

function revealStaticSections() {
  if (!revealObserver) return;
  document
    .querySelectorAll(".hero, .genre-row, .stats-section")
    .forEach((node) => {
      revealObserver.observe(node);
    });
}

function pulseStatsSection() {
  if (!els.statsSection) return;
  els.statsSection.classList.remove("is-pulsing");
  requestAnimationFrame(() => {
    els.statsSection.classList.add("is-pulsing");
  });
}

function getTopWatchedGenre(watchedMovies) {
  if (!watchedMovies.length) return { genre: "—", count: 0 };
  const counts = new Map();
  watchedMovies.forEach((movie) => {
    counts.set(movie.primaryGenre, (counts.get(movie.primaryGenre) || 0) + 1);
  });
  const [genre, count] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return { genre, count };
}

function getAverageRating(watchedMovies) {
  const ratings = watchedMovies
    .map((movie) => Number(appState.watchedMap[movie.id]?.rating))
    .filter((rating) => Number.isFinite(rating));

  if (!ratings.length) return null;
  return ratings.reduce((sum, value) => sum + value, 0) / ratings.length;
}

function renderAchievementCard(achievement, watchedCount) {
  const unlocked = watchedCount >= achievement.threshold;

  return `
    <article class="achievement-card ${unlocked ? "is-unlocked" : "is-locked"}">
      <div class="achievement-icon-wrap" aria-hidden="true">
        <i class="fa-solid ${escapeHtml(achievement.icon)}"></i>
      </div>
      <div class="achievement-copy">
        <div class="achievement-topline">
          <strong class="achievement-title">${escapeHtml(unlocked ? achievement.name : "???????")}</strong>
          <span class="achievement-threshold">${achievement.threshold}</span>
        </div>
        <p class="achievement-meta">${escapeHtml(unlocked ? achievement.copy : "Keep watching to reveal this one.")}</p>
      </div>
    </article>
  `;
}

function updateRatingSliderVisual() {
  if (!els.watchRating) return;
  const min = Number(els.watchRating.min || 1);
  const max = Number(els.watchRating.max || 10);
  const value = Number(els.watchRating.value || 7);
  const percent = ((value - min) / (max - min)) * 100;
  els.watchRating.style.background = `linear-gradient(90deg, rgba(255,92,117,0.98) 0%, rgba(244,210,105,0.98) ${percent}%, rgba(255,255,255,0.10) ${percent}%, rgba(255,255,255,0.10) 100%)`;
  els.watchRatingValue.textContent = `${value}/10`;
}

function bindUI() {
  let searchDebounce;

  els.searchInput.addEventListener("focus", () => {
    appState.isSearchFocused = true;
    render();
  });

  els.searchInput.addEventListener("blur", () => {
    window.setTimeout(() => {
      appState.isSearchFocused = false;
      render();
    }, 20);
  });

  els.searchInput.addEventListener("input", () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      const attemptedQuery = els.searchInput.value.trim();

      if (maybeTriggerSearchEgg(attemptedQuery)) {
        appState.searchQuery = "";
        els.searchInput.value = "";
        appState.isSearchFocused = false;
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

  els.runtimeFilter.addEventListener("change", () => {
    appState.selectedRuntime = els.runtimeFilter.value;
    render();
  });

  els.watchRating.addEventListener("input", updateRatingSliderVisual);

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
    appState.isSearchFocused = false;
    appState.selectedGenre = "All";
    appState.selectedRuntime = "All";
    els.searchInput.value = "";
    els.genreFilter.value = "All";
    els.runtimeFilter.value = "All";
    renderQuickFilters();
    render();
  });

  els.footerMessage.addEventListener("click", () => {
    unlockEasterEgg("footer");
    openSecretNote(getRandomItem(FOOTER_SECRET_NOTES));
    launchHeartBurst(10);
  });

  if (els.closeSecretBtn)
    els.closeSecretBtn.addEventListener("click", closeSecretNote);

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
    setHeroById(button.dataset.heroPick, { announce: true });
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

    markMovieWatched(
      appState.pendingWatchMovieId,
      Number(els.watchRating.value),
    );
    closePasswordModal();
    closeDetailsModal();
    render();
    pulseStatsSection();
    launchHeartBurst(12);
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

    if (!typingIntoField && event.key.toLowerCase() === "t") {
      unlockEasterEgg("press_t");
      openSecretNote(getRandomItem(T_KEY_NOTES));
      launchHeartBurst(10);
    }
  });
}

async function loadMovies() {
  try {
    let raw = Array.isArray(window.NATFLIX_FILMS) ? window.NATFLIX_FILMS : null;

    if (!raw) {
      const response = await fetch("films.json", { cache: "no-store" });
      if (!response.ok)
        throw new Error(`films.json could not be loaded (${response.status})`);
      raw = await response.json();
    }

    const list = Array.isArray(raw) ? raw : raw.movies;
    if (!Array.isArray(list))
      throw new Error("films.json is not in the expected format.");
    appState.movies = list.map(normalizeMovie).filter(Boolean);
  } catch (error) {
    console.error(error);
    appState.movies = [];
    els.resultsSummary.textContent = "Couldn’t load your film list.";
    els.rowsContainer.innerHTML = `
      <div class="empty-page">
        <h3>Couldn’t load the film list</h3>
        <p>Make sure <strong>films.json</strong> is in the same folder as the website. This fixed build should also work when opened directly from the extracted zip.</p>
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
    runtimeMinutes: parseRuntimeToMinutes(movie.runtime || ""),
    certificate: movie.certificate || "Certificate not added",
    availability: normalizeAvailability(movie.availability),
    tasha2w: Boolean(movie.tasha2w),
  };
}

function normalizeGenres(genres) {
  const list = Array.isArray(genres)
    ? genres.map((item) => String(item).trim()).filter(Boolean)
    : [];
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
    other:
      Array.isArray(availability.other) && availability.other.length
        ? availability.other
        : ["Not listed"],
  };
}

function buildMovieId(title, year) {
  return `${title}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
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
  const primaryGenres = appState.movies
    .map((movie) => movie.primaryGenre)
    .filter(Boolean);
  const merged = [...CONFIG.GENRE_ORDER, ...primaryGenres];
  return [...new Set(merged)].filter(Boolean);
}

function renderQuickFilters() {
  const chips = [
    "All",
    ...getVisibleGenreList().filter((genre) =>
      ["Romcom", "Comedy", "Drama", "Horror", "Action", "Thriller"].includes(
        genre,
      ),
    ),
  ];

  els.quickFilters.innerHTML = chips
    .map(
      (genre) => `
    <button
      type="button"
      class="quick-chip ${appState.selectedGenre === genre ? "is-active" : ""}"
      data-genre-chip="${escapeHtml(genre)}"
    >
      ${escapeHtml(genre)}
    </button>
  `,
    )
    .join("");
}

function matchesRuntimeFilter(movie) {
  const minutes = movie.runtimeMinutes || parseRuntimeToMinutes(movie.runtime);

  switch (appState.selectedRuntime) {
    case "under60":
      return minutes < 60;
    case "under90":
      return minutes < 90;
    case "under120":
      return minutes < 120;
    case "120plus":
      return minutes >= 120;
    default:
      return true;
  }
}

function getFilteredMovies() {
  const query = appState.searchQuery.toLowerCase().trim();

  return appState.movies.filter((movie) => {
    const matchesGenre =
      appState.selectedGenre === "All" ||
      movie.primaryGenre === appState.selectedGenre;
    const matchesRuntime = matchesRuntimeFilter(movie);
    const matchesQuery = !query || movie.title.toLowerCase().includes(query);

    return matchesGenre && matchesRuntime && matchesQuery;
  });
}

function isSearchModeActive() {
  return appState.isSearchFocused || Boolean(appState.searchQuery.trim());
}

function renderSearchMode(filtered) {
  const active = isSearchModeActive();
  document.body.classList.toggle("search-active", active);
  els.searchMode.classList.toggle("hidden", !active);

  if (!active) {
    document.body.classList.remove("search-has-results");
    return;
  }

  const query = appState.searchQuery.trim();

  if (!query) {
    document.body.classList.remove("search-has-results");
    els.searchMode.classList.add("is-empty");
    els.searchMode.classList.remove("has-results");
    els.searchModeEyebrow.textContent = "Search";
    els.searchModeMessage.textContent = "What’s the next watch?";
    els.searchModeSubtext.textContent = SEARCH_TEASES.empty;
    els.searchModeResults.innerHTML = "";
    return;
  }

  if (!filtered.length) {
    document.body.classList.remove("search-has-results");
    els.searchMode.classList.add("is-empty");
    els.searchMode.classList.remove("has-results");
    els.searchModeEyebrow.textContent = "Search";
    els.searchModeMessage.textContent = `No results for “${query}”`;
    els.searchModeSubtext.textContent = SEARCH_TEASES.none;
    els.searchModeResults.innerHTML = "";
    return;
  }

  document.body.classList.add("search-has-results");
  els.searchMode.classList.remove("is-empty");
  els.searchMode.classList.add("has-results");
  els.searchModeEyebrow.textContent = "";
  els.searchModeMessage.textContent = "";
  els.searchModeSubtext.textContent = "";
  els.searchModeResults.innerHTML = filtered
    .map((movie, index) => renderMovieCard(movie, index))
    .join("");
}

function render() {
  const filtered = getFilteredMovies();
  renderStats();
  renderSearchMode(filtered);

  if (isSearchModeActive()) {
    revealStaticSections();
    return;
  }

  renderSummary(filtered);
  renderHero(filtered);
  renderRows(filtered);
  revealStaticSections();
}

function renderSummary(filtered) {
  const genreText =
    appState.selectedGenre === "All" ? "all genres" : appState.selectedGenre;

  if (appState.searchQuery) {
    els.resultsSummary.textContent = `${filtered.length} film${filtered.length === 1 ? "" : "s"} matching “${appState.searchQuery}”.`;
  } else {
    els.resultsSummary.textContent = `${filtered.length} film${filtered.length === 1 ? "" : "s"} in ${genreText}.`;
  }
}

function getHeroCandidates(filtered) {
  const hasScopedView =
    Boolean(appState.searchQuery.trim()) || appState.selectedGenre !== "All";
  const pool = filtered.length
    ? filtered
    : hasScopedView
      ? []
      : appState.movies;
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

function buildHeroQueue(candidates) {
  const candidateIds = candidates.map((movie) => movie.id);
  const queueKey = candidateIds.join("|");
  const existing = appState.heroQueue.filter((id) => candidateIds.includes(id));
  const missing = shuffleArray(
    candidateIds.filter((id) => !existing.includes(id)),
  );
  const queue = [...existing, ...missing];
  const currentId =
    appState.heroQueue[appState.heroActiveIndex] || appState.heroActiveId;
  const nextActiveIndex = Math.max(queue.indexOf(currentId), 0);

  appState.heroQueue = queue;
  appState.heroQueueKey = queueKey;
  appState.heroActiveIndex = nextActiveIndex;
  appState.heroActiveId = queue[nextActiveIndex] || null;
}

function ensureHeroQueue(candidates) {
  const nextKey = candidates.map((movie) => movie.id).join("|");
  if (!candidates.length) {
    appState.heroQueue = [];
    appState.heroQueueKey = "";
    appState.heroActiveIndex = 0;
    appState.heroActiveId = null;
    return;
  }

  if (appState.heroQueueKey !== nextKey) {
    buildHeroQueue(candidates);
  } else if (!appState.heroQueue.length) {
    buildHeroQueue(candidates);
  } else {
    appState.heroActiveId =
      appState.heroQueue[appState.heroActiveIndex] || candidates[0].id;
  }
}

function getActiveHeroMovie(candidates) {
  ensureHeroQueue(candidates);
  if (!candidates.length) return null;
  const activeId =
    appState.heroQueue[appState.heroActiveIndex] || candidates[0].id;
  appState.heroActiveId = activeId;
  return candidates.find((movie) => movie.id === activeId) || candidates[0];
}

function setHeroById(movieId, { restart = true, announce = false } = {}) {
  const index = appState.heroQueue.indexOf(movieId);
  if (index === -1) return;
  appState.heroActiveIndex = index;
  appState.heroActiveId = movieId;
  renderHero(getFilteredMovies(), restart, true);
  if (announce) {
    const movie = appState.movies.find((item) => item.id === movieId);
    if (movie) showToast(`Now featuring: ${movie.title}`);
  }
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
  ensureHeroQueue(candidates);
  if (!candidates.length) return;

  const queueLength = appState.heroQueue.length;
  appState.heroActiveIndex =
    (appState.heroActiveIndex + direction + queueLength) % queueLength;
  appState.heroActiveId = appState.heroQueue[appState.heroActiveIndex];
  renderHero(getFilteredMovies(), restart, true);
}

function pickRandomHero() {
  const candidates = getHeroCandidates(getFilteredMovies());
  ensureHeroQueue(candidates);
  if (!candidates.length) return;

  const currentId = appState.heroQueue[appState.heroActiveIndex];
  const alternatives = appState.heroQueue.filter((id) => id !== currentId);
  const nextId = shuffleArray(
    alternatives.length ? alternatives : appState.heroQueue,
  )[0];
  setHeroById(nextId, { announce: true });
}

function getHeroAvailabilityLabel(availability) {
  if (isActuallyListed(availability.netflix)) return "Netflix";
  if (isActuallyListed(availability.amazon)) return "Amazon";
  if (isActuallyListed(availability.disney)) return "Disney+";

  const other = (availability.other || []).find(isActuallyListed);
  return other || "Watch info soon";
}

function triggerHeroRefresh(applyUpdate) {
  clearTimeout(heroRefreshTimer);
  els.heroSection.classList.remove("is-transitioning-in");
  els.heroSection.classList.add("is-transitioning-out");

  heroRefreshTimer = window.setTimeout(() => {
    applyUpdate();

    requestAnimationFrame(() => {
      els.heroSection.classList.remove("is-transitioning-out");
      els.heroSection.classList.add("is-transitioning-in");

      clearTimeout(heroRefreshTimer);
      heroRefreshTimer = window.setTimeout(() => {
        els.heroSection.classList.remove("is-transitioning-in");
      }, 240);
    });
  }, 150);
}

function applyHeroState(state) {
  els.heroSection.style.setProperty("--hero-image", state.heroImage);
  els.heroEyebrow.textContent = state.eyebrow;
  els.heroTitle.textContent = state.title;
  els.heroText.textContent = state.text;
  els.heroPoster.src = state.poster;
  els.heroPoster.alt = state.posterAlt;
  els.heroPosterBadge.textContent = state.posterBadge;
  els.heroMeta.innerHTML = state.metaHtml;
  els.heroSubline.textContent = state.subline;
  els.heroMiniLabel.textContent = state.miniLabel;
  els.heroMiniList.innerHTML = state.miniHtml;
}

function renderHero(filtered, restartRotation = true, animate = false) {
  const candidates = getHeroCandidates(filtered);
  const featured = getActiveHeroMovie(candidates);

  if (!featured) {
    clearInterval(heroRotationTimer);
    const emptyState = {
      heroImage: "none",
      eyebrow: "Tonight's pick",
      title: "Nothing to see here yet.",
      text: "Add a few films to films.json and they’ll appear here.",
      poster: CONFIG.DEFAULT_POSTER,
      posterAlt: "No film selected",
      posterBadge: "Waiting for picks",
      metaHtml: "",
      subline: "",
      miniLabel: "",
      miniHtml: `<div class="hero-empty-note">Nothing to choose from yet.</div>`,
    };

    if (animate) {
      triggerHeroRefresh(() => applyHeroState(emptyState));
    } else {
      applyHeroState(emptyState);
    }
    return;
  }

  const scoped =
    Boolean(appState.searchQuery.trim()) || appState.selectedGenre !== "All";
  const unwatchedInView = filtered.filter(
    (movie) => !appState.watchedMap[movie.id],
  ).length;
  const unwatchedOverall = appState.movies.filter(
    (movie) => !appState.watchedMap[movie.id],
  ).length;
  const rewatchMode = candidates.every(
    (movie) => appState.watchedMap[movie.id],
  );
  const queue = appState.heroQueue.length
    ? appState.heroQueue
    : candidates.map((movie) => movie.id);

  const previewIds = [];
  for (
    let step = 1;
    step < queue.length && previewIds.length < CONFIG.HERO_PREVIEW_COUNT;
    step += 1
  ) {
    const index = (appState.heroActiveIndex + step) % queue.length;
    previewIds.push(queue[index]);
  }

  const preview = previewIds
    .map((id) => candidates.find((movie) => movie.id === id))
    .filter(Boolean);

  const nextState = {
    heroImage: `url("${featured.poster}")`,
    eyebrow: rewatchMode ? "Rewatch pick" : "Tonight's pick",
    title: featured.title,
    text: featured.description,
    poster: featured.poster,
    posterAlt: `${featured.title} poster`,
    posterBadge: appState.watchedMap[featured.id] ? "Watched" : "Unwatched",
    metaHtml: [
      featured.primaryGenre,
      featured.runtime,
      `🍅 ${featured.rtRating}`,
      getHeroAvailabilityLabel(featured.availability),
    ]
      .map(
        (value) => `<span class="hero-meta-chip">${escapeHtml(value)}</span>`,
      )
      .join(""),
    subline: scoped
      ? `${unwatchedInView} unwatched in this view. ${getRandomItem(HERO_TEASES)}`
      : `${unwatchedOverall} still left to watch. ${getRandomItem(HERO_TEASES)}`,
    miniLabel: "",
    miniHtml: preview.length
      ? preview
          .map(
            (movie) => `
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
    `,
          )
          .join("")
      : `<div class="hero-empty-note">This is the only pick in view right now.</div>`,
  };

  if (animate) {
    triggerHeroRefresh(() => applyHeroState(nextState));
  } else {
    applyHeroState(nextState);
  }

  if (restartRotation) {
    restartHeroRotation(candidates);
  }
}

function renderShelfSection(title, subtitle, movies, extraClass = "") {
  return `
    <section class="genre-row ${extraClass}">
      <div class="row-heading">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(subtitle)}</p>
      </div>
      ${
        movies.length
          ? `<div class="card-rail">${movies.map((movie, index) => renderMovieCard(movie, index)).join("")}</div>`
          : `<div class="empty-slot">Nothing to see here yet.</div>`
      }
    </section>
  `;
}

function renderRows(filtered) {
  const allGenres = getVisibleGenreList();
  const queryActive = Boolean(appState.searchQuery.trim());

  const genresToRender =
    appState.selectedGenre !== "All"
      ? [appState.selectedGenre]
      : queryActive
        ? allGenres.filter((genre) =>
            filtered.some((movie) => movie.primaryGenre === genre),
          )
        : allGenres;

  const sections = [];

  if (appState.selectedGenre === "All" && !queryActive) {
    const tashaWatchlist = filtered.filter((movie) => movie.tasha2w);
    if (tashaWatchlist.length) {
      sections.push(
        renderShelfSection(
          "Tasha's watchlist",
          `${tashaWatchlist.length} title${tashaWatchlist.length === 1 ? "" : "s"} picked out specially`,
          tashaWatchlist,
          "watchlist-row",
        ),
      );
    }
  }

  sections.push(
    ...genresToRender.map((genre) => {
      const genreMovies = filtered.filter(
        (movie) => movie.primaryGenre === genre,
      );

      return renderShelfSection(
        genre,
        genreMovies.length
          ? `${genreMovies.length} title${genreMovies.length === 1 ? "" : "s"}`
          : "Nothing to see here yet!",
        genreMovies,
      );
    }),
  );

  if (!sections.length) {
    els.rowsContainer.innerHTML = `
      <div class="empty-page">
        <h3>Nothing to see here yet!</h3>
        <p>Try a different search or clear the filter.</p>
      </div>
    `;
    return;
  }

  els.rowsContainer.innerHTML = sections.join("");
}

function renderMovieCard(movie, index = 0) {
  const watched = appState.watchedMap[movie.id];

  return `
    <button
      class="movie-card ${watched ? "disabled" : ""}"
      type="button"
      style="--enter-delay:${Math.min(index, 10) * 34}ms"
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

        ${watched ? renderWatchedOverlay(watched.watchedAt, watched.rating) : ""}
      </div>
    </button>
  `;
}

function shortAvailability(availability) {
  if (String(availability.netflix).toLowerCase().includes("included"))
    return "Netflix";
  if (String(availability.disney).toLowerCase().includes("included"))
    return "Disney+";
  if (String(availability.amazon).toLowerCase().includes("included"))
    return "Prime";
  if (String(availability.amazon).toLowerCase().includes("purchase"))
    return "Amazon";
  return "Streaming varies";
}

function renderWatchedOverlay(isoDate, rating = null) {
  return `
    <div class="watched-overlay">
      <div class="watched-overlay-inner">
        <span class="watched-label">WATCHED</span>
        ${rating ? `<span class="watched-time">Rated ${escapeHtml(rating)}/10</span>` : ""}
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
                <span class="meta-pill user-rating-pill">Your rating: ${escapeHtml(watched.rating || "7")}/10</span>
                <button type="button" class="secondary-btn" data-action="mark-unwatched" data-movie-id="${escapeHtml(movie.id)}">Mark as unwatched</button>
              `
              : `<button type="button" class="watch-btn" data-action="mark-watched" data-movie-id="${escapeHtml(movie.id)}">Watched + rate</button>`
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
      `<span class="provider-pill ${providerClass(value)}">${escapeHtml(label)}: ${escapeHtml(value)}</span>`,
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
  const lower = String(value || "")
    .trim()
    .toLowerCase();
  if (!lower) return false;

  const hiddenValues = new Set([
    "not listed",
    "not currently listed",
    "check local services",
    "availability unknown",
    "streaming varies",
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
  const existingRating =
    appState.watchedMap[appState.pendingWatchMovieId]?.rating;
  els.watchPassword.value = "";
  els.watchRating.value = String(existingRating || 7);
  updateRatingSliderVisual();
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
  const secretOpen = !els.secretNoteModal.classList.contains("hidden");
  if (!detailsOpen && !passwordOpen && !secretOpen) {
    document.body.style.overflow = "";
  }
}

function markMovieWatched(movieId, rating = 7) {
  appState.watchedMap[movieId] = {
    watchedAt: new Date().toISOString(),
    rating: Number(rating),
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
    localStorage.setItem(
      CONFIG.STORAGE_KEY,
      JSON.stringify(appState.watchedMap),
    );
  } catch (error) {
    console.error("Could not save watched list.", error);
  }
}

function handleStorageSync(event) {
  if (event.key === CONFIG.STORAGE_KEY) {
    appState.watchedMap = loadWatchedMap();
    render();
    return;
  }

  if (event.key === CONFIG.EASTER_EGG_KEY) {
    appState.easterEggsFound = loadEasterEggMap();
    renderStats();
  }
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
      timeStyle: "short",
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
