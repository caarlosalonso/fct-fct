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

    const fctsAlumno = fcts.filter((fct) => fct.curso.alumno.id === alumno.id);
    const fctActual = fctsAlumno.find((fct) => fct.curso.grupo.cicloLectivo.id === cursoActual.id);

    console.log("Fcts: ", fctsAlumno, "Fct Actual: ", fctActual);

    let horasHechas = 0;
    fctsAlumno.forEach((fct) => {
        if (fct.id === fctActual.id) return;
        horasHechas += fct.horas ? fct.horas : 0;
    });

    console.log("Horas hechas: ", horasHechas);

    const main = document.getElementById('main-content');
    if (!main) {
        console.error(`No se encontró el elemento con ID: main-content`);
        return;
    }
    while (main.firstChild) main.removeChild(main.firstChild);

    main.innerHTML = `
        <h2>FCTs del Alumno</h2>
        <ul>
            ${fctsAlumno.map(fct => `<li>${fct.nombre}: ${fct.horas ? fct.horas : 0} horas</li>`).join('')}
        </ul>
        <h3>FCT Actual</h3>
        <p>${fctActual.nombre}: ${fctActual.horas ? fctActual.horas : 0} horas</p>
        <h3>Horas Hechas</h3>
        <p>${horasHechas} horas</p>
    `;
}
