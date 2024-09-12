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
                document.getElementById('drawer-stars').innerHTML = getStarIcons(data.estrelas);

                fetch(`/api/gethorarioinfo/${localId}`)
                    .then(response => response.json())
                    .then(horarios => {
                        const horarioTable = document.getElementById('drawer-horario-table');
                        horarioTable.innerHTML = '';
                        horarios.forEach(horario => {
                            const row = document.createElement('tr');
                            row.innerHTML = `<td>${horario.dia_semana}</td><td>${formatTime(horario.horario_abertura)}</td><td>${formatTime(horario.horario_fechamento)}</td>`;
                            horarioTable.appendChild(row);
                        });

                        const currentStatus = getCurrentStatus(horarios);
                        document.getElementById('drawer-status').textContent = currentStatus;
                        document.getElementById('drawer-status').className = currentStatus === 'Aberto' ? 'badge bg-success' : 'badge bg-danger';
                    });

                document.getElementById('infoDrawer').classList.add('drawer-open');

                fetchReviews(localId);
                clearReviewFields();
            });
    });
}

// Formatar o horário para HH:mm
function formatTime(timeString) {

    if (!timeString) {
        return 'fechado';
    }

    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

// função de pesquisa
document.getElementById('search-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevenir comportamento padrão do formulário
    
        const searchInput = document.getElementById('search-input').value;
    
        fetch(`/api/getcoords/${searchInput}`)
            .then(response => response.json())
            .then(data => {
                if (data.lat && data.lon) {
                    map.setView([data.lat, data.lon], 16); // Centralizar o mapa nas coordenadas
                } else {
                    alert('Local não encontrado');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar coordenadas:', error);
                alert('Erro ao buscar coordenadas');
            });
    });


function getCurrentStatus(horarios) {
    const now = new Date();
    const currentDay = now.toLocaleDateString('pt-BR', { weekday: 'long' });
    const currentTime = now.toTimeString().slice(0, 5); // Obtém HH:mm

    console.log('Horarios:', horarios);
    console.log('currentTime:', currentTime);

    // Garantir que o formato dos dias da semana esteja correto
    const diaSemana = {
        "domingo": "Domingo",
        "segunda-feira": "Segunda",
        "terça-feira": "Terça",
        "quarta-feira": "Quarta",
        "quinta-feira": "Quinta",
        "sexta-feira": "Sexta",
        "sábado": "Sábado"
    };
    const currentDayFormatted = diaSemana[now.toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase()] || '';

    console.log('currentDayFormatted:', currentDayFormatted);

    // Encontrar o horário do dia atual
    const todayHorario = horarios.find(horario => horario.dia_semana === currentDayFormatted);

    console.log('todayHorario:', todayHorario);

    if (todayHorario && todayHorario.horario_abertura && todayHorario.horario_fechamento) {
        const abertura = todayHorario.horario_abertura.slice(0, 5); // Mantém apenas HH:mm
        const fechamento = todayHorario.horario_fechamento.slice(0, 5); // Mantém apenas HH:mm

        return (currentTime >= abertura && currentTime <= fechamento) ? 'Aberto' : 'Fechado';
    }
    return 'Fechado';
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
            fetchReviews(localId);
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
    const checkedRating = document.querySelector('input[name="rating"]:checked');
    if (checkedRating) {
        checkedRating.checked = false;
    }
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

// Function to handle logout
function handleLogout() {
    window.location.href = '/login';
}

function toggle_edit_button() {
    fetch('/api/isuseradmin')
        .then(response => response.json())
        .then(data => {
            if (data.adm) {
                document.getElementById('edit-pin-btn').style.display = 'block';
            } else {
                document.getElementById('edit-pin-btn').style.display = 'none';
            }
        });
}

toggle_edit_button();

document.getElementById('logout-btn').addEventListener('click', handleLogout);

addAllPins();

document.addEventListener('DOMContentLoaded', () => {
    const editPinForm = document.getElementById('edit-pin-form');
    editPinForm.addEventListener('submit', handleEditPinFormSubmit);

    const editPinModal = document.getElementById('editPinModal');
    editPinModal.addEventListener('show.bs.modal', populateEditPinForm);
});

function populateEditPinForm() {
    const pinId = document.getElementById('current-place-id').value;
    fetch(`/api/getpininfo/${pinId}`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                document.getElementById('pin-id').value = data.id;
                document.getElementById('pin-name').value = data.nome;
                document.getElementById('pin-description').value = data.descricao;
            }
        })
        .catch(error => console.error('Error fetching pin data:', error));
}

function handleEditPinFormSubmit(event) {
    event.preventDefault();

    const pinId = document.getElementById('pin-id').value;
    const nome = document.getElementById('pin-name').value;
    const descricao = document.getElementById('pin-description').value;

    fetch(`/api/editpin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: pinId, nome, descricao })
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                fetch(`/api/getpininfo/${pinId}`)
                    .then(response => response.json())
                    .then(updatedData => {
                        document.getElementById('drawer-title').textContent = updatedData.nome;
                        document.getElementById('drawer-description').textContent = updatedData.descricao;
                        document.getElementById('drawer-subtitle').textContent = updatedData.subtitulo;
                        document.getElementById('drawer-status').textContent = updatedData.status;
                        document.getElementById('drawer-stars').innerHTML = getStarIcons(updatedData.estrelas);
                    });

                const editPinModal = bootstrap.Modal.getInstance(document.getElementById('editPinModal'));
                editPinModal.hide();
            }
        })
        .catch(error => console.error('Error editing pin:', error));
}

document.querySelector('.drawer-toggle').addEventListener('click', function () {
    document.body.classList.toggle('drawer-open');
});

document.getElementById('logout-btn').addEventListener('click', function () {
    fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin'
    }).then(response => {
        if (response.ok) {
            window.location.href = '/login';
        } else {
            alert('Erro ao fazer logout');
        }
    });
});