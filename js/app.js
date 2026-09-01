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

let currentRandomRegion = "all";

let currentRandomExcludePlayed = false;

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


/* MODAL DE CONFIGURAÇÃO */

const randomSetupModal =
  document.getElementById("randomSetupModal");

const randomRegion =
  document.getElementById("randomRegion");

const randomCount =
  document.getElementById("randomCount");

const randomSetupInfo =
  document.getElementById("randomSetupInfo");

const startRandomButton =
  document.getElementById("startRandomButton");

const excludePlayed =
  document.getElementById("excludePlayed");


/* MODAL DE RESULTADOS */

const randomModal =
  document.getElementById("randomModal");

const randomResults =
  document.getElementById("randomResults");

const rerollButton =
  document.getElementById("rerollButton");


/* MODAL SOBRE */

const aboutModal =
  document.getElementById("aboutModal");

const aboutButton =
  document.getElementById("aboutButton");


/* BOTÃO DO HERO */

const randomFiveHero =
  document.getElementById("randomFiveHero");


/* IDIOMA */

const languageButton =
  document.getElementById("languageButton");

const languageMenu =
  document.getElementById("languageMenu");

const currentLanguageElement =
  document.getElementById("currentLanguage");


/* =========================================================
   TRADUÇÕES
========================================================= */

const translations = {

  pt: {

    siteName:
      "Minha Lista de Jogos",

    navCatalog:
      "Catálogo",

    navList:
      "Minha Lista",

    randomFive:
      "🎲 Sortear jogos",

    eyebrow:
      "PLAYSTATION 2",

    heroTitle:
      "Encontre seu próximo jogo.",

    heroText:
      "Explore o catálogo, marque o que você já jogou e deixe a sorte escolher sua próxima aventura.",

    viewCatalog:
      "Ver catálogo",

    catalogEyebrow:
      "CATÁLOGO",

    catalogTitle:
      "Jogos de PS2",

    genre:
      "Gênero",

    all:
      "Todos",

    searchPlaceholder:
      "Pesquisar jogo...",

    myListTitle:
      "Minha Lista",

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

    setupEyebrow:
      "SORTEIO",

    setupTitle:
      "Configure seu sorteio",

    setupText:
      "Escolha a região e quantos jogos você quer sortear.",

    region:
      "Região",

    regionAll:
      "Todas as regiões",

    regionAmerica:
      "América",

    regionEurope:
      "Europa",

    regionJapan:
      "Japão",

    regionKorea:
      "Coreia",

    regionOther:
      "Outros",

    quantity:
      "Quantidade",

    excludePlayed:
      "Não sortear jogos que já joguei",

    startRandom:
      "🎲 Sortear",

    drawEyebrow:
      "SORTEIO",

    drawTitle:
      "Seus jogos sorteados",

    reroll:
      "🎲 Sortear novamente",

    footer:
      "Minha Lista de Jogos · Projeto independente",

    noList:
      "Você ainda não adicionou nenhum jogo a esta lista.",

    markPlayed:
      "☐ Já joguei",

    markedPlayed:
      "✓ Já joguei",

    markBacklog:
      "＋ Pretendo jogar",

    markedBacklog:
      "✓ Pretendo jogar",

    markFavorite:
      "☆ Favorito",

    markedFavorite:
      "★ Favorito",

    aboutEyebrow:
      "SOBRE",

    aboutTitle:
      "Minha Lista de Jogos",

    aboutProjectTitle:
      "Sobre o projeto",

    aboutProjectText:
      "Minha Lista de Jogos é um projeto independente criado para organizar, explorar e descobrir jogos de PlayStation 2.",

    aboutWarningTitle:
      "Avisos",

    aboutWarningText:
      "Este site não possui vínculo oficial com a Sony Interactive Entertainment, PlayStation ou suas subsidiárias.",

    aboutCopyrightText:
      "PlayStation 2, seus logotipos e demais marcas relacionadas pertencem aos seus respectivos proprietários.",

    aboutRomText:
      "Este site não hospeda, fornece ou distribui ROMs, ISOs ou cópias de jogos.",

    aboutCreditsTitle:
      "Créditos",

    aboutCreditsText:
      "Proyecto independiente.",

    aboutDataText:
      "Dados, imagens e outros materiais utilizados no catálogo pertencem aos seus respectivos autores e proprietários."

  },


  es: {

    siteName:
      "Mi Lista de Juegos",

    navCatalog:
      "Catálogo",

    navList:
      "Mi Lista",

    randomFive:
      "🎲 Sortear juegos",

    eyebrow:
      "PLAYSTATION 2",

    heroTitle:
      "Encuentra tu próximo juego.",

    heroText:
      "Explora el catálogo, marca lo que ya jugaste y deja que la suerte elija tu próxima aventura.",

    viewCatalog:
      "Ver catálogo",

    catalogEyebrow:
      "CATÁLOGO",

    catalogTitle:
      "Juegos de PS2",

    genre:
      "Género",

    all:
      "Todos",

    searchPlaceholder:
      "Buscar juego...",

    myListTitle:
      "Mi Lista",

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

    setupEyebrow:
      "SORTEO",

    setupTitle:
      "Configura tu sorteo",

    setupText:
      "Elige la región y cuántos juegos quieres sortear.",

    region:
      "Región",

    regionAll:
      "Todas las regiones",

    regionAmerica:
      "América",

    regionEurope:
      "Europa",

    regionJapan:
      "Japón",

    regionKorea:
      "Corea",

    regionOther:
      "Otros",

    quantity:
      "Cantidad",

    excludePlayed:
      "No sortear juegos que ya jugué",

    startRandom:
      "🎲 Sortear",

    drawEyebrow:
      "SORTEO",

    drawTitle:
      "Tus juegos sorteados",

    reroll:
      "🎲 Sortear nuevamente",

    footer:
      "Mi Lista de Juegos · Proyecto independiente",

    noList:
      "Todavía no has añadido ningún juego a esta lista.",

    markPlayed:
      "☐ Ya jugué",

    markedPlayed:
      "✓ Ya jugué",

    markBacklog:
      "＋ Quiero jugar",

    markedBacklog:
      "✓ Quiero jugar",

    markFavorite:
      "☆ Favorito",

    markedFavorite:
      "★ Favorito",

    aboutEyebrow:
      "SOBRE",

    aboutTitle:
      "Mi Lista de Juegos",

    aboutProjectTitle:
      "Sobre el proyecto",

    aboutProjectText:
      "Mi Lista de Juegos es un proyecto independiente creado para organizar, explorar y descubrir juegos de PlayStation 2.",

    aboutWarningTitle:
      "Avisos",

    aboutWarningText:
      "Este sitio no tiene ningún vínculo oficial con Sony Interactive Entertainment, PlayStation o sus subsidiarias.",

    aboutCopyrightText:
      "PlayStation 2, sus logotipos y demás marcas relacionadas pertenecen a sus respectivos propietarios.",

    aboutRomText:
      "Este sitio no aloja, proporciona ni distribuye ROMs, ISOs o copias de juegos.",

    aboutCreditsTitle:
      "Créditos",

    aboutCreditsText:
      "Proyecto y desarrollo: Leonardo / Mateador.",

    aboutDataText:
      "Los datos, imágenes y demás materiales utilizados en el catálogo pertenecen a sus respectivos autores y propietarios."

  },


  en: {

    siteName:
      "My Game List",

    navCatalog:
      "Catalog",

    navList:
      "My List",

    randomFive:
      "🎲 Randomize games",

    eyebrow:
      "PLAYSTATION 2",

    heroTitle:
      "Find your next game.",

    heroText:
      "Explore the catalog, mark what you've played and let luck choose your next adventure.",

    viewCatalog:
      "View catalog",

    catalogEyebrow:
      "CATALOG",

    catalogTitle:
      "PS2 Games",

    genre:
      "Genre",

    all:
      "All",

    searchPlaceholder:
      "Search game...",

    myListTitle:
      "My List",

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

    setupEyebrow:
      "RANDOMIZER",

    setupTitle:
      "Configure your draw",

    setupText:
      "Choose the region and how many games you want to draw.",

    region:
      "Region",

    regionAll:
      "All regions",

    regionAmerica:
      "North America",

    regionEurope:
      "Europe",

    regionJapan:
      "Japan",

    regionKorea:
      "Korea",

    regionOther:
      "Other",

    quantity:
      "Quantity",

    excludePlayed:
      "Do not draw games I have already played",

    startRandom:
      "🎲 Randomize",

    drawEyebrow:
      "RANDOMIZER",

    drawTitle:
      "Your random games",

    reroll:
      "🎲 Randomize again",

    footer:
      "My Game List · Independent project",

    noList:
      "You haven't added any games to this list yet.",

    markPlayed:
      "☐ Played",

    markedPlayed:
      "✓ Played",

    markBacklog:
      "＋ Want to play",

    markedBacklog:
      "✓ Want to play",

    markFavorite:
      "☆ Favorite",

    markedFavorite:
      "★ Favorite",

    aboutEyebrow:
      "ABOUT",

    aboutTitle:
      "My Game List",

    aboutProjectTitle:
      "About the project",

    aboutProjectText:
      "My Game List is an independent project created to organize, explore and discover PlayStation 2 games.",

    aboutWarningTitle:
      "Notices",

    aboutWarningText:
      "This website is not officially affiliated with Sony Interactive Entertainment, PlayStation or any of its subsidiaries.",

    aboutCopyrightText:
      "PlayStation 2, its logos and other related trademarks belong to their respective owners.",

    aboutRomText:
      "This website does not host, provide or distribute ROMs, ISOs or game copies.",

    aboutCreditsTitle:
      "Credits",

    aboutCreditsText:
      "Independent project.",

    aboutDataText:
      "Data, images and other materials used in the catalog belong to their respective authors and owners."

  }

};


/* =========================================================
   PERFIL LOCAL
========================================================= */

function getUserData() {

  try {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) {

      return {
        played: [],
        backlog: [],
        favorites: []
      };

    }

    const data =
      JSON.parse(saved);

    return normalizeListStatuses(data);

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


function normalizeListStatuses(data) {

  const played =
    Array.isArray(data.played)
      ? [...new Set(data.played.map(String))]
      : [];

  const playedSet = new Set(played);

  const backlog =
    Array.isArray(data.backlog)
      ? [...new Set(
          data.backlog
            .map(String)
            .filter(id => !playedSet.has(id))
        )]
      : [];

  const favorites =
    Array.isArray(data.favorites)
      ? [...new Set(data.favorites.map(String))]
      : [];

  return {
    played,
    backlog,
    favorites
  };
}


/* =========================================================
   IDENTIFICADOR DO JOGO
========================================================= */

function gameId(game) {

  if (game.serial) {

    return String(
      game.serial
    );

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
   REGIÃO PELO SERIAL
========================================================= */

function getGameRegion(game) {

  const serial =
    String(
      game?.serial || ""
    )
      .trim()
      .toUpperCase()
      .replace(
        /[\s-]/g,
        ""
      );


  if (!serial) {
    return "other";
  }


  const prefix =
    serial.match(
      /^[A-Z]+/
    )?.[0] || "";


  if (
    prefix === "SLUS" ||
    prefix === "SCUS"
  ) {

    return "america";

  }


  if (
    prefix === "SLES" ||
    prefix === "SCES" ||
    prefix === "SLED"
  ) {

    return "europe";

  }


  if (
    prefix === "SLPS" ||
    prefix === "SLPM" ||
    prefix === "SCPS"
  ) {

    return "japan";

  }


  if (
    prefix === "SLKA" ||
    prefix === "SCKA"
  ) {

    return "korea";

  }


  return "other";

}


/* =========================================================
   NOME DA REGIÃO
========================================================= */

function getRegionLabel(region) {

  const t =
    translations[currentLanguage];


  const labels = {

    all:
      t.regionAll,

    america:
      t.regionAmerica,

    europe:
      t.regionEurope,

    japan:
      t.regionJapan,

    korea:
      t.regionKorea,

    other:
      t.regionOther

  };


  return (
    labels[region] ||
    labels.all
  );

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
      .replace(
        /\.+$/,
        ""
      );


  const key =
    clean.toLowerCase();


  return (
    map[key] ||
    clean
  );

}


function getGameYear(game) {

  if (game?.year !== undefined && game?.year !== null && String(game.year).trim()) {
    const direct = String(game.year).match(/\b(19\d{2}|20\d{2})\b/);
    if (direct) return direct[1];
  }

  const values = [
    game?.releaseYear,
    game?.release_year,
    game?.releaseDate,
    game?.release_date,
    game?.released,
    game?.release,
    game?.date,
    game?.dates
  ];

  for (const value of values) {
    if (value === undefined || value === null) continue;
    const match = String(value).match(/\b(19\d{2}|20\d{2})\b/);
    if (match) return match[1];
  }

  return '';
}


/* =========================================================
   STATUS
========================================================= */

function hasStatus(
  game,
  status
) {

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


  renderMyList();


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
      .map(
        game =>
          gameCardHTML(game)
      )
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


  filteredGames =
    games.filter(
      game => {

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


        return (
          matchesSearch &&
          matchesGenre
        );

      }
    );

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
        translations[
          currentLanguage
        ].all
      )}
    </option>

  `;


  for (const genre of sorted) {

    const option =
      document.createElement(
        "option"
      );


    option.value =
      genre;


    option.textContent =
      genre;


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
          .getElementById(
            "catalogo"
          )
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
    ) ||
    "PLAYSTATION 2";


  const meta = [];


  if (game.year) {
    meta.push(String(game.year));
  }


  if (game.developer) {
    meta.push(String(game.developer));
  }


  if (game.publisher) {
    meta.push(String(game.publisher));
  }


  if (game.serial) {
    meta.push(String(game.serial));
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
    translations[
      currentLanguage
    ];


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

function randomGames(
  count,
  region = "all"
) {

  if (!games.length) {
    return [];
  }


  let available =
    [...games];


  if (region !== "all") {

    available =
      available.filter(
        game =>
          getGameRegion(game) ===
          region
      );

  }


  if (currentRandomExcludePlayed) {

    const played =
      new Set(getUserData().played);

    available =
      available.filter(
        game => !played.has(gameId(game))
      );

  }


  if (!available.length) {
    return [];
  }


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


/* =========================================================
   ATUALIZA INFORMAÇÃO DO CONFIGURADOR
========================================================= */

function updateRandomSetupInfo() {

  if (
    !randomSetupInfo ||
    !randomRegion ||
    !randomCount
  ) {
    return;
  }


  const region =
    randomRegion.value;


  const count =
    Number(
      randomCount.value
    );


  let availableGames =
    region === "all"
      ? [...games]
      : games.filter(
          game =>
            getGameRegion(game) ===
            region
        );


  if (currentRandomExcludePlayed) {

    const played =
      new Set(getUserData().played);

    availableGames =
      availableGames.filter(
        game => !played.has(gameId(game))
      );

  }


  const availableCount =
    availableGames.length;


  const regionName =
    getRegionLabel(region);


  if (!availableCount) {

    randomSetupInfo.textContent =
      currentLanguage === "pt"
        ? `Nenhum jogo encontrado para ${regionName}.`
        : currentLanguage === "es"
          ? `No se encontraron juegos para ${regionName}.`
          : `No games found for ${regionName}.`;


    if (startRandomButton) {
      startRandomButton.disabled = true;
    }


    return;

  }


  const possibleCount =
    Math.min(
      count,
      availableCount
    );


  if (
    currentLanguage === "pt"
  ) {

    randomSetupInfo.textContent =
      `${availableCount} jogos disponíveis · serão sorteados ${possibleCount}.`;

  } else if (
    currentLanguage === "es"
  ) {

    randomSetupInfo.textContent =
      `${availableCount} juegos disponibles · se sortearán ${possibleCount}.`;

  } else {

    randomSetupInfo.textContent =
      `${availableCount} games available · ${possibleCount} will be drawn.`;

  }


  if (startRandomButton) {
    startRandomButton.disabled = false;
  }

}


/* =========================================================
   ABRIR CONFIGURADOR
========================================================= */

function openRandomSetup() {

  if (!randomSetupModal) {
    return;
  }


  if (randomCount) {
    randomCount.value = "5";
  }


  currentRandomExcludePlayed =
    Boolean(excludePlayed?.checked);

  if (excludePlayed) {
    excludePlayed.checked = false;
  }


  if (randomRegion) {
    randomRegion.value = "all";
  }


  updateRandomSetupInfo();


  randomSetupModal.classList.remove(
    "hidden"
  );


  document.body.classList.add(
    "modal-open"
  );

}


/* =========================================================
   FECHAR CONFIGURADOR
========================================================= */

function closeRandomSetup() {

  if (!randomSetupModal) {
    return;
  }


  randomSetupModal.classList.add(
    "hidden"
  );


  if (
    randomModal?.classList.contains(
      "hidden"
    ) &&
    gameModal?.classList.contains(
      "hidden"
    ) &&
    aboutModal?.classList.contains(
      "hidden"
    )
  ) {

    document.body.classList.remove(
      "modal-open"
    );

  }

}


/* =========================================================
   EXECUTAR SORTEIO
========================================================= */

function startRandomDraw() {

  const count =
    Math.max(
      1,
      Math.min(
        10,
        Number(
          randomCount?.value || 5
        )
      )
    );


  const region =
    randomRegion?.value ||
    "all";


  currentRandomExcludePlayed =
    Boolean(excludePlayed?.checked);


  currentRandomCount =
    count;


  currentRandomRegion =
    region;


  closeRandomSetup();


  openRandomResults(
    count,
    region
  );

}


/* =========================================================
   ABRIR RESULTADOS
========================================================= */

function openRandomResults(
  count,
  region
) {

  currentRandomCount =
    count;


  currentRandomRegion =
    region;


  const selected =
    randomGames(
      count,
      region
    );


  if (!randomResults) {
    return;
  }


  if (!selected.length) {

    randomResults.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">
          🎮
        </div>

        <h3>
          ${
            currentLanguage === "pt"
              ? "Nenhum jogo disponível"
              : currentLanguage === "es"
                ? "No hay juegos disponibles"
                : "No games available"
          }
        </h3>

        <p>
          ${
            currentLanguage === "pt"
              ? "Não existem jogos suficientes para os filtros escolhidos."
              : currentLanguage === "es"
                ? "No hay suficientes juegos para los filtros elegidos."
                : "There are not enough games for the selected filters."
          }
        </p>

      </div>

    `;

  } else {

    randomResults.innerHTML =
      selected
        .map(
          game =>
            gameCardHTML(
              game,
              true
            )
        )
        .join("");

  }


  randomModal.classList.remove(
    "hidden"
  );


  document.body.classList.add(
    "modal-open"
  );

}


/* =========================================================
   FECHAR RESULTADOS
========================================================= */

function closeRandomModal() {

  if (!randomModal) {
    return;
  }


  randomModal.classList.add(
    "hidden"
  );


  if (
    gameModal?.classList.contains(
      "hidden"
    ) &&
    randomSetupModal?.classList.contains(
      "hidden"
    ) &&
    aboutModal?.classList.contains(
      "hidden"
    )
  ) {

    document.body.classList.remove(
      "modal-open"
    );

  }

}


/* =========================================================
   SOBRE / AVISOS / CRÉDITOS
========================================================= */

function openAboutModal() {

  if (!aboutModal) {
    return;
  }


  aboutModal.classList.remove(
    "hidden"
  );


  document.body.classList.add(
    "modal-open"
  );

}


function closeAboutModal() {

  if (!aboutModal) {
    return;
  }


  aboutModal.classList.add(
    "hidden"
  );


  if (
    randomModal?.classList.contains(
      "hidden"
    ) &&
    randomSetupModal?.classList.contains(
      "hidden"
    ) &&
    gameModal?.classList.contains(
      "hidden"
    )
  ) {

    document.body.classList.remove(
      "modal-open"
    );

  }

}


/* =========================================================
   MINHA LISTA
========================================================= */

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
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.listTab ===
            myListTab
        );

      }
    );


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
      .map(
        game =>
          gameCardHTML(game)
      )
      .join("");

}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function showCatalog() {

  document
    .getElementById(
      "catalogo"
    )
    ?.scrollIntoView({
      behavior: "smooth"
    });

}


function showMyList() {

  const section =
    document.getElementById(
      "minha-lista"
    );


  if (!section) {
    return;
  }


  section.scrollIntoView({
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

  if (
    !translations[language]
  ) {
    return;
  }


  currentLanguage =
    language;


  localStorage.setItem(
    "ps2-randomizer-language",
    language
  );


  if (currentLanguageElement) {

    currentLanguageElement.textContent =
      language.toUpperCase();

  }


  document
    .querySelectorAll(
      "[data-i18n]"
    )
    .forEach(
      element => {

        const key =
          element.dataset.i18n;


        if (
          translations[
            language
          ][key]
        ) {

          element.textContent =
            translations[
              language
            ][key];

        }

      }
    );


  document
    .querySelectorAll(
      "[data-i18n-placeholder]"
    )
    .forEach(
      element => {

        const key =
          element.dataset.i18nPlaceholder;


        if (
          translations[
            language
          ][key]
        ) {

          element.placeholder =
            translations[
              language
            ][key];

        }

      }
    );


  populateGenres();

  renderCatalog();

  updateModalButtons();

  renderMyList();

  updateRandomSetupInfo();

}


/* =========================================================
   CONFIGURAÇÃO DO IDIOMA
========================================================= */

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

  return String(
    value ?? ""
  )
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

  /* PESQUISA */

  searchInput?.addEventListener(
    "input",
    () => {

      currentPage = 1;

      renderCatalog();

    }
  );


  /* GÊNERO */

  genreFilter?.addEventListener(
    "change",
    () => {

      currentPage = 1;

      renderCatalog();

    }
  );


  /* GRID DO CATÁLOGO */

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
            gameId(item) ===
            id
        );


      if (game) {

        openGameModal(
          game
        );

      }

    }
  );


  /* BOTÕES DO MODAL DO JOGO */

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


  /* BOTÃO PRINCIPAL DO SORTEIO */

  randomFiveHero?.addEventListener(
    "click",
    () => {

      openRandomSetup();

    }
  );


  /* ALTERAÇÃO DA REGIÃO */

  randomRegion?.addEventListener(
    "change",
    () => {

      updateRandomSetupInfo();

    }
  );


  /* ALTERAÇÃO DA QUANTIDADE */

  randomCount?.addEventListener(
    "change",
    () => {

      updateRandomSetupInfo();

    }
  );


  /* EXCLUIR JOGOS JÁ JOGADOS */

  excludePlayed?.addEventListener(
    "change",
    () => {

      currentRandomExcludePlayed =
        excludePlayed.checked;

      updateRandomSetupInfo();

    }
  );


  /* COMEÇAR SORTEIO */

  startRandomButton?.addEventListener(
    "click",
    () => {

      if (
        startRandomButton.disabled
      ) {
        return;
      }


      startRandomDraw();

    }
  );


  /* SORTEAR NOVAMENTE */

  rerollButton?.addEventListener(
    "click",
    () => {

      openRandomResults(
        currentRandomCount,
        currentRandomRegion
      );

    }
  );


  /* FECHAR MODAL DO JOGO */

  document
    .querySelectorAll(
      "[data-close-modal]"
    )
    .forEach(
      element => {

        element.addEventListener(
          "click",
          closeGameModal
        );

      }
    );


  /* FECHAR CONFIGURAÇÃO */

  document
    .querySelectorAll(
      "[data-close-random-setup]"
    )
    .forEach(
      element => {

        element.addEventListener(
          "click",
          closeRandomSetup
        );

      }
    );


  /* FECHAR RESULTADOS */

  document
    .querySelectorAll(
      "[data-close-random]"
    )
    .forEach(
      element => {

        element.addEventListener(
          "click",
          closeRandomModal
        );

      }
    );


  /* ABRIR SOBRE */

  aboutButton?.addEventListener(
    "click",
    () => {

      openAboutModal();

    }
  );


  /* FECHAR SOBRE */

  document
    .querySelectorAll(
      "[data-close-about]"
    )
    .forEach(
      element => {

        element.addEventListener(
          "click",
          closeAboutModal
        );

      }
    );


  /* IDIOMA */

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
    .forEach(
      button => {

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

      }
    );


  /* CLICAR FORA DO MENU DE IDIOMA */

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


  /* NAVEGAÇÃO MINHA LISTA */

  document
    .querySelectorAll(
      'a[href="#minha-lista"]'
    )
    .forEach(
      link => {

        link.addEventListener(
          "click",
          event => {

            event.preventDefault();

            showMyList();

          }
        );

      }
    );


  /* NAVEGAÇÃO CATÁLOGO */

  document
    .querySelectorAll(
      'a[href="#catalogo"]'
    )
    .forEach(
      link => {

        link.addEventListener(
          "click",
          event => {

            event.preventDefault();

            showCatalog();

          }
        );

      }
    );


  /* ABAS DA MINHA LISTA */

  document
    .querySelectorAll(
      "[data-list-tab]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            myListTab =
              button.dataset.listTab;


            renderMyList();

          }
        );

      }
    );


  /* CARDS DA MINHA LISTA */

  document
    .getElementById(
      "minha-lista"
    )
    ?.addEventListener(
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
              gameId(item) ===
              id
          );


        if (game) {

          openGameModal(
            game
          );

        }

      }
    );


  /* CARDS DO SORTEIO */

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
            gameId(item) ===
            id
        );


      if (game) {

        closeRandomModal();

        openGameModal(
          game
        );

      }

    }
  );


  /* ESC */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key !== "Escape"
      ) {
        return;
      }


      if (
        !randomSetupModal?.classList.contains(
          "hidden"
        )
      ) {

        closeRandomSetup();

      }


      if (
        !randomModal?.classList.contains(
          "hidden"
        )
      ) {

        closeRandomModal();

      }


      if (
        !gameModal?.classList.contains(
          "hidden"
        )
      ) {

        closeGameModal();

      }


      if (
        !aboutModal?.classList.contains(
          "hidden"
        )
      ) {

        closeAboutModal();

      }


      languageMenu?.classList.add(
        "hidden"
      );

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
      games.map(
        game => ({

          ...game,

          genre:
            normalizeGenre(
              game.genre
            )

        })
      );


    populateGenres();

    renderCatalog();

    renderMyList();

    updateRandomSetupInfo();


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

  setupEvents();

  setupLanguage();

  loadGames();

}


init();



/* status-exclusivity-fix */
document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "#togglePlayed, #toggleBacklog"
      );

    if (!button || !currentGame) return;

    const data = getUserData();
    const id = String(gameId(currentGame));

    if (button.id === "togglePlayed") {
      data.backlog = data.backlog.filter(
        value => String(value) !== id
      );
    } else {
      data.played = data.played.filter(
        value => String(value) !== id
      );
    }

    saveUserData(data);

  },
  true
);
