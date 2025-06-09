import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from './functions.js';

let TIMEOUT;
const SECTION = 'tutores-section';
const FORM = 'tutor-form';

window.addEventListener('DOMContentLoaded', () => {
    promise();
});

function promise() {
    tableLoading(SECTION);

    Promise.resolve(
        fetchTutores()
    ).then((
        tutores
    ) => {
        clearTimeout(TIMEOUT);
        buildTutoresTable(tutores);
    }).catch((error) => {
        tableFail(SECTION, TIMEOUT, promise);
        console.error(error);
    });
}

async function fetchTutores() {
    const response = await fetch('/api/vista-tutores/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los tutores');
    return await response.json();
}

function buildTutoresTable(tutores) {
    console.log(tutores);

    const tutoresSection = document.getElementById(SECTION);
    while (tutoresSection.firstChild) tutoresSection.removeChild(tutoresSection.firstChild);

    const parent = document.createElement('div');
    parent.classList.add('cell', 'hoverable');
    tutoresSection.appendChild(parent);

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

    if (tutores.length === 0) return;

    tutores.forEach((tutor) => {
        cell = document.createElement('div');
        cell.classList.add('cell', 'hoverable');
        tutoresSection.appendChild(cell);

        const tutorCard = document.createElement('div');
        tutorCard.classList.add('tutor-card', 'cell-content', 'filled-cell');
        tutorCard.innerHTML = `
            <p class="cell-title">${tutor.name}</p>
            <p class="cell-subtitle">${tutor.email}</p>
        `;
        tutorCard.onclick = () => {
            const form = Form.getForm(FORM);
            setInputsToUpdate(tutores, tutor.tutorId);
        }
        cell.appendChild(tutorCard);
    });
}

window.addEventListener('FormsCreated', () => {
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
        const nombre = form.getInput('tutor-nombre').getValue();
        const email = form.getInput('tutor-email').getValue();
        const password = form.getInput('tutor-password').getValue();

        const data = {
            name: nombre,
            email: email,
            password: password
        }

        console.log(data)

        fetch('/api/tutores/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            console.log(response);
            if (response.status === 201 || response.ok) {
                form.showSuccess('Tutor creado correctamente.');
                form.reset();
                promise();
            }
        })
        .catch((error) => {
            form.showError(`Error al crear el tutor: ${error.message}`);
        });
    }

    form.getInput('tutor-nombre').retrack('');
    form.getInput('tutor-email').retrack('');
    form.getInput('tutor-password').retrack('');

    form.form.setAttribute('submit-text', 'Crear tutor');
    form.submit.textContent = 'Crear tutor';
}

function setInputsToUpdate(tutores, tutorId) {
    const form = Form.getForm(FORM);
    console.log(form);

    if (!form) {
        console.error(`Form with ID "${FORM}" not found.`);
        return;
    }

    form.onsubmit = () => {
        const nombre = form.getInput('tutor-nombre').getValue();
        const email = form.getInput('tutor-email').getValue();
        const password = form.getInput('tutor-password').getValue();

        const data = {
            name: nombre,
            email: email,
            password: password
        }

        if (tutorId === null) {
            form.showError('No se ha seleccionado un tutor para actualizar.');
            return;
        }

        fetch(`/api/tutores/${tutorId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            if (response.ok) {
                form.showSuccess('Tutor actualizado correctamente.');
                form.reset();
                form.submitFinish();
                promise();
            }
        })
        .catch((error) => {
            form.showError(`Error al actualizar el tutor: ${error.message}`);
        });
    }

    const tutor = tutores.find(c => c.tutorId === tutorId);

    form.getInput('tutor-nombre').retrack(tutor.name);
    form.getInput('tutor-email').retrack(tutor.email);
    form.getInput('tutor-password').retrack('');

    form.form.setAttribute('submit-text', 'Actualizar tutor');
    form.submit.textContent = 'Actualizar tutor';
}
