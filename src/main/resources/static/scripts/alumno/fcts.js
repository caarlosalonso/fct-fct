import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from '../functions.js';

const SECTION = 'curso-actual';

window.addEventListener('FormsCreated', (event) => {
    promise();
});

function promise() {
    Promise.all([
        fetchAlumno(),
        fetchAlumnosCurso(),
        fetchCursoActual(),
        fetchFCTs()
    ])
    .then(([
        alumno,
        alumnosCurso,
        cursoActual,
        fcts
    ]) => {
        build(alumno, alumnosCurso, cursoActual, fcts);
    }).catch((error) => {
        console.error('Error al obtener la información:', error);
    });
}

async function fetchAlumno() {
    const response = await fetch('/api/alumnos/self');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los alumnos del curso');
    return await response.json();
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

async function fetchFCTs() {
    const response = await fetch('/api/fcts/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los FCT');
    return await response.json();
}



function build(alumno, alumnosCurso, cursoActual, fcts) {
    console.log('Alumno:', alumno);
    console.log('Alumnos del curso:', alumnosCurso);
    console.log('Curso actual:', cursoActual);
    console.log('FCTs:', fcts);

}
