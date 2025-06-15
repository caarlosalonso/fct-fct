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

    const statsTable = document.createElement('table');
    if (stats.alumnosPorCicloLectivo.length === 0) {
        statsTable.innerHTML = `
            <thead>
                <tr>
                    <th>Ciclo Lectivo</th>
                    <th>Cantidad de Alumnos</th>
                    <th>Cantidad que va a Prácticas</th>
                    <th>Cantidad que Renuncia</th>
                    <th>Cantidad que Titula</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
            </tbody>
        `;
    } else {
        statsTable.innerHTML = `
            <thead>
                <tr>
                    <th>Ciclo Lectivo</th>
                    <th>Cantidad de Alumnos</th>
                    <th>Cantidad que va a Prácticas</th>
                    <th>Cantidad que Renuncia</th>
                    <th>Cantidad que Titula</th>
                </tr>
            </thead>
            <tbody>
                ${stats.alumnosPorCicloLectivo.map((stat, index) => `
                    <tr>
                        <td>${stat.nombre}</td>
                        <td>${stat.totalAlumnos}</td>
                        <td>${stats.practicasPorCicloLectivo[index]?.totalPracticas || 0}</td>
                        <td>${stats.renunciasPorCicloLectivo[index]?.totalRenuncias || 0}</td>
                        <td>${stats.titulanPorCicloLectivo[index]?.totalTitulan || 0}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
    }
    section.appendChild(statsTable);

    const motivosList = Object.entries(stats.motivosRenuncia)
        .sort(([, countA], [, countB]) => countB - countA)
        .map(([motivo, count]) => `<li>${count}: ${motivo}</li>`)
        .join('');

    const motivosDiv = document.createElement('div');
    motivosDiv.innerHTML = `
        <h3>Motivos por renunciar a las prácticas:</h3>
        <ul>
            ${motivosList.length > 0 ? motivosList : '<li>No hay motivos registrados</li>'}
        </ul>
    `;
    section.appendChild(motivosDiv);
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
