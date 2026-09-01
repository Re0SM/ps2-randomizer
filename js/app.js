"use strict";

/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const GAMES_URL = "data/games.json";

const STORAGE_KEY = "ps2-randomizer-user";

const GAMES_PER_PAGE = 48;


/* =========================================================
   ESTADO
========================================================= */

let games = [];

let filteredGames = [];

let currentPage = 1;

let currentRandomCount = 5;

let currentGame = null;

let currentLanguage = "pt";

let myListTab = "played";


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

const statusFilter =
  document.getElementById("statusFilter");

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

const togglePlayed =
  document.getElementById("togglePlayed");

const toggleBacklog =
  document.getElementById("toggleBacklog");

const toggleFavorite =
  document.getElementById("toggleFavorite");

const randomModal =
  document.getElementById("randomModal");

const randomResults =
  document.getElementById("randomResults");

const rerollButton =
  document.getElementById("rerollButton");

const randomOneTop =
  document.getElementById("randomOneTop");

const randomFiveHero =
  document.getElementById("randomFiveHero");

const languageButton =
  document.getElementById("languageButton");

const languageMenu =
  document.getElementById("languageMenu");

const currentLanguageElement =
  document.getElementById("currentLanguage");

const myListSection =
  document.getElementById("minha-lista");


/* =========================================================
   TRADUÇÕES
========================================================= */

const translations = {

  pt: {
    navCatalog: "Catálogo",
    navList: "Minha Lista",
    randomButton: "🎲 Sortear",
    randomFive: "🎲 Sortear 5 jogos",
    eyebrow: "PLAYSTATION 2",
    heroTitle: "Encontre seu próximo jogo.",
    heroText:
      "Explore o catálogo, marque o que você já jogou e deixe a sorte escolher sua próxima aventura.",
    viewCatalog: "Ver catálogo",
    catalogEyebrow: "CATÁLOGO",
    catalogTitle: "Jogos de PS2",
    genre: "Gênero",
    all: "Todos",
    searchPlaceholder: "Pesquisar jogo...",
    myListEyebrow: "MINHA LISTA",
    myListTitle: "Seu perfil",
    played: "Já joguei",
    backlog: "Pretendo jogar",
    favorite: "Favoritos",
    noGames: "Nenhum jogo encontrado",
    noGamesText:
      "Tente outro termo de pesquisa ou altere os filtros.",
    drawEyebrow: "SORTEIO",
    drawTitle: "Seus jogos sorteados",
    reroll: "🎲 Sortear novamente",
    footer:
      "PS2 Randomizer · Projeto em desenvolvimento",
    noList:
      "Você ainda não adicionou nenhum jogo a esta lista.",
    markPlayed: "☐ Já joguei",
    markedPlayed: "☑ Já joguei",
    markBacklog: "＋ Pretendo jogar",
    markedBacklog: "✓ Pretendo jogar",
    markFavorite: "☆ Favorito",
    markedFavorite: "★ Favorito"
  },

  es: {
    navCatalog: "Catálogo",
    navList: "Mi Lista",
    randomButton: "🎲 Sortear",
    randomFive: "🎲 Sortear 5 juegos",
    eyebrow: "PLAYSTATION 2",
    heroTitle: "Encuentra tu próximo juego.",
    heroText:
      "Explora el catálogo, marca lo que ya jugaste y deja que la suerte elija tu próxima aventura.",
    viewCatalog: "Ver catálogo",
    catalogEyebrow: "CATÁLOGO",
    catalogTitle: "Juegos de PS2",
    genre: "Género",
    all: "Todos",
    searchPlaceholder: "Buscar juego...",
    myListEyebrow: "MI LISTA",
    myListTitle: "Tu perfil",
    played: "Ya jugué",
    backlog: "Quiero jugar",
    favorite: "Favoritos",
    noGames: "No se encontraron juegos",
    noGamesText:
      "Prueba otro término de búsqueda o cambia los filtros.",
    drawEyebrow: "SORTEO",
    drawTitle: "Tus juegos sorteados",
    reroll: "🎲 Sortear nuevamente",
    footer:
      "PS2 Randomizer · Proyecto en desarrollo",
    noList:
      "Todavía no has añadido ningún juego a esta lista.",
    markPlayed: "☐ Ya jugué",
    markedPlayed: "☑ Ya jugué",
    markBacklog: "＋ Quiero jugar",
    markedBacklog: "✓ Quiero jugar",
    markFavorite: "☆ Favorito",
    markedFavorite: "★ Favorito"
  },

  en: {
    navCatalog: "Catalog",
    navList: "My List",
    randomButton: "🎲 Random",
    randomFive: "🎲 Randomize 5 games",
    eyebrow: "PLAYSTATION 2",
    heroTitle: "Find your next game.",
    heroText:
      "Explore the catalog, mark what you've played and let luck choose your next adventure.",
    viewCatalog: "View catalog",
    catalogEyebrow: "CATALOG",
    catalogTitle: "PS2 Games",
    genre: "Genre",
    all: "All",
    searchPlaceholder: "Search game...",
    myListEyebrow: "MY LIST",
    myListTitle: "Your profile",
    played: "Played",
    backlog: "Want to play",
    favorite: "Favorites",
    noGames: "No games found",
    noGamesText:
      "Try another search term or change the filters.",
    drawEyebrow: "RANDOMIZER",
    drawTitle: "Your random games",
    reroll: "🎲 Randomize again",
    footer:
      "PS2 Randomizer · Project in development",
    noList:
      "You haven't added any games to this list yet.",
    markPlayed: "☐ Played",
    markedPlayed: "☑ Played",
    markBacklog: "＋ Want to play",
    markedBacklog: "✓ Want to play",
    markFavorite: "☆ Favorite",
    markedFavorite: "★ Favorite"
  }

};


/* =========================================================
   PERFIL LOCAL
========================================================= */

function getUserData() {

  try {

    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (!saved) {

      return {
        played: [],
        backlog: [],
        favorites: []
      };

    }

    const data =
      JSON.parse(saved);

    return {

      played:
        Array.isArray(data.played)
          ? data.played
          : [],

      backlog:
        Array.isArray(data.backlog)
          ? data.backlog
          : [],

      favorites:
        Array.isArray(data.favorites)
          ? data.favorites
          : []

    };

  } catch {

    return {
      played: [],
      backlog: [],
      favorites: []
    };

  }

}


function saveUserData(data) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );

}


/* =========================================================
   IDENTIFICADOR DO JOGO
========================================================= */

function gameId(game) {

  if (game.serial) {
    return String(game.serial);
  }

  return normalizeSearch(
    game.title
  );

}


/* =========================================================
   NORMALIZAÇÃO
========================================================= */

function normalizeSearch(value) {

  return String(value || "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      " "
    )
    .trim();

}


/* =========================================================
   GÊNEROS
========================================================= */

function normalizeGenre(value) {

  if (!value) {
    return "";
  }

  const map = {

    "action": "Ação",
    "action.": "Ação",

    "action rpg": "RPG",
    "action rpg.": "RPG",

    "action-adventure":
      "Ação em terceira pessoa",

    "action adventure":
      "Ação em terceira pessoa",

    "adventure":
      "Adventure",

    "adventure.":
      "Adventure",

    "beat'em up":
      "Briga de Rua",

    "beat'em up.":
      "Briga de Rua",

    "beat'em Up":
      "Briga de Rua",

    "beat'em Up.":
      "Briga de Rua",

    "beat 'em up":
      "Briga de Rua",

    "beat 'em up.":
      "Briga de Rua",

    "soccer":
      "Futebol",

    "soccer.":
      "Futebol",

    "football":
      "Futebol",

    "football.":
      "Futebol",

    "soccer manager":
      "Gerente de Esportes",

    "soccer manager.":
      "Gerente de Esportes",

    "soccer management":
      "Gerente de Esportes",

    "soccer management.":
      "Gerente de Esportes",

    "visual novel":
      "Visual Novel",

    "visual novel.":
      "Visual Novel",

    "platformer":
      "Plataforma",

    "platformer.":
      "Plataforma",

    "plataformer":
      "Plataforma",

    "plataformer.":
      "Plataforma",

    "first person shooter":
      "Tiro em Primeira Pessoa",

    "first person shooter.":
      "Tiro em Primeira Pessoa",

    "first-person shooter":
      "Tiro em Primeira Pessoa",

    "first-person shooter.":
      "Tiro em Primeira Pessoa",

    "survival horror":
      "Terror de Sobrevivência",

    "survival horror.":
      "Terror de Sobrevivência",

    "tactical rpg":
      "RPG",

    "tactical rpg.":
      "RPG",

    "fighting":
      "Luta",

    "racing":
      "Corrida",

    "sports":
      "Esportes",

    "strategy":
      "Estratégia",

    "simulation":
      "Simulação",

    "puzzle":
      "Quebra-Cabeça",

    "shooter":
      "Tiro",

    "rhythm":
      "Ritmo",

    "music":
      "Ritmo",

    "dancing":
      "Ritmo",

    "party":
      "Variedades",

    "mini games":
      "Variedades",

    "mini games.":
      "Variedades",

    "other":
      "Variedades",

    "quiz":
      "Quiz",

    "trivia":
      "Quiz",

    "card":
      "Cartas",

    "card battle":
      "Cartas",

    "poker":
      "Cartas",

    "hanafuda":
      "Cartas",

    "board":
      "Tabuleiro",

    "chess":
      "Tabuleiro",

    "mahjong":
      "Tabuleiro",

    "shogi":
      "Tabuleiro",

    "igo":
      "Tabuleiro",

    "baseball":
      "Baseball",

    "basketball":
      "Basquete",

    "boxing":
      "Boxe",

    "golf":
      "Golfe",

    "tennis":
      "Tênis",

    "wrestling":
      "Luta Livre",

    "mmorpg":
      "MMORPG",

    "fishing":
      "Pesca",

    "pinball":
      "Pinball",

    "typing":
      "Digitação",

    "educational":
      "Educação",

    "edutainment":
      "Educação",

    "interactive movie":
      "Animação Interativa",

    "light gun shooter":
      "Pistola",

    "gun":
      "Pistola",

    "shoot 'em up":
      "Nave",

    "roguelike":
      "Roguelike"

  };

  const clean =
    String(value)
      .trim()
      .replace(/\.+$/, "");

  const key =
    clean.toLowerCase();

  return map[key] || clean;

}


/* =========================================================
   STATUS
========================================================= */

function hasStatus(game, status) {

  const data =
    getUserData();

  const id =
    gameId(game);

  return data[status]
    .includes(id);

}


function toggleStatus(
  game,
  status
) {

  const data =
    getUserData();

  const id =
    gameId(game);

  const list =
    data[status];

  const index =
    list.indexOf(id);

  if (index >= 0) {

    list.splice(
      index,
      1
    );

  } else {

    list.push(id);

  }

  saveUserData(data);

  renderCatalog();

  if (currentGame) {

    updateModalButtons();

  }

  if (
    myListSection &&
    !myListSection.classList.contains("hidden")
  ) {

    renderMyList();

  }

}


/* =========================================================
   CAPA
========================================================= */

function coverHTML(game) {

  if (
    game.cover &&
    String(game.cover).trim()
  ) {

    return `
      <img
        src="${escapeAttribute(game.cover)}"
        alt="${escapeAttribute(game.title)}"
        loading="lazy"
        onerror="this.style.display='none';this.nextElementSibling.style.display='grid';"
      >
      <div
        class="cover-placeholder"
        style="display:none"
      >
        ${escapeHTML(game.title)}
      </div>
    `;

  }

  return `
    <div class="cover-placeholder">
      ${escapeHTML(game.title)}
    </div>
  `;

}


/* =========================================================
   CARD
========================================================= */

function gameCardHTML(
  game,
  random = false
) {

  const played =
    hasStatus(
      game,
      "played"
    );

  const backlog =
    hasStatus(
      game,
      "backlog"
    );

  const favorite =
    hasStatus(
      game,
      "favorites"
    );

  return `
    <article
      class="${random ? "random-card" : "game-card"}"
      data-game-id="${escapeAttribute(gameId(game))}"
    >

      <div class="cover-wrap">

        ${coverHTML(game)}

        <div class="status-badges">

          ${
            played
              ? `<span class="badge">✓</span>`
              : ""
          }

          ${
            backlog
              ? `<span class="badge">＋</span>`
              : ""
          }

          ${
            favorite
              ? `<span class="badge">★</span>`
              : ""
          }

        </div>

      </div>

      <div class="game-title">
        ${escapeHTML(game.title)}
      </div>

      ${
        game.year
          ? `
            <div class="game-year">
              ${escapeHTML(game.year)}
            </div>
          `
          : ""
      }

    </article>
  `;

}


/* =========================================================
   CATÁLOGO
========================================================= */

function renderCatalog() {

  if (!gameGrid) {
    return;
  }

  applyFilters();

  const start =
    (currentPage - 1) *
    GAMES_PER_PAGE;

  const end =
    start +
    GAMES_PER_PAGE;

  const pageGames =
    filteredGames.slice(
      start,
      end
    );

  gameGrid.innerHTML =
    pageGames
      .map(game => gameCardHTML(game))
      .join("");

  if (emptyState) {

    emptyState.classList.toggle(
      "hidden",
      filteredGames.length !== 0
    );

  }

  renderPagination();

}


/* =========================================================
   FILTROS
========================================================= */

function applyFilters() {

  const search =
    normalizeSearch(
      searchInput?.value || ""
    );

  const selectedGenre =
    genreFilter?.value || "all";

  const selectedStatus =
    statusFilter?.value || "all";

  filteredGames =
    games.filter(game => {

      const title =
        normalizeSearch(
          game.title
        );

      const serial =
        normalizeSearch(
          game.serial
        );

      const matchesSearch =
        !search ||
        title.includes(search) ||
        serial.includes(search);

      const gameGenre =
        normalizeGenre(
          game.genre
        );

      const matchesGenre =
        selectedGenre === "all" ||
        gameGenre === selectedGenre;

      const matchesStatus =
        selectedStatus === "all" ||
        hasStatus(
          game,
          selectedStatus === "favorite"
            ? "favorites"
            : selectedStatus
        );

      return (
        matchesSearch &&
        matchesGenre &&
        matchesStatus
      );

    });

}


/* =========================================================
   GÊNEROS DO SELECT
========================================================= */

function populateGenres() {

  if (!genreFilter) {
    return;
  }

  const genres =
    new Set();

  for (const game of games) {

    const genre =
      normalizeGenre(
        game.genre
      );

    if (genre) {
      genres.add(genre);
    }

  }

  const sorted =
    [...genres].sort(
      (a, b) =>
        a.localeCompare(
          b,
          "pt-BR"
        )
    );

  genreFilter.innerHTML = `
    <option value="all">
      ${escapeHTML(
        translations[currentLanguage].all
      )}
    </option>
  `;

  for (const genre of sorted) {

    const option =
      document.createElement(
        "option"
      );

    option.value = genre;

    option.textContent = genre;

    genreFilter.appendChild(
      option
    );

  }

}


/* =========================================================
   PAGINAÇÃO
========================================================= */

function renderPagination() {

  if (!pagination) {
    return;
  }

  const totalPages =
    Math.ceil(
      filteredGames.length /
      GAMES_PER_PAGE
    );

  pagination.innerHTML = "";

  if (totalPages <= 1) {
    return;
  }

  function addButton(
    label,
    page,
    active = false,
    disabled = false
  ) {

    const button =
      document.createElement(
        "button"
      );

    button.className =
      "pagination-button";

    if (active) {
      button.classList.add(
        "active"
      );
    }

    button.disabled =
      disabled;

    button.textContent =
      label;

    button.addEventListener(
      "click",
      () => {

        currentPage =
          page;

        renderCatalog();

        document
          .getElementById("catalogo")
          ?.scrollIntoView({
            behavior: "smooth"
          });

      }
    );

    pagination.appendChild(
      button
    );

  }


  addButton(
    "‹",
    currentPage - 1,
    false,
    currentPage === 1
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
        "…";

      pagination.appendChild(
        dots
      );

    } else {

      addButton(
        String(page),
        page,
        page === currentPage
      );

    }

  }


  addButton(
    "›",
    currentPage + 1,
    false,
    currentPage === totalPages
  );

}


function getPaginationPages(
  current,
  total
) {

  if (total <= 7) {

    return Array.from(
      {
        length: total
      },
      (_, i) => i + 1
    );

  }

  const pages = [
    1
  ];

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

function openGameModal(game) {

  currentGame =
    game;

  if (!gameModal) {
    return;
  }

  modalTitle.textContent =
    game.title;

  modalGenre.textContent =
    normalizeGenre(
      game.genre
    ) || "PLAYSTATION 2";

  const meta = [];

  if (game.year) {
    meta.push(
      String(game.year)
    );
  }

  if (game.developer) {
    meta.push(
      String(game.developer)
    );
  }

  if (game.publisher) {
    meta.push(
      String(game.publisher)
    );
  }

  if (game.serial) {
    meta.push(
      String(game.serial)
    );
  }

  modalMeta.textContent =
    meta.join(" · ");

  modalCover.innerHTML =
    coverHTML(game);

  updateModalButtons();

  gameModal.classList.remove(
    "hidden"
  );

  document.body.classList.add(
    "modal-open"
  );

}


function closeGameModal() {

  if (!gameModal) {
    return;
  }

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

  const t =
    translations[currentLanguage];

  const played =
    hasStatus(
      currentGame,
      "played"
    );

  const backlog =
    hasStatus(
      currentGame,
      "backlog"
    );

  const favorite =
    hasStatus(
      currentGame,
      "favorites"
    );


  togglePlayed.textContent =
    played
      ? t.markedPlayed
      : t.markPlayed;

  toggleBacklog.textContent =
    backlog
      ? t.markedBacklog
      : t.markBacklog;

  toggleFavorite.textContent =
    favorite
      ? t.markedFavorite
      : t.markFavorite;


  togglePlayed.classList.toggle(
    "active",
    played
  );

  toggleBacklog.classList.toggle(
    "active",
    backlog
  );

  toggleFavorite.classList.toggle(
    "active",
    favorite
  );

}


/* =========================================================
   SORTEIO
========================================================= */

function randomGames(count) {

  if (!games.length) {
    return [];
  }

  const available =
    [...games];

  const result = [];

  while (
    result.length < count &&
    available.length
  ) {

    const index =
      Math.floor(
        Math.random() *
        available.length
      );

    result.push(
      available.splice(
        index,
        1
      )[0]
    );

  }

  return result;

}


function openRandomModal(
  count
) {

  currentRandomCount =
    count;

  const selected =
    randomGames(count);

  randomResults.innerHTML =
    selected
      .map(game =>
        gameCardHTML(
          game,
          true
        )
      )
      .join("");

  randomModal.classList.remove(
    "hidden"
  );

  document.body.classList.add(
    "modal-open"
  );

}


function closeRandomModal() {

  randomModal.classList.add(
    "hidden"
  );

  document.body.classList.remove(
    "modal-open"
  );

}


/* =========================================================
   MINHA LISTA
========================================================= */

function setupMyListPage() {

  if (!myListSection) {
    return;
  }

  /*
   * A seção original continua no HTML.
   * Nós substituímos o conteúdo por uma tela
   * de perfil local.
   */

  myListSection.innerHTML = `

    <div class="my-profile">

      <div class="section-heading">

        <div>

          <p
            class="eyebrow"
            data-i18n="myListEyebrow"
          >
            MINHA LISTA
          </p>

          <h2
            data-i18n="myListTitle"
          >
            Seu perfil
          </h2>

        </div>

      </div>


      <div
        class="my-list-tabs"
        role="tablist"
      >

        <button
          class="my-list-tab"
          data-list-tab="played"
          role="tab"
        >
          ✓
          <span data-i18n="played">
            Já joguei
          </span>
        </button>


        <button
          class="my-list-tab"
          data-list-tab="backlog"
          role="tab"
        >
          ＋
          <span data-i18n="backlog">
            Pretendo jogar
          </span>
        </button>


        <button
          class="my-list-tab"
          data-list-tab="favorites"
          role="tab"
        >
          ★
          <span data-i18n="favorite">
            Favoritos
          </span>
        </button>

      </div>


      <div
        id="myListGrid"
        class="game-grid my-list-grid"
      ></div>


      <div
        id="myListEmpty"
        class="empty-state hidden"
      >

        <div class="empty-icon">
          🎮
        </div>

        <h3>
          ${escapeHTML(
            translations[currentLanguage].noList
          )}
        </h3>

      </div>

    </div>

  `;


  document
    .querySelectorAll(
      "[data-list-tab]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          myListTab =
            button.dataset.listTab;

          renderMyList();

        }
      );

    });


  renderMyList();

}


function renderMyList() {

  const grid =
    document.getElementById(
      "myListGrid"
    );

  const empty =
    document.getElementById(
      "myListEmpty"
    );

  if (!grid || !empty) {
    return;
  }

  const data =
    getUserData();

  const ids =
    data[myListTab] || [];

  const listGames =
    games.filter(
      game =>
        ids.includes(
          gameId(game)
        )
    );


  document
    .querySelectorAll(
      "[data-list-tab]"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.listTab ===
          myListTab
      );

    });


  if (!listGames.length) {

    grid.innerHTML = "";

    empty.classList.remove(
      "hidden"
    );

    return;

  }


  empty.classList.add(
    "hidden"
  );

  grid.innerHTML =
    listGames
      .map(game =>
        gameCardHTML(game)
      )
      .join("");

}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function showCatalog() {

  myListSection?.classList.remove(
    "profile-view"
  );

  document
    .getElementById("catalogo")
    ?.scrollIntoView({
      behavior: "smooth"
    });

}


function showMyList() {

  if (!myListSection) {
    return;
  }

  myListSection.classList.add(
    "profile-view"
  );

  myListSection.scrollIntoView({
    behavior: "smooth"
  });

  renderMyList();

}


/* =========================================================
   IDIOMA
========================================================= */

function setLanguage(
  language
) {

  if (!translations[language]) {
    return;
  }

  currentLanguage =
    language;

  localStorage.setItem(
    "ps2-randomizer-language",
    language
  );

  currentLanguageElement.textContent =
    language.toUpperCase();

  document
    .querySelectorAll(
      "[data-i18n]"
    )
    .forEach(element => {

      const key =
        element.dataset.i18n;

      if (
        translations[language][key]
      ) {

        element.textContent =
          translations[language][key];

      }

    });


  document
    .querySelectorAll(
      "[data-i18n-placeholder]"
    )
    .forEach(element => {

      const key =
        element.dataset.i18nPlaceholder;

      if (
        translations[language][key]
      ) {

        element.placeholder =
          translations[language][key];

      }

    });


  populateGenres();

  renderCatalog();

  updateModalButtons();

  renderMyList();

}


function setupLanguage() {

  const saved =
    localStorage.getItem(
      "ps2-randomizer-language"
    );

  if (
    saved &&
    translations[saved]
  ) {

    currentLanguage =
      saved;

  }

  setLanguage(
    currentLanguage
  );

}


/* =========================================================
   ESCAPE HTML
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

  return escapeHTML(
    value
  );

}


/* =========================================================
   EVENTOS
========================================================= */

function setupEvents() {

  searchInput?.addEventListener(
    "input",
    () => {

      currentPage = 1;

      renderCatalog();

    }
  );


  genreFilter?.addEventListener(
    "change",
    () => {

      currentPage = 1;

      renderCatalog();

    }
  );


  /*
   * Caso o select antigo ainda esteja
   * presente no HTML, ele continua funcionando.
   *
   * Porém ele não é mais necessário para
   * a navegação da Minha Lista.
   */

  statusFilter?.addEventListener(
    "change",
    () => {

      currentPage = 1;

      renderCatalog();

    }
  );


  gameGrid?.addEventListener(
    "click",
    event => {

      const card =
        event.target.closest(
          "[data-game-id]"
        );

      if (!card) {
        return;
      }

      const id =
        card.dataset.gameId;

      const game =
        games.find(
          item =>
            gameId(item) === id
        );

      if (game) {
        openGameModal(game);
      }

    }
  );


  document
    .getElementById(
      "myListSection"
    );


  togglePlayed?.addEventListener(
    "click",
    () => {

      if (currentGame) {

        toggleStatus(
          currentGame,
          "played"
        );

      }

    }
  );


  toggleBacklog?.addEventListener(
    "click",
    () => {

      if (currentGame) {

        toggleStatus(
          currentGame,
          "backlog"
        );

      }

    }
  );


  toggleFavorite?.addEventListener(
    "click",
    () => {

      if (currentGame) {

        toggleStatus(
          currentGame,
          "favorites"
        );

      }

    }
  );


  randomOneTop?.addEventListener(
    "click",
    () => {

      openRandomModal(1);

    }
  );


  randomFiveHero?.addEventListener(
    "click",
    () => {

      openRandomModal(5);

    }
  );


  rerollButton?.addEventListener(
    "click",
    () => {

      openRandomModal(
        currentRandomCount
      );

    }
  );


  document
    .querySelectorAll(
      "[data-close-modal]"
    )
    .forEach(element => {

      element.addEventListener(
        "click",
        closeGameModal
      );

    });


  document
    .querySelectorAll(
      "[data-close-random]"
    )
    .forEach(element => {

      element.addEventListener(
        "click",
        closeRandomModal
      );

    });


  languageButton?.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      languageMenu?.classList.toggle(
        "hidden"
      );

    }
  );


  document
    .querySelectorAll(
      "[data-language]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          setLanguage(
            button.dataset.language
          );

          languageMenu?.classList.add(
            "hidden"
          );

        }
      );

    });


  document.addEventListener(
    "click",
    event => {

      if (
        languageMenu &&
        !languageMenu.contains(
          event.target
        ) &&
        !languageButton?.contains(
          event.target
        )
      ) {

        languageMenu.classList.add(
          "hidden"
        );

      }

    }
  );


  document
    .querySelectorAll(
      'a[href="#minha-lista"]'
    )
    .forEach(link => {

      link.addEventListener(
        "click",
        event => {

          event.preventDefault();

          showMyList();

        }
      );

    });


  document
    .querySelectorAll(
      'a[href="#catalogo"]'
    )
    .forEach(link => {

      link.addEventListener(
        "click",
        event => {

          event.preventDefault();

          showCatalog();

        }
      );

    });


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        closeGameModal();

        closeRandomModal();

        languageMenu?.classList.add(
          "hidden"
        );

      }

    }
  );


  randomResults?.addEventListener(
    "click",
    event => {

      const card =
        event.target.closest(
          "[data-game-id]"
        );

      if (!card) {
        return;
      }

      const id =
        card.dataset.gameId;

      const game =
        games.find(
          item =>
            gameId(item) === id
        );

      if (game) {

        closeRandomModal();

        openGameModal(game);

      }

    }
  );


  document
    .getElementById(
      "myListSection"
    );


  myListSection?.addEventListener(
    "click",
    event => {

      const card =
        event.target.closest(
          "[data-game-id]"
        );

      if (!card) {
        return;
      }

      const id =
        card.dataset.gameId;

      const game =
        games.find(
          item =>
            gameId(item) === id
        );

      if (game) {
        openGameModal(game);
      }

    }
  );

}


/* =========================================================
   CARREGAMENTO
========================================================= */

async function loadGames() {

  try {

    const response =
      await fetch(
        GAMES_URL,
        {
          cache: "no-store"
        }
      );

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    games =
      await response.json();

    if (!Array.isArray(games)) {
      throw new Error(
        "games.json não contém uma lista"
      );
    }

    games =
      games.map(game => ({
        ...game,
        genre:
          normalizeGenre(
            game.genre
          )
      }));

    populateGenres();

    renderCatalog();

    renderMyList();

  } catch (error) {

    console.error(
      "Erro ao carregar games.json:",
      error
    );

    if (gameGrid) {

      gameGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            ⚠️
          </div>

          <h3>
            Erro ao carregar o catálogo
          </h3>

          <p>
            Verifique se o arquivo
            data/games.json existe.
          </p>
        </div>
      `;

    }

  }

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function init() {

  setupMyListPage();

  setupEvents();

  setupLanguage();

  loadGames();

}


init();
