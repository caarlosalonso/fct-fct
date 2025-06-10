import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from '../functions.js';

const SECTION = 'curso-actual';

window.addEventListener('FormsCreated', (event) => {
    promise();
});

function promise() {
    Promise.all([
        fetchCursoActual(),
        fetchGrupoTutor(),
        fetchAlumnosCurso()
    ])
    .then(([
        cursoActual,
        grupoTutor,
        alumnosCurso
    ]) => {
        build(cursoActual, grupoTutor, alumnosCurso);
    }).catch((error) => {
        console.error('Error al obtener la información:', error);
    });
}

async function fetchAlumnosCurso() {
    const response = await fetch('/api/vista-alumnos-curso/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los alumnos del curso');
    return await response.json();
}

async function fetchCursoActual() {
    const response = await fetch('/api/ciclos-lectivos/actual');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los ciclos lectivos');
    return await response.json();
}

async function fetchGrupoTutor() {
    const response = await fetch('/api/vista-grupos-ciclos/tutor');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los grupos');
    return await response.json();
}

function build(cursoActual, grupoTutor, alumnosCurso) {
    console.log('Ciclo lectivo actual:', cursoActual);
    console.log('Grupo tutor:', grupoTutor);
    console.log('Alumnos del curso:', alumnosCurso);

    const verdes = document.getElementById('verdes');
    const amarillos = document.getElementById('amarillos');
    const rojos = document.getElementById('rojos');

    verdes.innerHTML = '';
    amarillos.innerHTML = '';
    rojos.innerHTML = '';

    alumnosCurso.forEach((alumno) => {
        const cell = createCell(alumno);
        if (alumno.rating === 'VERDE') {
            verdes.appendChild(cell);
        } else if (alumno.rating === 'AMARILLO') {
            amarillos.appendChild(cell);
        } else if (alumno.rating === 'ROJO') {
            rojos.appendChild(cell);
        }
    });
}

function createCell(alumno) {
    const cell = document.createElement('div');
    cell.classList.add('alumno-cell');

    const bar = document.createElement('p');
    bar.classList.add('alumno-bar', 'collapsed');
    cell.appendChild(bar);

    const nombreSpan = document.createElement('span');
    nombreSpan.classList.add('alumno-nombre');
    nombreSpan.textContent = `${alumno.nombreAlumno}`;
    cell.appendChild(nombreSpan);

    const empresaSpan = document.createElement('span');
    empresaSpan.classList.add('empresa-nombre');
    if (! alumno.nombreEmpresa) empresaSpan.classList.add('sin-empresa');
    empresaSpan.textContent = `${alumno.nombreEmpresa || 'Sin empresa'}`;
    cell.appendChild(empresaSpan);

    const collapseSpan = document.createElement('span');
    collapseSpan.classList.add('alumno-collapse', 'collapsed');
    collapseSpan.textContent = `◀`;
    cell.appendChild(collapseSpan);


    bar.onclick = () => {
        if (bar.classList.contains('collapsed')) {
            bar.classList.remove('collapsed');
            bar.classList.add('expanded');
            collapseSpan.classList.remove('collapsed');
        } else {
            bar.classList.remove('expanded');
            bar.classList.add('collapsed');
            collapseSpan.classList.add('collapsed');
        }
    };

    return cell;
}
