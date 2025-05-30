// All this might get deleted

window.addEventListener('DOMContentLoaded', (event) => {
    fetchFormaciones();
});

function fetchFormaciones() {
    const NIVELES = {
        'BASICA': 'Básica',
        'MEDIO': 'Medio',
        'SUPERIOR': 'Superior'
    }

    const ciclosContainer = document.getElementById('ciclos-container');
    ciclosContainer.innerHTML = '';

    fetch('/api/ciclos/all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) return response.json();
        if (response.status === 204) return [];
        throw new Error('Network response was not ok');
    })
    .then(data => {
        data.forEach(ciclo => {
            const div = document.createElement('div');
            div.classList.add('ciclo-item');
            // Should be replaced with createElements
            div.innerHTML = `
                <p class="ciclo-titulo">(${ciclo.acronimo}) ${ciclo.name}</p>
                <p class="ciclo-nivel">${NIVELES[ciclo.nivel]}</p>
                <p class="ciclo-familia-profesional">${ciclo.familiaProfesional}</p>
                <p class="ciclo-horas">${ciclo.horasPracticas}</p>
            `;
            ciclosContainer.appendChild(div);
        });
    })
    .catch(error => {
        ciclosContainer.innerHTML = '<p>Error al cargar los ciclos.</p>';
    });
}