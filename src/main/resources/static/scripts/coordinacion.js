import { Form } from './classes/Form.js';

window.addEventListener('DOMContentLoaded', (event) => {
    fetchFormaciones();
});

function fetchFormaciones() {
    const NIVELES = {
        'BASICA': 'Básica',
        'MEDIO': 'Medio',
        'SUPERIOR': 'Superior'
    }

    const formacionesContainer = document.getElementById('formaciones-container');
    formacionesContainer.innerHTML = '';

    fetch('/api/formaciones/all', {
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
        data.forEach(formacion => {
            const div = document.createElement('div');
            div.classList.add('formacion-item');
            // Should be replaced with createElements
            div.innerHTML = `
                <p class="formacion-titulo">(${formacion.acronimo}) ${formacion.name}</p>
                <p class="formacion-nivel">${NIVELES[formacion.nivel]}</p>
                <p class="formacion-familia-profesional">${formacion.familiaProfesional}</p>
                <p class="formacion-horas">${formacion.horasPracticas}</p>
            `;
            formacionesContainer.appendChild(div);
        });
    })
    .catch(error => {
        formacionesContainer.innerHTML = '<p>Error al cargar las formaciones.</p>';
    });
}