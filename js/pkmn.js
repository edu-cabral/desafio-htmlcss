document.addEventListener('DOMContentLoaded', fetchPokemonDetail);

async function fetchPokemonDetail() {
    const container = document.getElementById('dex-container');
    const loadingDiv = document.getElementById('loading');

    // Pega o id da URL (?id=25)
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        loadingDiv.innerText = "ID não informado na URL.";
        return;
    }

    try {
        // Busca os dados locais (nome, tipo, imagem) que você já tem
        const localRes = await fetch('../data/dex.json');
        const localData = await localRes.json();
        const entry = localData.pokemon_entries.find(
            e => String(e.entry_number) === String(id)
        );

        if (!entry) {
            loadingDiv.innerText = "Pokémon não encontrado no dex local.";
            return;
        }

        const { name, type } = entry.pokemon_species;
        const number = String(entry.entry_number).padStart(3, '0');

        // Busca o flavor text na PokeAPI
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
        const speciesData = speciesRes.ok ? await speciesRes.json() : null;

        let cleanText = "Descrição indisponível.";
        if (speciesData) {
            const yellowEntry = speciesData.flavor_text_entries.find(
                e => e.language.name === 'en' && e.version.name === 'yellow'
            );
            if (yellowEntry) {
                cleanText = yellowEntry.flavor_text.replace(/[\n\f]/g, ' ');
            }
        }

        loadingDiv.style.display = 'none';

        const types = type
            .map(t => `<img src="../icons/type-icons/${t}.svg" alt="${t}">`)
            .join('');

        const card = document.createElement('div');
        card.className = 'dex-card';
        card.innerHTML = `
            <img class="pokemon-image" src="../icons/poke-icons/${entry.entry_number}.png" alt="${name}">
            <span class="pokemon-id">#${number}</span>
            <h2 class="pokemon-name">${name}</h2>
            <span class="pokemon-type">${types}</span>
            <p class="flavor-text">"${cleanText}"</p>
        `;

        container.appendChild(card);

    } catch (error) {
        console.error("Erro ao carregar detalhes do Pokémon:", error);
        loadingDiv.innerText = "Falha ao carregar detalhes. Tente novamente.";
    }
}