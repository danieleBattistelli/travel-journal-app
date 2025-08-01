// Ottieni riferimenti agli elementi del DOM necessari
const form = document.getElementById('entry-form');
const entriesList = document.getElementById('entries-list');
const geoBtn = document.getElementById('geo-btn');
// Inizializza l'array che conterrà tutte le entries inserite
let entries = [];

// Aggiungi un event listener al bottone per la geolocalizzazione
geoBtn.addEventListener('click', () => {
    // Verifica se il browser supporta la geolocalizzazione
    if (navigator.geolocation) {
        // Ottieni la posizione corrente dell'utente
        navigator.geolocation.getCurrentPosition(pos => {
            // Formattta le coordinate come stringa "latitudine, longitudine"
            const coords = `${pos.coords.latitude}, ${pos.coords.longitude}`;
            // Inserisci le coordinate nel campo "place" del form
            form.place.value = coords;
        });
    } else {
        // Mostra un alert se la geolocalizzazione non è supportata
        alert('Geolocalizzazione non supportata');
    }
});

// Gestisci l'invio del form
form.addEventListener('submit', function (e) {
    // Previeni il comportamento di default (refresh della pagina)
    e.preventDefault();
    // Crea un oggetto FormData per leggere i dati del form
    const data = new FormData(form);
    // Ottieni l'URL del media inserito (se presente)
    let mediaUrl = data.get('mediaUrl');
    // Ottieni il file media caricato (se presente)
    const mediaFile = data.get('mediaFile');
    // Se non è stato inserito un URL ma è stato caricato un file, crea un URL temporaneo per il file
    if (!mediaUrl && mediaFile && mediaFile.size > 0) {
        mediaUrl = URL.createObjectURL(mediaFile);
    }
    // Crea un oggetto entry con tutti i dati raccolti dal form
    const entry = {
        mediaUrl,
        place: data.get('place'),
        description: data.get('description'),
        mood: data.get('mood'),
        positive: data.get('positive'),
        negative: data.get('negative'),
        physicalEffort: data.get('physicalEffort'),
        economicEffort: data.get('economicEffort'),
        expense: data.get('expense'),
        tags: data.get('tags')
    };
    // Aggiungi la nuova entry all'array delle entries
    entries.push(entry);
    // Aggiorna la visualizzazione delle entries
    renderEntries();
    // Resetta il form dopo l'invio
    form.reset();
});

// Funzione per mostrare tutte le entries nella pagina
function renderEntries() {
    // Svuota la lista delle entries prima di riempirla di nuovo
    entriesList.innerHTML = '';
    // Per ogni entry nell'array...
    entries.forEach(entry => {
        // Crea un div colonna Bootstrap
        const col = document.createElement('div');
        col.className = 'col';
        // Crea un nuovo div per la card dell'entry
        const card = document.createElement('div');
        card.className = 'entry-card';
        // Inizializza la variabile per il media (immagine o video)
        let mediaHtml = '';
        // Se è presente un mediaUrl...
        if (entry.mediaUrl) {
            // Se il media è un'immagine, crea un tag <img>
            if (entry.mediaUrl.match(/\.(jpeg|jpg|gif|png)$/i)) {
                mediaHtml = `<img src="${entry.mediaUrl}" alt="Foto">`;
                // Se il media è un video, crea un tag <video>
            } else if (entry.mediaUrl.match(/\.(mp4|webm|ogg)$/i)) {
                mediaHtml = `<video controls src="${entry.mediaUrl}"></video>`;
            }
        }
        // Imposta l'HTML della card con tutti i dati dell'entry
        card.innerHTML = `
            <div class="entry-media">${mediaHtml}</div>
            <div><strong>Luogo:</strong> ${entry.place}</div>
            <div><strong>Descrizione:</strong> ${entry.description}</div>
            <div><strong>Stato d'animo:</strong> ${entry.mood}</div>
            <div><strong>+:</strong> ${entry.positive}</div>
            <div><strong>-:</strong> ${entry.negative}</div>
            <div><strong>Impegno fisico:</strong> ${entry.physicalEffort}/5</div>
            <div><strong>Effort economico:</strong> ${entry.economicEffort}/5</div>
            <div><strong>Spesa:</strong> €${entry.expense}</div>
            <div class="entry-tags"><strong>Tags:</strong> ${entry.tags}</div>
        `;
        // Inserisci la card nella colonna
        col.appendChild(card);
        // Aggiungi la colonna alla lista delle entries nel DOM
        entriesList.appendChild(col);
    });
}