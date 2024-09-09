var map = L.map('map', {
    zoomControl: false
}).setView([-23.5505, -46.6333], 12); // São Paulo

L.tileLayer('https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=fnkpFFmNdDVOlFHshRfl').addTo(map);

// Add a pin function
function addPin(lat, lon, localId) {
    L.marker([lat, lon]).addTo(map).on('click', function () {
        fetch(`/api/getpininfo/${localId}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('current-place-id').value = localId;
                document.getElementById('drawer-title').textContent = data.nome;
                document.getElementById('drawer-description').textContent = data.descricao;
                document.getElementById('drawer-subtitle').textContent = data.subtitulo;
                document.getElementById('drawer-status').textContent = data.status;
                document.getElementById('drawer-stars').innerHTML = getStarIcons(data.estrelas);
                document.getElementById('infoDrawer').classList.add('drawer-open');

                // Fetch and display reviews
                fetchReviews(localId);

                // Fetch and display cardapio
                fetch(`/api/getcardapio/${localId}`)
                    .then(response => response.json())
                    .then(cardapio => {
                        const cardapioContent = document.getElementById('cardapio-content');
                        cardapioContent.innerHTML = '';
                        cardapio.forEach(item => {
                            const cardapioItem = document.createElement('div');
                            cardapioItem.innerHTML = `<strong>${item.nome}</strong>: ${item.descricao}`;
                            cardapioContent.appendChild(cardapioItem);
                        });
                    });

                // Fetch and display avisos
                fetch(`/api/getavisos/${localId}`)
                    .then(response => response.json())
                    .then(avisos => {
                        const avisosContent = document.getElementById('avisos-content');
                        avisosContent.innerHTML = '';
                        avisos.forEach(aviso => {
                            const avisoItem = document.createElement('div');
                            avisoItem.innerHTML = `<strong>${aviso.titulo}</strong>: ${aviso.descricao}`;
                            avisosContent.appendChild(avisoItem);
                        });
                    });

                // Clear review fields
                clearReviewFields();
            });
    });
}

// Add all pins
function addAllPins() {
    fetch('/api/getallpins')
        .then(response => response.json())
        .then(data => {
            data.forEach(pin => {
                addPin(pin.lat, pin.lon, pin.id);
            });
        });
}

// Add a marker to user's current location
function locateUser() {
    map.locate({ setView: true, maxZoom: 16 });
    map.on('locationfound', function (e) {
        L.marker(e.latlng).addTo(map).bindPopup("Você está aqui").openPopup();
    });
    map.on('locationerror', function () {
        alert("Não foi possível encontrar sua localização.");
    });
}

document.getElementById('locate-btn').addEventListener('click', function () {
    locateUser();
});

// Toggle drawer when clicking the toggle handle
document.querySelector('.drawer-toggle').addEventListener('click', function () {
    document.getElementById('infoDrawer').classList.toggle('drawer-open');
});

// Close drawer when clicking on the map
map.on('click', function () {
    document.getElementById('infoDrawer').classList.remove('drawer-open');
});

// Submit a new review
document.getElementById('submit-review').addEventListener('click', function () {
    const estrelas = document.querySelector('input[name="rating"]:checked').value;
    const texto = document.getElementById('review-texto').value;
    const localId = document.getElementById('current-place-id').value;

    fetch(`/api/postreview`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: localId,
            rating: estrelas,
            review: texto
        })
    }).then(response => response.json())
        .then(data => {
            // Refresh reviews
            fetchReviews(localId);
            // Clear review fields
            clearReviewFields();
        });
});

// Function to fetch and display reviews
function fetchReviews(localId) {
    fetch(`/api/getreviews/${localId}`)
        .then(response => response.json())
        .then(reviews => {
            const reviewsList = document.getElementById('reviews-list');
            reviewsList.innerHTML = '';
            reviews.forEach(review => {
                const reviewItem = document.createElement('div');
                reviewItem.innerHTML = `<strong>${review.usuario}</strong> (${review.estrelas} estrelas): ${review.texto_review}`;
                reviewsList.appendChild(reviewItem);
            });
        });
}

// Function to clear review fields
function clearReviewFields() {
    document.querySelector('input[name="rating"]:checked').checked = false;
    document.getElementById('review-texto').value = '';
}

// Function to generate star icons based on rating
function getStarIcons(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="bi bi-star${i <= rating ? '-fill' : ''}"></span>`;
    }
    return stars;
}

addAllPins();