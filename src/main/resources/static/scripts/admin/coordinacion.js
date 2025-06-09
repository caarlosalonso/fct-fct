import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from '../functions.js';

let TIMEOUT;
const SECTION = 'coordinadores-section';
const FORM = 'coordinador-form';

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
    
    const parent = document.createElement('div');
    parent.classList.add('cell', 'hoverable');
    coordinadoresSection.appendChild(parent);

    let cell = document.createElement('div');
    cell.classList.add('cell-content', 'empty-cell');
    parent.appendChild(cell);

    cell.appendChild(createClickableSVG(
        "0 0 48 48",
        "M 44 20 L 28 20 L 28 4 C 28 2 26 0 24 0 S 20 2 20 4 L 20 20 L 4 20 C 2 20 0 22 0 24 S 2 28 4 28 L 20 28 L 20 44 C 20 46 22 48 24 48 S 28 46 28 44 L 28 28 L 44 28 C 46 28 48 26 48 24 S 46 20 44 20 Z",
        () => {
            const form = Form.getForm(FORM);
            setInputsToCreate();
        },
        'plus-svg'
    ));

    if (coordinadores.length === 0) return;

    coordinadores.forEach((coordinador) => {
        cell = document.createElement('div');
        cell.classList.add('cell', 'hoverable');
        coordinadoresSection.appendChild(cell);

        const coordinadorCard = document.createElement('div');
        coordinadorCard.classList.add('coordinador-card', 'cell-content', 'filled-cell');
        coordinadorCard.innerHTML = `
            <p class="cell-title">${coordinador.name}</p>
            <p class="cell-subtitle">${coordinador.email}</p>
        `;
        coordinadorCard.onclick = () => {
            const form = Form.getForm(FORM);
            setInputsToUpdate(coordinadores, coordinador.coordinacionId);
        }
        cell.appendChild(coordinadorCard);
    });
}

window.addEventListener('FormsCreated', (event) => {
    setInputsToCreate();
});

function setInputsToCreate() {
    const form = Form.getForm(FORM);
    console.log(form);

    if (!form) {
        console.error(`Form with ID "${FORM}" not found.`);
        return;
    }

    form.onsubmit = () => {
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

    form.getInput('coordinador-nombre').setValue('');
    form.getInput('coordinador-email').setValue('');
    form.getInput('coordinador-password').setValue('');
    
    form.form.setAttribute('submit-text', 'Crear coordinador');
    form.submit.textContent = 'Crear coordinador';
}

function setInputsToUpdate(coordinadores, coordinacionId) {
    const form = Form.getForm(FORM);
    console.log(form);

    if (!form) {
        console.error(`Form with ID "${FORM}" not found.`);
        return;
    }

    form.onsubmit = () => {
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
                form.submitFinish();
                promise();
            }
        })
        .catch((error) => {
            form.showError(`Error al actualizar el coordinador: ${error.message}`);
        });
    }

    const coordinador = coordinadores.find(c => c.coordinacionId === coordinacionId);

    form.getInput('coordinador-nombre').setValue(coordinador.name);
    form.getInput('coordinador-email').setValue(coordinador.email);
    form.getInput('coordinador-password').setValue('');

    form.form.setAttribute('submit-text', 'Actualizar coordinador');
    form.submit.textContent = 'Actualizar coordinador';
}
