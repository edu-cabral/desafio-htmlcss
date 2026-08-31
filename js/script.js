document.addEventListener('DOMContentLoaded', () => {
    fetch('../data/dex.json')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('list');
            list.innerHTML = data.pokemon_entries.map(createPokeLine).join('');
        })
        .catch(error => console.error('Erro ao carregar o JSON', error));
});

function createPokeLine(entry) {
    const number = String(entry.entry_number).padStart(3, '0');
    const { name, type } = entry.pokemon_species;

    const types = type
        .map(t => `<img src="icons/type-icons/${t}.svg" alt="${t}">`)
        .join('');

    return `
        <div class="poke-line" id="${entry.entry_number}">
            <span class="poke-number">${number}</span>
            <img src="icons/poke-icons/${entry.entry_number}.png" alt="${name}" class="poke-img">
            <span class="poke-name">${name}</span>
            <span class="poke-type">${types}</span>
        </div>`;
}