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

    document.querySelectorAll('form').forEach(form => new Form(form).init());
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
    bar.appendChild(nombreSpan);

    const empresaSpan = document.createElement('span');
    empresaSpan.classList.add('empresa-nombre');
    if (! alumno.nombreEmpresa) empresaSpan.classList.add('sin-empresa');
    empresaSpan.textContent = `${alumno.nombreEmpresa || 'Sin empresa'}`;
    bar.appendChild(empresaSpan);

    const collapseSpan = document.createElement('span');
    collapseSpan.classList.add('alumno-collapse', 'collapsed');
    collapseSpan.textContent = `◀`;
    bar.appendChild(collapseSpan);
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

    const fct = document.createElement('div');
    fct.innerHTML = `
    <form id="fct-form-${alumno.alumnoId}" method="POST">
        <div class="inputs form-container">
            <div class="instance form-input grouped-inputs">
                <div class="form-group form-input">
                    <input type="select" name="empresa" class="text-based input" label="Empresa" data-show-validity="true" data-required="true">
                </div>
            </div>
            <div class="instance form-input grouped-inputs">
                <div class="form-group form-input">
                    <input type="date" name="fechaInicio" class="text-based input" label="Fecha de inicio" data-show-validity="true" data-required="true">
                </div>
            </div>
            <div class="instance form-input grouped-inputs">
                <div class="form-group form-input">
                    <input type="range" name="horasSemanales" class="text-based input" label="{n} Hora{s} semanal{es}" data-show-validity="true" data-required="true" min="30" max="40" step="1" value="40">
                </div>
                <div class="form-group form-input">
                    <p class="info">Sin contar sábados y domingos</p>
                    <input type="range" name="noLectivos" class="text-based input" label="{n} No lectivo{s}" data-show-validity="true" data-required="true" min="0" max="20" step="1" value="0">
                </div>
                <div class="form-group form-input">
                    <input type="range" name="horasDePracticas" class="text-based input" label="{n} Hora{s} de prácticas" data-show-validity="true" data-required="true" min="300" max="500" step="1" value="370">
                </div>
            </div>
            <div class="instance form-input grouped-inputs">
                <div class="form-group form-input">
                    <input type="date" name="fechaFin" class="text-based input" label="Fin de FCT" data-show-validity="true" data-required="true">
                </div>
            </div>
        </div>
    <form>
    `;
    cell.appendChild(fct);

    return cell;
}
