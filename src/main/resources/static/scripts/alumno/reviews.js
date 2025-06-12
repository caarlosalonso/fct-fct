import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from '../functions.js';

const SECTION = 'reviews-section';

window.addEventListener('DOMContentLoaded', (event) => {
    promise();
});

function promise() {
    Promise.all([
        fetchEmpresas(),
        fetchFCTs(),
        fetchCursos()
    ])
    .then(([
        empresas,
        fcts,
        cursos
    ]) => {
        build(empresas, fcts, cursos);
    }).catch((error) => {
        console.error('Error al obtener la información:', error);
    });
}

async function fetchEmpresas() {
    const response = await fetch('/api/vista-empresas-plazas/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener las empresas');
    return await response.json();
}

async function fetchFCTs() {
    const response = await fetch('/api/fcts/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los FCT');
    return await response.json();
}

async function fetchCursos() {
    const response = await fetch('/api/cursos/alumno');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los cursos');
    return await response.json();
}

function build(empresas, fcts, cursos) {
    console.log('Empresas:', empresas);
    console.log('FCTs:', fcts);
    console.log('Cursos:', cursos);

    const section = document.getElementById(SECTION);
    if (!section) {
        console.error(`No se encontró la sección con ID: ${SECTION}`);
        return;
    }
    while(section.firstChild) section.removeChild(section.firstChild);
    if (cursos.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'No hay cursos disponibles.';
        section.appendChild(message);
        return;
    }

    cursos.filter((curso) => {
        const cursoDiv = document.createElement('div');
        cursoDiv.classList.add('curso');
        section.appendChild(cursoDiv);

        const cursoTitle = document.createElement('p');
        cursoTitle.textContent = `Curso: ${curso.grupo.cicloLectivo.nombre} - ${curso.grupo.numero}º de ${curso.grupo.ciclo.acronimo}`;
        cursoDiv.appendChild(cursoTitle);
    });
}
