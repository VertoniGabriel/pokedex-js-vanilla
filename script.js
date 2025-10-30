const pokemonContainer = document.querySelector(".container");
const QUANTIDADE_A_BUSCAR = 18;
const typeColors = {
  Normal: "#A8A77A",
  Fire: "#EE8130",
  Water: "#6390F0",
  Electric: "#F7D02C",
  Grass: "#7AC74C",
  Ice: "#96D9D6",
  Fighting: "#C22E28",
  Poison: "#A33EA1",
  Ground: "#E2BF65",
  Flying: "#A98FF3",
  Psychic: "#F95587",
  Bug: "#A6B91A",
  Rock: "#B6A136",
  Ghost: "#735797",
  Dragon: "#6F35FC",
  Dark: "#705746",
  Steel: "#B7B7CE",
  Fairy: "#D685AD",
};
let currentOffset = 0;

const pokedexButton = document.querySelector(".button.pokedex");
const searchInput = document.querySelector("#pesquisa");
const searchButton = document.querySelector(".ph-magnifying-glass");

async function fetchPokemonList(offset = 0) {
  pokemonContainer.innerHTML = "<h2>Carregando Pokémon...</h2>";
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${QUANTIDADE_A_BUSCAR}&offset=${offset}`
    );
    const data = await response.json();
    pokemonContainer.innerHTML = "";

    for (const pokemonDaLista of data.results) {
      await fetchPokemonDetails(pokemonDaLista.url);
    }
  } catch (error) {
    console.error("Erro ao buscar a lista de Pokémon:", error);
    pokemonContainer.innerHTML = "<p>Não foi possível carregar os Pokémon.</p>";
  }
}

async function fetchPokemonDetails(url) {
  try {
    const response = await fetch(url);
    const pokemonData = await response.json();

    if (response) {
      createPokemonCard(pokemonData);
    }
  } catch (error) {
    console.log("Erro ao buscar detalhes do Pokémon:", error);
  }
}

function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function createPokemonCard(pokemon) {
  const name = capitalizeFirstLetter(pokemon.name);
  const id = pokemon.id;
  const primaryType = capitalizeFirstLetter(pokemon.types[0].type.name);
  const secondaryType = capitalizeFirstLetter(
    pokemon.types[1] ? pokemon.types[1].type.name : ""
  );
  const primaryColor = typeColors[primaryType];
  const secondaryColor = secondaryType ? typeColors[secondaryType] : "";

  const iconUrl = pokemon.sprites.front_default;

  console.log(`Gerando card para #${id} (${name}) com a URL: ${iconUrl}`);

  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
        <div class="title">
            <p class="tipos" style="color: ${primaryColor};">${primaryType}</p>
            ${
              secondaryType
                ? `<p class="tipos" style="color: ${secondaryColor};">${secondaryType}</p>`
                : ""
            } 
            <p>#${id.toString().padStart(3, "0")}</p> 
        </div>
        <div class="principal">
            <img src="${iconUrl}" alt="${name}">
            <p class="nomePokemon">${name}</p>
        </div>
    `;
  pokemonContainer.appendChild(card);
}

const nextButton = document.querySelector(".button-footer.side:last-child");
const prevButton = document.querySelector(".button-footer.side:first-child");

nextButton.addEventListener("click", () => {
  currentOffset += QUANTIDADE_A_BUSCAR;
  fetchPokemonList(currentOffset);
});

prevButton.addEventListener("click", () => {
  if (currentOffset >= QUANTIDADE_A_BUSCAR) {
    currentOffset -= QUANTIDADE_A_BUSCAR;
    fetchPokemonList(currentOffset);
  } else if (currentOffset > 0) {
    currentOffset = 0;
    fetchPokemonList(currentOffset);
  }
});

async function handleSearch() {
  console.log("Buscando...");
  const pokemonName = searchInput.value;

  if (!pokemonName) {
    console.log("Campo de busca vazio.");
    return;
  }

  const searchURL = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

  try {
    const response = await fetch(searchURL);

    if (!response.ok) {
      if (response.status === 404) {
        pokemonContainer.innerHTML = `<p class="erro-busca">Pokémon não encontrado. Tente novamente.</p>`;
      } else {
        pokemonContainer.innerHTML = `<p class="erro-busca">Ocorreu um erro na busca.</p>`;
      }
      console.error("Erro na busca:", response.status);
      return;
    }
    const pokemonData = await response.json();

    pokemonContainer.innerHTML = "";
    createPokemonCard(pokemonData);
  } catch (error) {
    console.error("Erro ao processar a busca:", error);
    pokemonContainer.innerHTML = `<p class="erro-busca">Um erro inesperado ocorreu.</p>`;
  }
}
searchButton.addEventListener("click", () => {
  handleSearch();
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    handleSearch();
  }
});

pokedexButton.addEventListener("click", () => {
  fetchPokemonList(0);
});

fetchPokemonList();
