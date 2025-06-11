import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from '../functions.js';

const SECTION = 'main-content';

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

async function fetchCiclos() {
    const response = await fetch('/api/ciclos/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los ciclos');
    return await response.json();
}

async function fetchCiclosLectivos() {
    const response = await fetch('/api/ciclos-lectivos/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los ciclos lectivos');
    return await response.json();
}

async function fetchStats() {
    const response = await fetch('/api/stats');
    if (!response.ok) throw new Error('Error al obtener las estadísticas');
    return await response.json();
}

function build(cursos, fcts, grupos, ciclos, ciclosLectivos, stats) {
    console.log('Cursos:', cursos);
    console.log('FCTs:', fcts);
    console.log('Grupos:', grupos);
    console.log('Ciclos:', ciclos);
    console.log('Ciclos Lectivos:', ciclosLectivos);
    console.log('Estadísticas:', stats);

    const section = document.getElementById(SECTION);
    if (!section) {
        console.error(`No se encontró la sección con ID: ${SECTION}`);
        return;
    }
    while (section.firstChild) section.removeChild(section.firstChild);

    const statsDiv = document.createElement('div');
    statsDiv.innerHTML = `
        <h2>Estadísticas</h2>
        <p>Alumnos por ciclo lectivo:</p>
        <ul>
            ${stats.alumnosPorCicloLectivo.map(stat => `<li>${stat.nombre}: ${stat.totalAlumnos}</li>`).join('')}
        </ul>
        <p>Prácticas por ciclo lectivo:</p>
        <ul>
            ${stats.practicasPorCicloLectivo.map(stat => `<li>${stat.nombre}: ${stat.totalPracticas}</li>`).join('')}
        </ul>
        <p>Renuncias por ciclo lectivo:</p>
        <ul>
            ${stats.renunciasPorCicloLectivo.map(stat => `<li>${stat.nombre}: ${stat.totalRenuncias}</li>`).join('')}
        </ul>
        <p>Alumnos que titulan por ciclo lectivo:</p>
        <ul>
            ${stats.titulanPorCicloLectivo.map(stat => `<li>${stat.nombre}: ${stat.totalTitulan}</li>`).join('')}
        </ul>
        <p>Motivos de renuncia:</p>
        <ul>
            ${Object.entries(stats.motivosRenuncia).map(([motivo, count]) => `<li>${motivo}: ${count}</li>`).join('')}
        </ul>
    `;
    section.appendChild(statsDiv);
}

window.addEventListener('FormsCreated', async (event) => {
    try {
        const stats = await fetchStats();
        promise(stats);
    } catch (error) {
        console.error('Error al obtener las estadísticas:', error);
    }
});

function promise(stats) {
    Promise.all([
        fetchCursos(),
        fetchFCTs(),
        fetchGrupos(),
        fetchCiclos(),
        fetchCiclosLectivos()
    ])
    .then(([
        cursos,
        fcts,
        grupos,
        ciclos,
        ciclosLectivos
    ]) => {
        build(cursos, fcts, grupos, ciclos, ciclosLectivos, stats);
    }).catch((error) => {
        console.error('Error al obtener la información:', error);
    });
}
