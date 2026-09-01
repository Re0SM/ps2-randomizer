const GAMES_URL = "data/games.json";

const GAMES_PER_PAGE = 48;

const STORAGE_KEY = "ps2-randomizer-profile";

let games = [];
let filteredGames = [];

let currentPage = 1;
let currentGame = null;


/* =========================================================
   PERFIL LOCAL
========================================================= */

let profile = loadProfile();


function loadProfile() {

  try {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return {
        played: [],
        backlog: [],
        favorites: []
      };
    }

    const data = JSON.parse(saved);

    return {
      played: Array.isArray(data.played)
        ? data.played
        : [],

      backlog: Array.isArray(data.backlog)
        ? data.backlog
        : [],

      favorites: Array.isArray(data.favorites)
        ? data.favorites
        : []
    };

  } catch (error) {

    console.error(
      "Erro ao carregar perfil:",
      error
    );

    return {
      played: [],
      backlog: [],
      favorites: []
    };
  }
}


function saveProfile() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(profile)
  );
}


/* =========================================================
   NORMALIZAÇÃO DE GÊNEROS
========================================================= */

function normalizeGenre(genre) {

  if (!genre) {
    return "Other";
  }

  let value = String(genre)
    .trim()
    .toLowerCase();

  /*
   * Remove pontos, espaços duplicados
   * e pequenas diferenças de escrita.
   */
  value = value
    .replace(/\.+$/g, "")
    .replace(/\s+/g, " ")
    .trim();


  /*
   * Acentos.
   */
  value = value.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");


  /*
   * Gêneros equivalentes.
   */

  const aliases = {

    "action": "Action",

    "action rpg": "Action RPG",

    "action-adventure": "Action-Adventure",
    "action adventure": "Action-Adventure",

    "adventure": "Adventure",

    "arcade": "Arcade",

    "baseball": "Baseball",

    "baseball simulation": "Baseball Simulation",

    "basketball": "Basketball",

    "beach volleyball": "Beach Volleyball",

    "beat em up": "Beat 'Em Up",
    "beat'em up": "Beat 'Em Up",
    "beat 'em up": "Beat 'Em Up",
    "beat emup": "Beat 'Em Up",

    "board": "Board",

    "bowling": "Bowling",

    "boxing": "Boxing",

    "breakout": "Breakout",

    "breeding": "Breeding",

    "building": "Building",

    "card": "Card",

    "card battle": "Card Battle",

    "casino": "Casino",

    "chess": "Chess",

    "classic": "Classic",

    "constructing": "Constructing",

    "cycling": "Cycling",

    "dancing": "Dancing",

    "data": "Data",

    "dating": "Dating",

    "dating simulation": "Dating Simulation",

    "educational": "Educational",

    "edutainment": "Edutainment",

    "exercise": "Exercise",

    "fighting": "Fighting",

    "first person shooter": "First Person Shooter",
    "first-person shooter": "First Person Shooter",

    "fishing": "Fishing",

    "flight simulator": "Flight Simulator",

    "football": "Football",

    "gambling": "Gambling",

    "golf": "Golf",

    "gun": "Gun",

    "hanafuda": "Hanafuda",

    "horse racing": "Horse Racing",

    "hunting": "Hunting",

    "igo": "Igo",

    "interactive movie": "Interactive Movie",

    "jigsaw puzzle": "Jigsaw Puzzle",

    "light gun shooter": "Light Gun Shooter",

    "mahjong": "Mahjong",

    "mini games": "Mini Games",
    "mini-game": "Mini Games",
    "mini game": "Mini Games",

    "mmorpg": "MMORPG",

    "music": "Music",

    "other": "Other",

    "party": "Party",

    "pictures": "Pictures",

    "pinball": "Pinball",

    "plataformer": "Platformer",
    "platformer": "Platformer",

    "poker": "Poker",

    "puzzle": "Puzzle",

    "quiz": "Quiz",

    "racing": "Racing",

    "rhythm": "Rhythm",

    "rpg": "RPG",

    "rugby": "Rugby",

    "shogi": "Shogi",

    "shoot em up": "Shoot 'Em Up",
    "shoot'em up": "Shoot 'Em Up",
    "shoot 'em up": "Shoot 'Em Up",

    "shooter": "Shooter",

    "simulation": "Simulation",

    "sing": "Sing",

    "skateboard": "Skateboarding",
    "skateboarding": "Skateboarding",

    "ski": "Skiing",
    "skiing": "Skiing",

    "snowboard": "Snowboarding",
    "snowboarding": "Snowboarding",

    "soccer": "Soccer",

    "soccer management": "Soccer Management",
    "soccer manager": "Soccer Management",

    "sports": "Sports",

    "strategy": "Strategy",

    "surfing": "Surfing",

    "survival horror": "Survival Horror",

    "tactical rpg": "Tactical RPG",

    "tennis": "Tennis",

    "third person shooter": "Third-person Shooter",
    "third-person shooter": "Third-person Shooter",

    "trivia": "Trivia",

    "typing": "Typing",

    "visual novel": "Visual Novel",

    "wrestling": "Wrestling"
  };


  return aliases[value] || capitalizeGenre(value);
}


function capitalizeGenre(value) {

  return value
    .split(" ")
    .map(word => {

      if (!word) {
        return word;
      }

      return word.charAt(0).toUpperCase()
        + word.slice(1);

    })
    .join(" ");
}


/* =========================================================
   NORMALIZAÇÃO DOS JOGOS
========================================================= */

function normalizeGame(game, index) {

  const normalized = {
    ...game
  };


  normalized.id =
    game.serial ||
    (
      normalizeTitleForId(game.title)
      + "-"
      + index
    );


  normalized.title =
    game.title ||
    "Jogo desconhecido";


  normalized.genre =
    normalizeGenre(game.genre);


  normalized.year =
    game.year || null;


  normalized.cover =
    game.cover || null;


  return normalized;
}


function normalizeTitleForId(title) {

  return String(title || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}


/* =========================================================
   PERFIL
========================================================= */

function isPlayed(game) {

  return profile.played.includes(game.id);
}


function isBacklog(game) {

  return profile.backlog.includes(game.id);
}


function isFavorite(game) {

  return profile.favorites.includes(game.id);
}


/*
 * Já jogado e favorito podem coexistir.
 *
 * Já jogado e pretendo jogar NÃO podem coexistir.
 */

function togglePlayed(game) {

  if (isPlayed(game)) {

    profile.played =
      profile.played.filter(
        id => id !== game.id
      );

  } else {

    profile.played.push(game.id);

    /*
     * Se marcou como já jogado,
     * remove automaticamente do backlog.
     */

    profile.backlog =
      profile.backlog.filter(
        id => id !== game.id
      );
  }


  saveProfile();

  refreshEverything();
}


function toggleBacklog(game) {

  if (isBacklog(game)) {

    profile.backlog =
      profile.backlog.filter(
        id => id !== game.id
      );

  } else {

    /*
     * Se marcou como pretendo jogar,
     * remove automaticamente de já jogados.
     */

    profile.played =
      profile.played.filter(
        id => id !== game.id
      );


    profile.backlog.push(game.id);
  }


  saveProfile();

  refreshEverything();
}


function toggleFavorite(game) {

  if (isFavorite(game)) {

    profile.favorites =
      profile.favorites.filter(
        id => id !== game.id
      );

  } else {

    /*
     * Favorito é independente.
     *
     * Portanto:
     * Já jogado + favorito = permitido.
     * Pretendo jogar + favorito = permitido.
     */

    profile.favorites.push(game.id);
  }


  saveProfile();

  refreshEverything();
}


/* =========================================================
   ELEMENTOS
========================================================= */

const gameGrid =
  document.getElementById("gameGrid");

const emptyState =
  document.getElementById("emptyState");

const pagination =
  document.getElementById("pagination");

const searchInput =
  document.getElementById("searchInput");

const genreFilter =
  document.getElementById("genreFilter");


/* =========================================================
   CARREGAR CATÁLOGO
========================================================= */

async function loadGames() {

  try {

    const response =
      await fetch(GAMES_URL);


    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }


    const data =
      await response.json();


    games =
      data.map(normalizeGame);


    buildGenreFilter();

    applyFilters();

    renderProfile();


  } catch (error) {

    console.error(
      "Erro ao carregar jogos:",
      error
    );


    gameGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>Não foi possível carregar o catálogo</h3>
        <p>Verifique o arquivo data/games.json.</p>
      </div>
    `;
  }
}


/* =========================================================
   FILTRO DE GÊNEROS
========================================================= */

function buildGenreFilter() {

  const genres =
    [...new Set(
      games.map(game => game.genre)
    )]
    .filter(Boolean)
    .sort((a, b) =>
      a.localeCompare(
        b,
        "pt-BR",
        { sensitivity: "base" }
      )
    );


  genreFilter.innerHTML = `
    <option value="all">
      Todos
    </option>
  `;


  genres.forEach(genre => {

    const option =
      document.createElement("option");

    option.value = genre;

    option.textContent = genre;

    genreFilter.appendChild(option);
  });
}


/* =========================================================
   FILTROS
========================================================= */

function applyFilters() {

  const search =
    searchInput.value
      .trim()
      .toLowerCase();


  const selectedGenre =
    genreFilter.value;


  filteredGames =
    games.filter(game => {

      const matchesSearch =
        !search ||
        game.title
          .toLowerCase()
          .includes(search);


      const matchesGenre =
        selectedGenre === "all" ||
        game.genre === selectedGenre;


      return matchesSearch &&
             matchesGenre;
    });


  currentPage = 1;

  renderCatalog();
}


/* =========================================================
   CATÁLOGO
========================================================= */

function renderCatalog() {

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredGames.length /
        GAMES_PER_PAGE
      )
    );


  if (currentPage > totalPages) {
    currentPage = totalPages;
  }


  const start =
    (currentPage - 1) *
    GAMES_PER_PAGE;


  const end =
    start + GAMES_PER_PAGE;


  const pageGames =
    filteredGames.slice(
      start,
      end
    );


  gameGrid.innerHTML = "";


  if (pageGames.length === 0) {

    emptyState.classList.remove("hidden");

    pagination.innerHTML = "";

    return;

  }


  emptyState.classList.add("hidden");


  pageGames.forEach(game => {

    gameGrid.appendChild(
      createGameCard(game)
    );

  });


  renderPagination(
    totalPages
  );
}


/* =========================================================
   CARD DO CATÁLOGO
========================================================= */

function createGameCard(game) {

  const card =
    document.createElement("article");


  card.className =
    "game-card";


  const badges = [];


  if (isPlayed(game)) {
    badges.push("✓ Já joguei");
  }


  if (isBacklog(game)) {
    badges.push("+ Pretendo jogar");
  }


  if (isFavorite(game)) {
    badges.push("★ Favorito");
  }


  card.innerHTML = `

    <div class="cover-wrap">

      ${createCoverHTML(game)}

      ${
        badges.length
          ? `
            <div class="status-badges">
              ${badges.map(
                badge =>
                  `<span class="badge">${escapeHTML(badge)}</span>`
              ).join("")}
            </div>
          `
          : ""
      }

    </div>


    <div class="game-title">
      ${escapeHTML(game.title)}
    </div>


    ${
      game.year
        ? `
          <div class="game-year">
            ${escapeHTML(String(game.year))}
          </div>
        `
        : ""
    }

  `;


  card.addEventListener(
    "click",
    () => openGameModal(game)
  );


  return card;
}


/* =========================================================
   CAPA
========================================================= */

function createCoverHTML(game) {

  if (!game.cover) {

    return `
      <div class="cover-placeholder">
        ${escapeHTML(game.title)}
      </div>
    `;
  }


  return `
    <img
      src="${escapeAttribute(game.cover)}"
      alt="${escapeAttribute(game.title)}"
      loading="lazy"
      onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';"
    >

    <div
      class="cover-placeholder"
      style="display:none;"
    >
      ${escapeHTML(game.title)}
    </div>
  `;
}


/* =========================================================
   PAGINAÇÃO
========================================================= */

function renderPagination(totalPages) {

  pagination.innerHTML = "";


  if (totalPages <= 1) {
    return;
  }


  const previous =
    createPaginationButton(
      "‹",
      currentPage - 1,
      currentPage === 1
    );


  pagination.appendChild(previous);


  const pages =
    getPaginationPages(
      currentPage,
      totalPages
    );


  pages.forEach(page => {

    if (page === "...") {

      const dots =
        document.createElement("span");

      dots.className =
        "pagination-dots";

      dots.textContent = "...";

      pagination.appendChild(dots);

      return;
    }


    const button =
      createPaginationButton(
        String(page),
        page,
        false,
        page === currentPage
      );


    pagination.appendChild(button);

  });


  const next =
    createPaginationButton(
      "›",
      currentPage + 1,
      currentPage === totalPages
    );


  pagination.appendChild(next);
}


function createPaginationButton(
  text,
  page,
  disabled = false,
  active = false
) {

  const button =
    document.createElement("button");


  button.className =
    "pagination-button";


  if (active) {
    button.classList.add("active");
  }


  button.textContent = text;

  button.disabled = disabled;


  button.addEventListener(
    "click",
    () => {

      currentPage = page;

      renderCatalog();

      document
        .getElementById("catalogo")
        .scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
    }
  );


  return button;
}


function getPaginationPages(
  current,
  total
) {

  if (total <= 7) {

    return Array.from(
      { length: total },
      (_, index) => index + 1
    );
  }


  const pages = [1];


  if (current > 4) {
    pages.push("...");
  }


  const start =
    Math.max(
      2,
      current - 1
    );


  const end =
    Math.min(
      total - 1,
      current + 1
    );


  for (
    let i = start;
    i <= end;
    i++
  ) {

    pages.push(i);

  }


  if (current < total - 3) {
    pages.push("...");
  }


  pages.push(total);


  return pages;
}


/* =========================================================
   MODAL DO JOGO
========================================================= */

const gameModal =
  document.getElementById("gameModal");

const modalCover =
  document.getElementById("modalCover");

const modalGenre =
  document.getElementById("modalGenre");

const modalTitle =
  document.getElementById("modalTitle");

const modalMeta =
  document.getElementById("modalMeta");

const togglePlayedButton =
  document.getElementById("togglePlayed");

const toggleBacklogButton =
  document.getElementById("toggleBacklog");

const toggleFavoriteButton =
  document.getElementById("toggleFavorite");


function openGameModal(game) {

  currentGame = game;


  modalTitle.textContent =
    game.title;


  modalGenre.textContent =
    game.genre;


  const meta = [];


  if (game.year) {
    meta.push(String(game.year));
  }


  if (game.developer) {
    meta.push(game.developer);
  }


  if (game.publisher) {
    meta.push(game.publisher);
  }


  modalMeta.textContent =
    meta.join(" · ");


  modalCover.innerHTML =
    createCoverHTML(game);


  updateModalButtons();


  gameModal.classList.remove(
    "hidden"
  );


  document.body.classList.add(
    "modal-open"
  );
}


function closeGameModal() {

  gameModal.classList.add(
    "hidden"
  );


  document.body.classList.remove(
    "modal-open"
  );


  currentGame = null;
}


function updateModalButtons() {

  if (!currentGame) {
    return;
  }


  const played =
    isPlayed(currentGame);


  const backlog =
    isBacklog(currentGame);


  const favorite =
    isFavorite(currentGame);


  togglePlayedButton.classList.toggle(
    "active",
    played
  );


  toggleBacklogButton.classList.toggle(
    "active",
    backlog
  );


  toggleFavoriteButton.classList.toggle(
    "active",
    favorite
  );


  togglePlayedButton.textContent =
    played
      ? "☑ Já joguei"
      : "☐ Já joguei";


  toggleBacklogButton.textContent =
    backlog
      ? "✓ Pretendo jogar"
      : "＋ Pretendo jogar";


  toggleFavoriteButton.textContent =
    favorite
      ? "★ Favorito"
      : "☆ Favorito";
}


/* =========================================================
   EVENTOS DO MODAL
========================================================= */

togglePlayedButton.addEventListener(
  "click",
  () => {

    if (!currentGame) {
      return;
    }

    togglePlayed(currentGame);

    updateModalButtons();
  }
);


toggleBacklogButton.addEventListener(
  "click",
  () => {

    if (!currentGame) {
      return;
    }

    toggleBacklog(currentGame);

    updateModalButtons();
  }
);


toggleFavoriteButton.addEventListener(
  "click",
  () => {

    if (!currentGame) {
      return;
    }

    toggleFavorite(currentGame);

    updateModalButtons();
  }
);


document
  .querySelectorAll("[data-close-modal]")
  .forEach(element => {

    element.addEventListener(
      "click",
      closeGameModal
    );

  });


document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape" &&
      !gameModal.classList.contains("hidden")
    ) {

      closeGameModal();

    }

  }
);


/* =========================================================
   MINHA LISTA
========================================================= */

function renderProfile() {

  const playedGames =
    getProfileGames(
      profile.played
    );


  const backlogGames =
    getProfileGames(
      profile.backlog
    );


  const favoriteGames =
    getProfileGames(
      profile.favorites
    );


  renderProfileList(
    "playedList",
    "playedEmpty",
    playedGames
  );


  renderProfileList(
    "backlogList",
    "backlogEmpty",
    backlogGames
  );


  renderProfileList(
    "favoriteList",
    "favoriteEmpty",
    favoriteGames
  );


  document.getElementById(
    "playedCount"
  ).textContent =
    playedGames.length;


  document.getElementById(
    "backlogCount"
  ).textContent =
    backlogGames.length;


  document.getElementById(
    "favoriteCount"
  ).textContent =
    favoriteGames.length;
}


function getProfileGames(ids) {

  return ids
    .map(id =>
      games.find(
        game => game.id === id
      )
    )
    .filter(Boolean);
}


function renderProfileList(
  listId,
  emptyId,
  list
) {

  const container =
    document.getElementById(
      listId
    );


  const empty =
    document.getElementById(
      emptyId
    );


  container.innerHTML = "";


  if (list.length === 0) {

    empty.style.display =
      "block";

    return;
  }


  empty.style.display =
    "none";


  list.forEach(game => {

    const card =
      document.createElement(
        "article"
      );


    card.className =
      "profile-game";


    card.innerHTML = `

      <div class="profile-game-cover">

        ${createCoverHTML(game)}

      </div>

      <div class="profile-game-title">
        ${escapeHTML(game.title)}
      </div>

    `;


    card.addEventListener(
      "click",
      () => openGameModal(game)
    );


    container.appendChild(card);

  });
}


/* =========================================================
   ATUALIZAÇÃO GERAL
========================================================= */

function refreshEverything() {

  renderCatalog();

  renderProfile();

  if (currentGame) {
    updateModalButtons();
  }
}


/* =========================================================
   SORTEIO
========================================================= */

const randomModal =
  document.getElementById("randomModal");

const randomResults =
  document.getElementById("randomResults");

const rerollButton =
  document.getElementById("rerollButton");


function getRandomGames(amount) {

  if (games.length <= amount) {
    return [...games];
  }


  const selected = [];

  const used = new Set();


  while (
    selected.length < amount
  ) {

    const index =
      Math.floor(
        Math.random() *
        games.length
      );


    if (used.has(index)) {
      continue;
    }


    used.add(index);

    selected.push(
      games[index]
    );
  }


  return selected;
}


function openRandomModal(amount = 5) {

  const selected =
    getRandomGames(amount);


  renderRandomResults(
    selected
  );


  randomModal.classList.remove(
    "hidden"
  );


  document.body.classList.add(
    "modal-open"
  );
}


function renderRandomResults(
  selected
) {

  randomResults.innerHTML = "";


  selected.forEach(game => {

    const card =
      document.createElement("article");


    card.className =
      "random-card";


    card.innerHTML = `

      <div class="cover-wrap">

        ${createCoverHTML(game)}

      </div>

      <div class="game-title">
        ${escapeHTML(game.title)}
      </div>

    `;


    card.addEventListener(
      "click",
      () => {

        closeRandomModal();

        openGameModal(game);

      }
    );


    randomResults.appendChild(
      card
    );

  });
}


function closeRandomModal() {

  randomModal.classList.add(
    "hidden"
  );


  document.body.classList.remove(
    "modal-open"
  );
}


document
  .querySelectorAll("[data-close-random]")
  .forEach(element => {

    element.addEventListener(
      "click",
      closeRandomModal
    );

  });


rerollButton.addEventListener(
  "click",
  () => {

    openRandomModal(5);

  }
);


document
  .getElementById("randomFiveHero")
  .addEventListener(
    "click",
    () => openRandomModal(5)
  );


document
  .getElementById("randomOneTop")
  .addEventListener(
    "click",
    () => openRandomModal(5)
  );


/* =========================================================
   PESQUISA
========================================================= */

searchInput.addEventListener(
  "input",
  applyFilters
);


genreFilter.addEventListener(
  "change",
  applyFilters
);


/* =========================================================
   IDIOMA
========================================================= */

const languageButton =
  document.getElementById(
    "languageButton"
  );

const languageMenu =
  document.getElementById(
    "languageMenu"
  );

const currentLanguage =
  document.getElementById(
    "currentLanguage"
  );


const translations = {

  pt: {

    navCatalog: "Catálogo",
    navList: "Minha Lista",
    randomButton: "🎲 Sortear",
    eyebrow: "PLAYSTATION 2",
    heroTitle: "Encontre seu próximo jogo.",
    heroText:
      "Explore o catálogo, marque o que você já jogou e deixe a sorte escolher sua próxima aventura.",
    randomFive: "🎲 Sortear 5 jogos",
    viewCatalog: "Ver catálogo",
    catalogEyebrow: "CATÁLOGO",
    catalogTitle: "Jogos de PS2",
    genre: "Gênero",
    all: "Todos",
    searchPlaceholder: "Pesquisar jogo...",
    noGames: "Nenhum jogo encontrado",
    noGamesText:
      "Tente outro termo de pesquisa ou altere os filtros.",
    myListEyebrow: "MEU PERFIL",
    myListTitle: "Minha Lista",
    drawEyebrow: "SORTEIO",
    drawTitle: "Seus jogos sorteados",
    reroll: "🎲 Sortear novamente",
    footer:
      "PS2 Randomizer · Projeto em desenvolvimento"
  },


  es: {

    navCatalog: "Catálogo",
    navList: "Mi Lista",
    randomButton: "🎲 Sortear",
    eyebrow: "PLAYSTATION 2",
    heroTitle: "Encuentra tu próximo juego.",
    heroText:
      "Explora el catálogo, marca lo que ya jugaste y deja que la suerte elija tu próxima aventura.",
    randomFive: "🎲 Sortear 5 juegos",
    viewCatalog: "Ver catálogo",
    catalogEyebrow: "CATÁLOGO",
    catalogTitle: "Juegos de PS2",
    genre: "Género",
    all: "Todos",
    searchPlaceholder: "Buscar juego...",
    noGames: "No se encontraron juegos",
    noGamesText:
      "Prueba otro término de búsqueda o cambia los filtros.",
    myListEyebrow: "MI PERFIL",
    myListTitle: "Mi Lista",
    drawEyebrow: "SORTEO",
    drawTitle: "Tus juegos sorteados",
    reroll: "🎲 Sortear de nuevo",
    footer:
      "PS2 Randomizer · Proyecto en desarrollo"
  },


  en: {

    navCatalog: "Catalog",
    navList: "My List",
    randomButton: "🎲 Random",
    eyebrow: "PLAYSTATION 2",
    heroTitle: "Find your next game.",
    heroText:
      "Explore the catalog, mark what you've played and let luck choose your next adventure.",
    randomFive: "🎲 Pick 5 games",
    viewCatalog: "View catalog",
    catalogEyebrow: "CATALOG",
    catalogTitle: "PS2 Games",
    genre: "Genre",
    all: "All",
    searchPlaceholder: "Search game...",
    noGames: "No games found",
    noGamesText:
      "Try another search term or change the filters.",
    myListEyebrow: "MY PROFILE",
    myListTitle: "My List",
    drawEyebrow: "RANDOM",
    drawTitle: "Your random games",
    reroll: "🎲 Pick again",
    footer:
      "PS2 Randomizer · Project in development"
  }

};


function applyLanguage(language) {

  const translation =
    translations[language] ||
    translations.pt;


  document
    .querySelectorAll(
      "[data-i18n]"
    )
    .forEach(element => {

      const key =
        element.dataset.i18n;


      if (
        translation[key] !== undefined
      ) {

        element.textContent =
          translation[key];

      }

    });


  document
    .querySelectorAll(
      "[data-i18n-placeholder]"
    )
    .forEach(element => {

      const key =
        element.dataset
          .i18nPlaceholder;


      if (
        translation[key] !== undefined
      ) {

        element.placeholder =
          translation[key];

      }

    });


  currentLanguage.textContent =
    language.toUpperCase();


  localStorage.setItem(
    "ps2-randomizer-language",
    language
  );
}


languageButton.addEventListener(
  "click",
  event => {

    event.stopPropagation();

    languageMenu.classList.toggle(
      "hidden"
    );

  }
);


languageMenu
  .querySelectorAll(
    "[data-language]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const language =
          button.dataset.language;

        applyLanguage(language);

        languageMenu.classList.add(
          "hidden"
        );

      }
    );

  });


document.addEventListener(
  "click",
  event => {

    if (
      !event.target.closest(
        ".language-selector"
      )
    ) {

      languageMenu.classList.add(
        "hidden"
      );

    }

  }
);


/* =========================================================
   SEGURANÇA / TEXTO
========================================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}


function escapeAttribute(value) {

  return escapeHTML(value);
}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

const savedLanguage =
  localStorage.getItem(
    "ps2-randomizer-language"
  ) || "pt";


applyLanguage(
  savedLanguage
);


loadGames();
