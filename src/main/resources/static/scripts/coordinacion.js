window.addEventListener('DOMContentLoaded', (event) => {
    fetchFormaciones();
});

function fetchFormaciones() {
    const dataExample = [
        {
            "formacion_id": 1,
            "nombre": "Desarrollo de Aplicaciones Web",
            "acronimo": "DAW",
            "nivel": "SUPERIOR",
            "familia_profesional": "Desarrollo de Software",
            "horas": 300
        }
    ];

    fetch('/formaciones', {
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
        const ciclosContainer = document.getElementById('ciclos-container');
        ciclosContainer.innerHTML = ''; // Clear existing options
        data.forEach(ciclo => {
            const div = document.createElement('div');
            div.classList.add('ciclo-item');
            // Should be replaced with createElements
            div.innerHTML = `
                <p class="ciclo-titulo">(${ciclo.acronimo}) ${ciclo.nombre}</p>
                <p class="ciclo-nivel">${ciclo.nivel}</p>
                <p class="ciclo-familia-profesional">${ciclo.familia_profesional}</p>
                <p class="ciclo-horas">${ciclo.horas}</p>
            `;
            ciclosContainer.appendChild(div);
        });
    })
    .catch(error => {
        console.error('Error fetching ciclos:', error);
    });
}