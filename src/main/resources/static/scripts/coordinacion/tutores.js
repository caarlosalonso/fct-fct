import { Form } from '../classes/Form.js';
import { PasswordInput } from '../classes/PasswordInput';

let TIMEOUT;

window.addEventListener('DOMContentLoaded', () => {
    tableLoading();
});

window.addEventListener('FormsCreated', () => {
    promise();
});

function promise() {
    tableLoading();

    Promise.resolve(
        fetchTutores()
    ).then((
        tutores
    ) => {
        clearTimeout(TIMEOUT);
        buildTutoresTable(tutores);
    }).catch((error) => {
        tableFail();
        console.error(error);
    });
}

function tableLoading() {
    const tutoresSection = document.getElementById('tutores-section');
    while (tutoresSection.firstChild) {
        tutoresSection.removeChild(tutoresSection.firstChild);
    }

    const spinner = document.createElement('div');
    spinner.className = 'spinner spinner-border color-primary';
    tutoresSection.appendChild(spinner);

    const spinnerText = document.createElement('span');
    spinnerText.className = 'visually-hidden';
    spinnerText.textContent = 'Cargando...';
    spinner.appendChild(spinnerText);
}

function tableFail() {
    const tutoresSection = document.getElementById('tutores-section');
    while (tutoresSection.firstChild) {
        tutoresSection.removeChild(tutoresSection.firstChild);
    }

    const errorMessageSection = document.createElement('div');
    errorMessageSection.id = 'error-message-section';
    errorMessageSection.appendChild(createSVG(
        "0 0 48 48",
        "M 40.9706 35.3137 L 29.6569 24 L 40.9706 12.6863 C 42.3848 11.2721 42.3848 8.4437 40.9706 7.0294 S 36.7279 5.6152 35.3137 7.0294 L 24 18.3431 L 12.6863 7.0294 C 11.2721 5.6152 8.4437 5.6152 7.0294 7.0294 S 5.6152 11.2721 7.0294 12.6863 L 18.3431 24 L 7.0294 35.3137 C 5.6152 36.7279 5.6152 39.5563 7.0294 40.9706 S 11.2721 42.3848 12.6863 40.9706 L 24 29.6569 L 35.3137 40.9706 C 36.7279 42.3848 39.5563 42.3848 40.9706 40.9706 S 42.3848 36.7279 40.9706 35.3137 Z",
        () => {},
        "cross-svg"
    ));
    tutoresSection.appendChild(errorMessageSection);

    clearTimeout(TIMEOUT);
    TIMEOUT = setTimeout(() => {
        clearTimeout(TIMEOUT);
        
        tableLoading();
        TIMEOUT = setTimeout(() => {
            promise();
        }, 8000);
    }, 2000);
}

function createSVG(viewBox, pathData, clickHandler, ...classList) {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(SVG_NS, 'svg');
    classList.forEach(cls => svg.classList.add(cls));
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('xmlns', SVG_NS);
    svg.onclick = clickHandler;

    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', pathData);
    svg.appendChild(path);

    return svg;
}

async function fetchTutores() {
    const response = await fetch('/api/vista-tutores/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los tutores');
    return await response.json();
}

function buildTutoresTable(tutores) {
    console.log(tutores);

    const tutoresSection = document.getElementById('tutores-section');
    while (tutoresSection.firstChild) {
        tutoresSection.removeChild(tutoresSection.firstChild);
    }

    if (tutores.length === 0) {
        const noTutoresMessage = document.createElement('p');
        noTutoresMessage.textContent = 'No hay tutores disponibles.';
        tutoresSection.appendChild(noTutoresMessage);
        return;
    }

    tutores.forEach((tutor) => {
        const tutorCard = document.createElement('div');
        tutorCard.className = 'tutor-card';
        tutorCard.innerHTML = `
            <h3>${tutor.name}</h3>
            <p>${tutor.email}</p>
        `;
        tutoresSection.appendChild(tutorCard);
    });
}
