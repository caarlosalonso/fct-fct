import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from './functions.js';

let TIMEOUT;
const SECTION = 'coordinadores-section';

document.addEventListener('DOMContentLoaded', () => {
    promise();
});

function promise() {
    tableLoading(SECTION);

    Promise.resolve(
        fetchCoordinadores()
    ).then((coordinadores) => {
        clearTimeout(TIMEOUT);
        buildCoordinadoresTable(coordinadores);
    }).catch((error) => {
        tableFail(SECTION, TIMEOUT, promise);
        console.error(error);
    });
}

async function fetchCoordinadores() {
    const response = await fetch('/api/vista-coordinadores/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los coordinadores');
    return await response.json();
}

function buildCoordinadoresTable(coordinadores) {
    console.log(coordinadores);

    const coordinadoresSection = document.getElementById(SECTION);
    while (coordinadoresSection.firstChild) {
        coordinadoresSection.removeChild(coordinadoresSection.firstChild);
    }

    if (coordinadores.length === 0) {
        const noCoordinadoresMessage = document.createElement('p');
        noCoordinadoresMessage.textContent = 'No hay coordinadores disponibles.';
        coordinadoresSection.appendChild(noCoordinadoresMessage);
        coordinadorCard.onclick = () => {
            id = null;
            const form = Form.getForm(FORM);
            form.onsubmit = createCoordinador;
        }
        return;
    }

    coordinadores.forEach((coordinador) => {
        const coordinadorCard = document.createElement('div');
        coordinadorCard.className = 'coordinador-card';
        coordinadorCard.innerHTML = `
            <h3>${coordinador.name}</h3>
            <p>${coordinador.email}</p>
        `;
        coordinadorCard.onclick = () => {
            id = coordinador.id;
            const form = Form.getForm(FORM);
            form.onsubmit = updateCoordinador;
        }
        coordinadoresSection.appendChild(coordinadorCard);
    });
}

const FORM = 'coordinador-form';
document.addEventListener('FormsCreated', (event) => {
    const form = Form.getForm(FORM);

    if (!form) {
        console.error(`Form with ID "${FORM}" not found.`);
        return;
    }

    form.onsubmit = createCoordinador;
});

function createCoordinador() {
    const form = Form.getForm(FORM);

    const nombre = form.getInput('coordinador-nombre').getValue();
    const email = form.getInput('coordinador-email').getValue();
    const password = form.getInput('coordinador-password').getValue();

    const data = {
        name: nombre,
        email: email,
        password: password
    }

    fetch('/api/coordinacion/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((response) => {
        if (response.status === 201 || response.ok) {
            form.showSuccess('Coordinador creado correctamente.');
            form.reset();
            promise();
        }
    })
    .catch((error) => {
        form.showError(`Error al crear el coordinador: ${error.message}`);
    });
}

let id = null;

function updateCoordinador() {
    const form = Form.getForm(FORM);

    const nombre = form.getInput('coordinador-nombre').getValue();
    const email = form.getInput('coordinador-email').getValue();
    const password = form.getInput('coordinador-password').getValue();

    const data = {
        name: nombre,
        email: email,
        password: password
    }

    if (id === null) {
        form.showError('No se ha seleccionado un coordinador para actualizar.');
        return;
    }

    fetch(`/api/coordinacion/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((response) => {
        if (response.ok) {
            form.showSuccess('Coordinador actualizado correctamente.');
            form.reset();
            promise();
        }
    })
    .catch((error) => {
        form.showError(`Error al actualizar el coordinador: ${error.message}`);
    });
}
