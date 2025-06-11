import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from '../functions.js';

const SECTION = 'curso-actual';

window.addEventListener('FormsCreated', (event) => {
    promise();
});

function promise() {
    Promise.all([
        fetchCursos(),
        fetchFCTs(),
        fetchGrupos()
    ])
    .then(([
        cursos,
        fcts,
        grupos
    ]) => {
        build(cursos, fcts, grupos);
    }).catch((error) => {
        console.error('Error al obtener la información:', error);
    });
}

async function fetchCursos() {
    const response = await fetch('/api/cursos/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los cursos');
    return await response.json();
}

async function fetchFCTs() {
    const response = await fetch('/api/fcts/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los FCT');
    return await response.json();
}

async function fetchGrupos() {
    const response = await fetch('/api/grupos/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los grupos');
    return await response.json();
}

function build(cursos, fcts, grupos) {
    console.log('Cursos:', cursos);
    console.log('FCTs:', fcts);
    console.log('Grupos:', grupos);
}
