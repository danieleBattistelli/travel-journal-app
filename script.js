const form = document.getElementById('entry-form');
const entriesList = document.getElementById('entries-list');
const geoBtn = document.getElementById('geo-btn');
let entries = [];

geoBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const coords = `${pos.coords.latitude}, ${pos.coords.longitude}`;
            form.place.value = coords;
        });
    } else {
        alert('Geolocalizzazione non supportata');
    }
});

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(form);
    let mediaUrl = data.get('mediaUrl');
    const mediaFile = data.get('mediaFile');
    if (!mediaUrl && mediaFile && mediaFile.size > 0) {
        mediaUrl = URL.createObjectURL(mediaFile);
    }
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
    entries.push(entry);
    renderEntries();
    form.reset();
});

function renderEntries() {
    entriesList.innerHTML = '';
    entries.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'entry-card';
        let mediaHtml = '';
        if (entry.mediaUrl) {
            if (entry.mediaUrl.match(/\.(jpeg|jpg|gif|png)$/i)) {
                mediaHtml = `<img src="${entry.mediaUrl}" alt="Foto">`;
            } else if (entry.mediaUrl.match(/\.(mp4|webm|ogg)$/i)) {
                mediaHtml = `<video controls src="${entry.mediaUrl}"></video>`;
            }
        }
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
        entriesList.appendChild(card);
    });
}