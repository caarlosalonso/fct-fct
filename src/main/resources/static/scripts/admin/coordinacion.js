import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from '../functions.js';

let TIMEOUT;
const SECTION = 'coordinadores-section';
const FORM = 'coordinador-form';
let coordinacionId = null;

window.addEventListener('DOMContentLoaded', () => {
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
        coordinadoresSection.onclick = () => {
            coordinacionId = null;
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
            coordinacionId = coordinador.coordinacionId;
            const form = Form.getForm(FORM);
            form.onsubmit = updateCoordinador;
        }
        coordinadoresSection.appendChild(coordinadorCard);
    });
}

window.addEventListener('FormsCreated', (event) => {
    const form = Form.getForm(FORM);
    console.log(form);

    if (!form) {
        console.error(`Form with ID "${FORM}" not found.`);
        return;
    }

    form.onsubmit = createCoordinador;
});

function createCoordinador() {
    const form = Form.getForm(FORM);
    console.log(form);

    const nombre = form.getInput('coordinador-nombre').getValue();
    const email = form.getInput('coordinador-email').getValue();
    const password = form.getInput('coordinador-password').getValue();

    const data = {
        name: nombre,
        email: email,
        password: password
    }

    console.log(data)

    fetch('/api/coordinacion/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((response) => {
        console.log(response);
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

    if (coordinacionId === null) {
        form.showError('No se ha seleccionado un coordinador para actualizar.');
        return;
    }

    fetch(`/api/coordinacion/${coordinacionId}`, {
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
