const grid = document.getElementById("pokemonGrid");
const search = document.getElementById("searchInput");
const loading = document.getElementById("loading");

let pokemon = [];

async function loadPokemon() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
  const data = await res.json();

  pokemon = await Promise.all(
    data.results.map(async item => {
      const res = await fetch(item.url);
      return res.json();
    })
  );

  loading.style.display = "none";
  showPokemon(pokemon);
}

function showPokemon(list) {
  grid.innerHTML = list.map(p => `
    <article class="card">
      <div class="card-inner">

        <div class="card-front">
          <img
            src="${p.sprites.other["official-artwork"].front_default}"
            alt="${p.name}"
          >
          <h2>${p.name}</h2>
          <button>Show ability</button>
        </div>

        <div class="card-back">
          <h2>${p.name}</h2>
          <p>I have ${p.abilities[0].ability.name}.</p>
        </div>

      </div>
    </article>
  `).join("");

  document.querySelectorAll(".card").forEach(card => {
    card.querySelector("button").onclick = () =>
      card.classList.add("flipped");

    card.onmouseleave = () =>
      card.classList.remove("flipped");
  });
}

search.oninput = () => {
  const name = search.value.toLowerCase();

  showPokemon(
    pokemon.filter(p => p.name.includes(name))
  );
};

loadPokemon();