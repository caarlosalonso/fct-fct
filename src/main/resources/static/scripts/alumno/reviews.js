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
        cursoTitle.textContent = `${curso.grupo.numero}º de ${curso.grupo.ciclo.acronimo} - ${curso.grupo.cicloLectivo.nombre}`;
        cursoTitle.classList.add('title');
        cursoDiv.appendChild(cursoTitle);

        const filteredFCT = fcts.find(fct => fct.curso.id === curso.id);
        console.log("FCT Filtrada: ", filteredFCT);
        if (! filteredFCT) {
            const cursoNoFCT = document.createElement('p');
            cursoNoFCT.textContent = `¡No tienes FCT! Habla con tu tutor para obtener una empresa en al que hacer la FCT.`;
            cursoNoFCT.classList.add('text');
            cursoDiv.appendChild(cursoNoFCT);

            const cursoProponerEmpresa = document.createElement('p');
            cursoProponerEmpresa.textContent = `Si tienes una empresa en mente, la puedes proponer a través de este enlace: `;
            cursoProponerEmpresa.classList.add('text');
            cursoDiv.appendChild(cursoProponerEmpresa);

            const link = document.createElement('a');
            link.href = '\empresas';
            link.textContent = 'Proponer empresa';
            cursoProponerEmpresa.appendChild(link);
            return;
        }

        if (! filteredFCT.motivoRenuncia) {
            const renunciaFCT = document.createElement('p');
            renunciaFCT.textContent = `Haz renunciado a las FCT, tu motivo de renuncia es: ${filteredFCT.motivoRenuncia}`;
            renunciaFCT.classList.add('text', 'renuncia');
            cursoDiv.appendChild(renunciaFCT);
        }

        const fctEmpresa = document.createElement('p');
        fctEmpresa.textContent = `Haz hecho tus FCT con: ${filteredFCT.empresa.nombre}`;
        fctEmpresa.classList.add('text', 'empresa');
        cursoDiv.appendChild(fctEmpresa);

        const fechas = document.createElement('p');
        fechas.textContent = `Desde ${filteredFCT.fechaInicio} hasta ${filteredFCT.fechaFin}`;
        fechas.classList.add('text', 'fechas');
        cursoDiv.appendChild(fechas);

        const horasHechas = document.createElement('p');
        horasHechas.textContent = `Has hecho un total de ${filteredFCT.horas ? filteredFCT.horas : 0} horas.`;
        horasHechas.classList.add('text', 'horas');
        cursoDiv.appendChild(horasHechas);

        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('review', 'collapsed');
        reviewDiv.id = `review-${filteredFCT.id}`;
        cursoDiv.appendChild(reviewDiv);

        const reviewHeader = document.createElement('p');
        reviewHeader.textContent = 'Reseña de la FCT';
        reviewHeader.classList.add('review-header');
        reviewDiv.appendChild(reviewHeader);

        const formDiv = document.createElement('div');
        formDiv.innerHTML = `
            <form id="review-form-${filteredFCT.empresa.id}">

            </form>
        `;
        reviewDiv.appendChild(formDiv);
    });
}
