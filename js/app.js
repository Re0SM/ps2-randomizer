const STORAGE_KEY = "ps2-randomizer-user-data";

let games = [];
let currentGame = null;
let lastRandomCount = 5;

const userData = loadUserData();

const elements = {
  gameGrid: document.getElementById("gameGrid"),
  emptyState: document.getElementById("emptyState"),
  gameCount: document.getElementById("gameCount"),

  searchInput: document.getElementById("searchInput"),
  genreFilter: document.getElementById("genreFilter"),
  statusFilter: document.getElementById("statusFilter"),

  modal: document.getElementById("gameModal"),
  modalCover: document.getElementById("modalCover"),
  modalTitle: document.getElementById("modalTitle"),
  modalGenre: document.getElementById("modalGenre"),
  modalMeta: document.getElementById("modalMeta"),
  modalDescription: document.getElementById("modalDescription"),

  togglePlayed: document.getElementById("togglePlayed"),
  toggleBacklog: document.getElementById("toggleBacklog"),
  toggleFavorite: document.getElementById("toggleFavorite"),

  randomModal: document.getElementById("randomModal"),
  randomResults: document.getElementById("randomResults"),
  rerollButton: document.getElementById("rerollButton"),

  playedCount: document.getElementById("playedCount"),
  backlogCount: document.getElementById("backlogCount"),
  favoriteCount: document.getElementById("favoriteCount")
};


/* =========================
   INICIALIZAÇÃO
========================= */

document.addEventListener("DOMContentLoaded", init);


async function init() {

  try {

    const response = await fetch("data/games.json");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    games = await response.json();

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
   EVENTOS
========================= */

function bindEvents() {

  elements.searchInput.addEventListener(
    "input",
    renderCatalog
  );

  elements.genreFilter.addEventListener(
    "change",
    renderCatalog
  );

  elements.statusFilter.addEventListener(
    "change",
    renderCatalog
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


  elements.rerollButton.addEventListener(
    "click",
    () => renderRandomResults(lastRandomCount)
  );


  elements.togglePlayed.addEventListener(
    "click",
    () => toggleStatus("played")
  );


  elements.toggleBacklog.addEventListener(
    "click",
    () => toggleStatus("backlog")
  );


  elements.toggleFavorite.addEventListener(
    "click",
    () => toggleStatus("favorite")
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
        game => game.genres || []
      )
    )
  ].sort(
    (a, b) => a.localeCompare(b, "pt-BR")
  );


  elements.genreFilter.innerHTML = `
    <option value="all">
      Todos
    </option>
  `;


  for (const genre of genres) {

    const option =
      document.createElement("option");

    option.value = genre;

    option.textContent = genre;

    elements.genreFilter.appendChild(
      option
    );

  }

}


/* =========================
   CATÁLOGO
========================= */

function renderCatalog() {

  const query =
    normalize(elements.searchInput.value);


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


      const matchesGenre =
        genre === "all" ||
        (game.genres || []).includes(genre);


      const matchesStatus =
        status === "all" ||
        userData[status]?.includes(game.id);


      return (
        matchesSearch &&
        matchesGenre &&
        matchesStatus
      );

    });


  elements.gameGrid.innerHTML = "";


  elements.gameCount.textContent =
    `${filtered.length} ${
      filtered.length === 1
        ? "jogo"
        : "jogos"
    }`;


  elements.emptyState.classList.toggle(
    "hidden",
    filtered.length > 0
  );


  for (const game of filtered) {

    elements.gameGrid.appendChild(
      createGameCard(game)
    );

  }

}


/* =========================
   CARD DO JOGO
========================= */

function createGameCard(game) {

  const card =
    document.createElement("article");

  card.className = "game-card";

  card.tabIndex = 0;


  const cover =
    document.createElement("div");

  cover.className = "cover-wrap";


  if (game.cover) {

    const img =
      document.createElement("img");

    img.src = game.cover;

    img.alt =
      `Capa de ${game.title}`;

    img.loading = "lazy";


    img.onerror = () => {

      img.remove();

      cover.appendChild(
        createPlaceholder(game.title)
      );

    };


    cover.appendChild(img);

  } else {

    cover.appendChild(
      createPlaceholder(game.title)
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
      createBadge("JOGADO")
    );

  }


  if (
    userData.backlog
      .includes(game.id)
  ) {

    badges.appendChild(
      createBadge("LISTA")
    );

  }


  cover.appendChild(badges);

  card.appendChild(cover);


  const title =
    document.createElement("h3");

  title.className = "game-title";

  title.textContent = game.title;

  card.appendChild(title);


  const year =
    document.createElement("p");

  year.className = "game-year";

  year.textContent =
    game.year ||
    "Ano não informado";

  card.appendChild(year);


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
   PLACEHOLDER DA CAPA
========================= */

function createPlaceholder(
  title = "CAPA"
) {

  const placeholder =
    document.createElement("div");

  placeholder.className =
    "cover-placeholder";

  placeholder.textContent = title;

  return placeholder;

}


/* =========================
   BADGE
========================= */

function createBadge(text) {

  const badge =
    document.createElement("span");

  badge.className = "badge";

  badge.textContent = text;

  return badge;

}


/* =========================
   MODAL DO JOGO
========================= */

function openGameModal(game) {

  currentGame = game;


  elements.modalTitle.textContent =
    game.title;


  elements.modalGenre.textContent =
    (game.genres || []).join(" · ") ||
    "PS2";


  elements.modalMeta.textContent =
    [
      game.year,
      game.developer,
      game.publisher
    ]
      .filter(Boolean)
      .join(" · ");


  elements.modalDescription.textContent =
    game.description ||
    "Nenhuma descrição disponível.";


  elements.modalCover.innerHTML = "";


  if (game.cover) {

    const img =
      document.createElement("img");

    img.src = game.cover;

    img.alt =
      `Capa de ${game.title}`;


    img.onerror = () => {

      img.remove();

      elements.modalCover.appendChild(
        createPlaceholder(game.title)
      );

    };


    elements.modalCover.appendChild(img);

  } else {

    elements.modalCover.appendChild(
      createPlaceholder(game.title)
    );

  }


  updateActionButtons();


  elements.modal.classList.remove(
    "hidden"
  );


  document.body.classList.add(
    "modal-open"
  );

}


/* =========================
   FECHAR MODAL
========================= */

function closeGameModal() {

  elements.modal.classList.add(
    "hidden"
  );

  currentGame = null;

  document.body.classList.remove(
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
      .includes(currentGame.id);


  const backlog =
    userData.backlog
      .includes(currentGame.id);


  const favorite =
    userData.favorite
      .includes(currentGame.id);


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


  elements.togglePlayed.textContent =
    played
      ? "✓ Já joguei"
      : "☐ Já joguei";


  elements.toggleBacklog.textContent =
    backlog
      ? "✓ Pretendo jogar"
      : "＋ Pretendo jogar";


  elements.toggleFavorite.textContent =
    favorite
      ? "★ Favorito"
      : "☆ Favorito";

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

    list.splice(index, 1);

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

  lastRandomCount = count;

  renderRandomResults(count);


  elements.randomModal.classList.remove(
    "hidden"
  );


  document.body.classList.add(
    "modal-open"
  );

}


function closeRandomModal() {

  elements.randomModal.classList.add(
    "hidden"
  );


  document.body.classList.remove(
    "modal-open"
  );

}


function renderRandomResults(count) {

  const pool = [...games];


  if (pool.length === 0) {

    elements.randomResults.innerHTML =
      "<p>O catálogo está vazio.</p>";

    return;

  }


  const results =
    shuffle(pool).slice(
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
      document.createElement("article");

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


    elements.randomResults.appendChild(
      card
    );

  }

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
        Math.random() * (i + 1)
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
    JSON.stringify(userData)
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
   NORMALIZAÇÃO DA PESQUISA
========================= */

function normalize(value) {

  return String(value ?? "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .trim();

}
