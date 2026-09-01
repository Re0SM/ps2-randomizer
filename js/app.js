const STORAGE_KEY =
  "ps2-randomizer-user-data";

const LANGUAGE_KEY =
  "ps2-randomizer-language";

const GAMES_PER_PAGE = 60;


let games = [];

let currentGame = null;

let lastRandomCount = 5;

let currentPage = 1;


const userData =
  loadUserData();


/* =========================
   TRADUÇÕES
========================= */

const translations = {

  pt: {

    navCatalog: "Catálogo",
    navList: "Minha Lista",
    randomButton: "🎲 Sortear",

    eyebrow: "PLAYSTATION 2",

    heroTitle:
      "Encontre seu próximo jogo.",

    heroText:
      "Explore o catálogo, marque o que você já jogou e deixe a sorte escolher sua próxima aventura.",

    randomFive:
      "🎲 Sortear 5 jogos",

    viewCatalog:
      "Ver catálogo",

    catalogEyebrow:
      "CATÁLOGO",

    catalogTitle:
      "Jogos de PS2",

    searchPlaceholder:
      "Pesquisar jogo...",

    genre:
      "Gênero",

    status:
      "Status",

    all:
      "Todos",

    played:
      "Já joguei",

    backlog:
      "Pretendo jogar",

    favorite:
      "Favoritos",

    noGames:
      "Nenhum jogo encontrado",

    noGamesText:
      "Tente outro termo de pesquisa ou altere os filtros.",

    myListEyebrow:
      "MINHA LISTA",

    myListTitle:
      "Seu progresso",

    drawEyebrow:
      "SORTEIO",

    drawTitle:
      "Seus jogos sorteados",

    reroll:
      "🎲 Sortear novamente",

    footer:
      "PS2 Randomizer · Projeto em desenvolvimento",

    alreadyPlayed:
      "✓ Já joguei",

    markPlayed:
      "☐ Já joguei",

    wantToPlay:
      "✓ Pretendo jogar",

    markBacklog:
      "＋ Pretendo jogar",

    isFavorite:
      "★ Favorito",

    markFavorite:
      "☆ Favorito",

    noDescription:
      "Nenhuma descrição disponível.",

    yearUnknown:
      "Ano não informado",

    ps2:
      "PS2",

    gamesCount:
      "jogos",

    gameCount:
      "jogo",

    previous:
      "<",

    next:
      ">"

  },


  es: {

    navCatalog: "Catálogo",
    navList: "Mi lista",
    randomButton: "🎲 Sortear",

    eyebrow: "PLAYSTATION 2",

    heroTitle:
      "Encuentra tu próximo juego.",

    heroText:
      "Explora el catálogo, marca los juegos que ya jugaste y deja que la suerte elija tu próxima aventura.",

    randomFive:
      "🎲 Sortear 5 juegos",

    viewCatalog:
      "Ver catálogo",

    catalogEyebrow:
      "CATÁLOGO",

    catalogTitle:
      "Juegos de PS2",

    searchPlaceholder:
      "Buscar juego...",

    genre:
      "Género",

    status:
      "Estado",

    all:
      "Todos",

    played:
      "Ya jugué",

    backlog:
      "Quiero jugar",

    favorite:
      "Favoritos",

    noGames:
      "No se encontraron juegos",

    noGamesText:
      "Prueba otro término de búsqueda o cambia los filtros.",

    myListEyebrow:
      "MI LISTA",

    myListTitle:
      "Tu progreso",

    drawEyebrow:
      "SORTEO",

    drawTitle:
      "Tus juegos sorteados",

    reroll:
      "🎲 Sortear de nuevo",

    footer:
      "PS2 Randomizer · Proyecto en desarrollo",

    alreadyPlayed:
      "✓ Ya jugué",

    markPlayed:
      "☐ Ya jugué",

    wantToPlay:
      "✓ Quiero jugar",

    markBacklog:
      "＋ Quiero jugar",

    isFavorite:
      "★ Favorito",

    markFavorite:
      "☆ Favorito",

    yearUnknown:
      "Año no informado",

    ps2:
      "PS2",

    gamesCount:
      "juegos",

    gameCount:
      "juego",

    previous:
      "<",

    next:
      ">"

  },


  en: {

    navCatalog: "Catalog",
    navList: "My List",
    randomButton: "🎲 Random",

    eyebrow: "PLAYSTATION 2",

    heroTitle:
      "Find your next game.",

    heroText:
      "Explore the catalog, mark the games you've played and let luck choose your next adventure.",

    randomFive:
      "🎲 Random 5 games",

    viewCatalog:
      "View catalog",

    catalogEyebrow:
      "CATALOG",

    catalogTitle:
      "PS2 Games",

    searchPlaceholder:
      "Search game...",

    genre:
      "Genre",

    status:
      "Status",

    all:
      "All",

    played:
      "Played",

    backlog:
      "Want to play",

    favorite:
      "Favorites",

    noGames:
      "No games found",

    noGamesText:
      "Try another search term or change the filters.",

    myListEyebrow:
      "MY LIST",

    myListTitle:
      "Your progress",

    drawEyebrow:
      "RANDOM",

    drawTitle:
      "Your random games",

    reroll:
      "🎲 Random again",

    footer:
      "PS2 Randomizer · Project in development",

    alreadyPlayed:
      "✓ Played",

    markPlayed:
      "☐ Played",

    wantToPlay:
      "✓ Want to play",

    markBacklog:
      "＋ Want to play",

    isFavorite:
      "★ Favorite",

    markFavorite:
      "☆ Favorite",

    yearUnknown:
      "Year unavailable",

    ps2:
      "PS2",

    gamesCount:
      "games",

    gameCount:
      "game",

    previous:
      "<",

    next:
      ">"

  }

};


/* =========================
   IDIOMA ATUAL
========================= */

let currentLanguage =
  localStorage.getItem(LANGUAGE_KEY) || "pt";


/* =========================
   ELEMENTOS
========================= */

const elements = {

  gameGrid:
    document.getElementById("gameGrid"),

  emptyState:
    document.getElementById("emptyState"),

  gameCount:
    document.getElementById("gameCount"),

  pagination:
    document.getElementById("pagination"),

  searchInput:
    document.getElementById("searchInput"),

  genreFilter:
    document.getElementById("genreFilter"),

  statusFilter:
    document.getElementById("statusFilter"),

  modal:
    document.getElementById("gameModal"),

  modalCover:
    document.getElementById("modalCover"),

  modalTitle:
    document.getElementById("modalTitle"),

  modalGenre:
    document.getElementById("modalGenre"),

  modalMeta:
    document.getElementById("modalMeta"),

  togglePlayed:
    document.getElementById("togglePlayed"),

  toggleBacklog:
    document.getElementById("toggleBacklog"),

  toggleFavorite:
    document.getElementById("toggleFavorite"),

  randomModal:
    document.getElementById("randomModal"),

  randomResults:
    document.getElementById("randomResults"),

  rerollButton:
    document.getElementById("rerollButton"),

  playedCount:
    document.getElementById("playedCount"),

  backlogCount:
    document.getElementById("backlogCount"),

  favoriteCount:
    document.getElementById("favoriteCount"),

  languageButton:
    document.getElementById("languageButton"),

  languageMenu:
    document.getElementById("languageMenu"),

  currentLanguage:
    document.getElementById("currentLanguage")

};


/* =========================
   INICIALIZAÇÃO
========================= */

document.addEventListener(
  "DOMContentLoaded",
  init
);


async function init() {

  applyTranslations();

  bindLanguageEvents();

  try {

    const response =
      await fetch("data/games.json");


    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }


    games =
      await response.json();


    setupGenres();

    renderCatalog();

    updateStats();

    bindEvents();

  } catch (error) {

    console.error(error);


    elements.gameGrid.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">
          ⚠️
        </div>

        <h3>
          Não foi possível carregar o catálogo
        </h3>

        <p>
          Abra o projeto através de um servidor local
          ou pela hospedagem do GitHub Pages.
        </p>

      </div>

    `;

  }

}


/* =========================
   IDIOMAS
========================= */

function t(key) {

  return (
    translations[currentLanguage]?.[key] ??
    translations.pt[key] ??
    key
  );

}


function applyTranslations() {

  document.documentElement.lang =
    currentLanguage === "pt"
      ? "pt-BR"
      : currentLanguage === "es"
        ? "es"
        : "en";


  document
    .querySelectorAll("[data-i18n]")
    .forEach((element) => {

      const key =
        element.dataset.i18n;

      const translation =
        t(key);

      if (translation) {

        element.textContent =
          translation;

      }

    });


  document
    .querySelectorAll("[data-i18n-placeholder]")
    .forEach((element) => {

      const key =
        element.dataset.i18nPlaceholder;

      element.placeholder =
        t(key);

    });


  elements.currentLanguage.textContent =
    currentLanguage.toUpperCase();


  document.title =
    "PS2 Randomizer";

}


function setLanguage(language) {

  if (!translations[language]) {
    return;
  }


  currentLanguage =
    language;


  localStorage.setItem(
    LANGUAGE_KEY,
    language
  );


  elements.languageMenu
    .classList.add("hidden");


  applyTranslations();

  setupGenres();

  renderCatalog();

  updateStats();


  if (currentGame) {

    updateActionButtons();

  }

}


function bindLanguageEvents() {

  elements.languageButton
    .addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        elements.languageMenu
          .classList.toggle("hidden");

      }
    );


  elements.languageMenu
    .querySelectorAll("button")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          setLanguage(
            button.dataset.language
          );

        }
      );

    });


  document.addEventListener(
    "click",
    (event) => {

      if (
        !event.target.closest(
          ".language-selector"
        )
      ) {

        elements.languageMenu
          .classList.add("hidden");

      }

    }
  );

}


/* =========================
   EVENTOS
========================= */

function bindEvents() {

  elements.searchInput
    .addEventListener(
      "input",
      () => {

        currentPage = 1;

        renderCatalog();

      }
    );


  elements.genreFilter
    .addEventListener(
      "change",
      () => {

        currentPage = 1;

        renderCatalog();

      }
    );


  elements.statusFilter
    .addEventListener(
      "change",
      () => {

        currentPage = 1;

        renderCatalog();

      }
    );


  document
    .getElementById("randomOneTop")
    .addEventListener(
      "click",
      () => openRandomModal(1)
    );


  document
    .getElementById("randomFiveHero")
    .addEventListener(
      "click",
      () => openRandomModal(5)
    );


  elements.rerollButton
    .addEventListener(
      "click",
      () =>
        renderRandomResults(
          lastRandomCount
        )
    );


  elements.togglePlayed
    .addEventListener(
      "click",
      () =>
        toggleStatus("played")
    );


  elements.toggleBacklog
    .addEventListener(
      "click",
      () =>
        toggleStatus("backlog")
    );


  elements.toggleFavorite
    .addEventListener(
      "click",
      () =>
        toggleStatus("favorite")
    );


  document
    .querySelectorAll("[data-close-modal]")
    .forEach((element) => {

      element.addEventListener(
        "click",
        closeGameModal
      );

    });


  document
    .querySelectorAll("[data-close-random]")
    .forEach((element) => {

      element.addEventListener(
        "click",
        closeRandomModal
      );

    });


  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {

        closeGameModal();

        closeRandomModal();

      }

    }
  );

}


/* =========================
   GÊNEROS
========================= */

function setupGenres() {

  const genres = [

    ...new Set(

      games.flatMap(
        game => {

          if (
            Array.isArray(game.genre)
          ) {

            return game.genre;

          }


          if (
            Array.isArray(game.genres)
          ) {

            return game.genres;

          }


          if (
            typeof game.genre === "string"
          ) {

            return [game.genre];

          }


          return [];

        }
      )

    )

  ].sort(
    (a, b) =>
      a.localeCompare(
        b,
        currentLanguage === "pt"
          ? "pt-BR"
          : currentLanguage
      )
  );


  elements.genreFilter.innerHTML = `

    <option value="all">
      ${t("all")}
    </option>

  `;


  for (const genre of genres) {

    const option =
      document.createElement("option");


    option.value =
      genre;


    option.textContent =
      genre;


    elements.genreFilter
      .appendChild(option);

  }

}


/* =========================
   CATÁLOGO
========================= */

function renderCatalog() {

  const query =
    normalize(
      elements.searchInput.value
    );


  const genre =
    elements.genreFilter.value;


  const status =
    elements.statusFilter.value;


  const filtered =
    games.filter((game) => {

      const matchesSearch =

        !query ||

        normalize(game.title)
          .includes(query) ||

        normalize(game.developer)
          .includes(query) ||

        normalize(game.publisher)
          .includes(query);


      const gameGenres =
        Array.isArray(game.genre)
          ? game.genre
          : Array.isArray(game.genres)
            ? game.genres
            : typeof game.genre === "string"
              ? [game.genre]
              : [];


      const matchesGenre =

        genre === "all" ||

        gameGenres.includes(genre);


      const matchesStatus =

        status === "all" ||

        userData[status]?.includes(
          game.id
        );


      return (
        matchesSearch &&
        matchesGenre &&
        matchesStatus
      );

    });


  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filtered.length /
        GAMES_PER_PAGE
      )
    );


  if (
    currentPage > totalPages
  ) {

    currentPage =
      totalPages;

  }


  const start =
    (currentPage - 1) *
    GAMES_PER_PAGE;


  const pageGames =
    filtered.slice(
      start,
      start + GAMES_PER_PAGE
    );


  elements.gameGrid.innerHTML =
    "";


  elements.gameCount.textContent =
    `${filtered.length} ${
      filtered.length === 1
        ? t("gameCount")
        : t("gamesCount")
    }`;


  elements.emptyState
    .classList.toggle(
      "hidden",
      filtered.length > 0
    );


  for (const game of pageGames) {

    elements.gameGrid.appendChild(
      createGameCard(game)
    );

  }


  renderPagination(
    filtered.length,
    totalPages
  );

}


/* =========================
   CARD DO JOGO
========================= */

function createGameCard(game) {

  const card =
    document.createElement("article");


  card.className =
    "game-card";


  card.tabIndex =
    0;


  const cover =
    document.createElement("div");


  cover.className =
    "cover-wrap";


  if (game.cover) {

    const img =
      document.createElement("img");


    img.src =
      game.cover;


    img.alt =
      `Capa de ${game.title}`;


    img.loading =
      "lazy";


    img.onerror =
      () => {

        img.remove();


        cover.appendChild(
          createPlaceholder(
            game.title
          )
        );

      };


    cover.appendChild(img);

  } else {

    cover.appendChild(
      createPlaceholder(
        game.title
      )
    );

  }


  const badges =
    document.createElement("div");


  badges.className =
    "status-badges";


  if (
    userData.favorite
      .includes(game.id)
  ) {

    badges.appendChild(
      createBadge("★")
    );

  }


  if (
    userData.played
      .includes(game.id)
  ) {

    badges.appendChild(
      createBadge(
        currentLanguage === "pt"
          ? "JOGADO"
          : currentLanguage === "es"
            ? "JUGADO"
            : "PLAYED"
      )
    );

  }


  if (
    userData.backlog
      .includes(game.id)
  ) {

    badges.appendChild(
      createBadge(
        currentLanguage === "pt"
          ? "LISTA"
          : currentLanguage === "es"
            ? "LISTA"
            : "BACKLOG"
      )
    );

  }


  cover.appendChild(
    badges
  );


  card.appendChild(
    cover
  );


  const title =
    document.createElement("h3");


  title.className =
    "game-title";


  title.textContent =
    game.title;


  card.appendChild(
    title
  );


  const year =
    document.createElement("p");


  year.className =
    "game-year";


  year.textContent =
    game.year ||
    t("yearUnknown");


  card.appendChild(
    year
  );


  card.addEventListener(
    "click",
    () => openGameModal(game)
  );


  card.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();

        openGameModal(game);

      }

    }
  );


  return card;

}


/* =========================
   PLACEHOLDER
========================= */

function createPlaceholder(
  title = "CAPA"
) {

  const placeholder =
    document.createElement("div");


  placeholder.className =
    "cover-placeholder";


  placeholder.textContent =
    title;


  return placeholder;

}


/* =========================
   BADGE
========================= */

function createBadge(text) {

  const badge =
    document.createElement("span");


  badge.className =
    "badge";


  badge.textContent =
    text;


  return badge;

}


/* =========================
   MODAL DO JOGO
========================= */

function openGameModal(game) {

  currentGame =
    game;


  elements.modalTitle.textContent =
    game.title;


  const gameGenres =
    Array.isArray(game.genre)
      ? game.genre
      : Array.isArray(game.genres)
        ? game.genres
        : typeof game.genre === "string"
          ? [game.genre]
          : [];


  elements.modalGenre.textContent =
    gameGenres.join(" · ") ||
    t("ps2");


  const meta = [

    game.year,

    game.developer,

    game.publisher

  ]
    .filter(Boolean)
    .join(" · ");


  elements.modalMeta.textContent =
    meta ||
    t("yearUnknown");


  elements.modalCover.innerHTML =
    "";


  if (game.cover) {

    const img =
      document.createElement("img");


    img.src =
      game.cover;


    img.alt =
      `Capa de ${game.title}`;


    img.onerror =
      () => {

        img.remove();


        elements.modalCover
          .appendChild(
            createPlaceholder(
              game.title
            )
          );

      };


    elements.modalCover
      .appendChild(img);

  } else {

    elements.modalCover
      .appendChild(
        createPlaceholder(
          game.title
        )
      );

  }


  updateActionButtons();


  elements.modal
    .classList.remove(
      "hidden"
    );


  document.body
    .classList.add(
      "modal-open"
    );

}


/* =========================
   FECHAR MODAL
========================= */

function closeGameModal() {

  elements.modal
    .classList.add(
      "hidden"
    );


  currentGame =
    null;


  document.body
    .classList.remove(
      "modal-open"
    );

}


/* =========================
   BOTÕES DO MODAL
========================= */

function updateActionButtons() {

  if (!currentGame) {
    return;
  }


  const played =
    userData.played
      .includes(
        currentGame.id
      );


  const backlog =
    userData.backlog
      .includes(
        currentGame.id
      );


  const favorite =
    userData.favorite
      .includes(
        currentGame.id
      );


  elements.togglePlayed
    .classList.toggle(
      "active",
      played
    );


  elements.toggleBacklog
    .classList.toggle(
      "active",
      backlog
    );


  elements.toggleFavorite
    .classList.toggle(
      "active",
      favorite
    );


  elements.togglePlayed
    .textContent =

      played
        ? t("alreadyPlayed")
        : t("markPlayed");


  elements.toggleBacklog
    .textContent =

      backlog
        ? t("wantToPlay")
        : t("markBacklog");


  elements.toggleFavorite
    .textContent =

      favorite
        ? t("isFavorite")
        : t("markFavorite");

}


/* =========================
   ALTERAR STATUS
========================= */

function toggleStatus(type) {

  if (!currentGame) {
    return;
  }


  const list =
    userData[type];


  const index =
    list.indexOf(
      currentGame.id
    );


  if (index >= 0) {

    list.splice(
      index,
      1
    );

  } else {

    list.push(
      currentGame.id
    );

  }


  saveUserData();

  updateActionButtons();

  updateStats();

  renderCatalog();

}


/* =========================
   SORTEIO
========================= */

function openRandomModal(count) {

  lastRandomCount =
    count;


  renderRandomResults(
    count
  );


  elements.randomModal
    .classList.remove(
      "hidden"
    );


  document.body
    .classList.add(
      "modal-open"
    );

}


function closeRandomModal() {

  elements.randomModal
    .classList.add(
      "hidden"
    );


  document.body
    .classList.remove(
      "modal-open"
    );

}


function renderRandomResults(count) {

  const pool =
    [...games];


  if (pool.length === 0) {

    elements.randomResults.innerHTML =
      "<p>O catálogo está vazio.</p>";

    return;

  }


  const results =
    shuffle(pool)
      .slice(
        0,
        Math.min(
          count,
          pool.length
        )
      );


  elements.randomResults.innerHTML =
    "";


  for (const game of results) {

    const card =
      document.createElement(
        "article"
      );


    card.className =
      "random-card";


    card.appendChild(
      createGameCard(game)
    );


    card.addEventListener(
      "click",
      (event) => {

        if (
          event.target.closest(
            "button, a"
          )
        ) {

          return;

        }


        closeRandomModal();

        openGameModal(game);

      }
    );


    elements.randomResults
      .appendChild(card);

  }

}


/* =========================
   PAGINAÇÃO
========================= */

function renderPagination(
  totalGames,
  totalPages
) {

  elements.pagination.innerHTML =
    "";


  if (
    totalGames <= GAMES_PER_PAGE
  ) {

    return;

  }


  const createButton =
    (
      text,
      page,
      disabled = false,
      active = false
    ) => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "pagination-button";


      button.textContent =
        text;


      button.disabled =
        disabled;


      if (active) {

        button.classList.add(
          "active"
        );

      }


      if (!disabled) {

        button.addEventListener(
          "click",
          () => {

            currentPage =
              page;

            renderCatalog();


            document
              .getElementById(
                "catalogo"
              )
              .scrollIntoView({
                behavior: "smooth",
                block: "start"
              });

          }
        );

      }


      return button;

    };


  elements.pagination
    .appendChild(

      createButton(
        t("previous"),
        currentPage - 1,
        currentPage === 1
      )

    );


  const pages =
    getPaginationPages(
      currentPage,
      totalPages
    );


  for (const page of pages) {

    if (page === "...") {

      const dots =
        document.createElement(
          "span"
        );


      dots.className =
        "pagination-dots";


      dots.textContent =
        "...";


      elements.pagination
        .appendChild(dots);


      continue;

    }


    elements.pagination
      .appendChild(

        createButton(
          page,
          page,
          false,
          page === currentPage
        )

      );

  }


  elements.pagination
    .appendChild(

      createButton(
        t("next"),
        currentPage + 1,
        currentPage === totalPages
      )

    );

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


  if (current <= 4) {

    return [
      1,
      2,
      3,
      4,
      5,
      "...",
      total
    ];

  }


  if (current >= total - 3) {

    return [
      1,
      "...",
      total - 4,
      total - 3,
      total - 2,
      total - 1,
      total
    ];

  }


  return [

    1,

    "...",

    current - 1,

    current,

    current + 1,

    "...",

    total

  ];

}


/* =========================
   EMBARALHAR
========================= */

function shuffle(array) {

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );


    [
      array[i],
      array[j]
    ] = [
      array[j],
      array[i]
    ];

  }


  return array;

}


/* =========================
   LOCAL STORAGE
========================= */

function loadUserData() {

  const fallback = {

    played: [],

    backlog: [],

    favorite: []

  };


  try {

    const saved =
      JSON.parse(
        localStorage.getItem(
          STORAGE_KEY
        )
      );


    if (
      !saved ||
      typeof saved !== "object"
    ) {

      return fallback;

    }


    return {

      played:
        Array.isArray(saved.played)
          ? saved.played
          : [],

      backlog:
        Array.isArray(saved.backlog)
          ? saved.backlog
          : [],

      favorite:
        Array.isArray(saved.favorite)
          ? saved.favorite
          : []

    };

  } catch {

    return fallback;

  }

}


function saveUserData() {

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(
      userData
    )

  );

}


/* =========================
   ESTATÍSTICAS
========================= */

function updateStats() {

  elements.playedCount.textContent =
    userData.played.length;


  elements.backlogCount.textContent =
    userData.backlog.length;


  elements.favoriteCount.textContent =
    userData.favorite.length;

}


/* =========================
   NORMALIZAÇÃO
========================= */

function normalize(value) {

  return String(
    value ?? ""
  )

    .normalize("NFD")

    .replace(
      /[\u0300-\u036f]/g,
      ""
    )

    .toLowerCase()

    .trim();

}
