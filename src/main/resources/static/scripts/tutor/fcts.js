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
        fetchAlumnosCurso(),
        fetchEmpresas(),
        fetchTutoresEmpresas(),
        fetchFCTs()
    ])
    .then(([
        cursoActual,
        grupoTutor,
        alumnosCurso,
        empresas,
        tutoresEmpresas,
        fcts
    ]) => {
        build(cursoActual, grupoTutor, alumnosCurso, empresas, tutoresEmpresas, fcts);
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

async function fetchEmpresas() {
    const response = await fetch('/api/vista-empresas-plazas/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener las empresas');
    return await response.json();
}

async function fetchTutoresEmpresas() {
    const response = await fetch('/api/tutores-empresas/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los tutores de empresas');
    return await response.json();
}

async function fetchFCTs() {
    const response = await fetch('/api/fct/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los FCT');
    return await response.json();
}



function build(cursoActual, grupoTutor, alumnosCurso, empresas, tutoresEmpresas, fcts) {
    console.log('Ciclo lectivo actual:', cursoActual);
    console.log('Grupo tutor:', grupoTutor);
    console.log('Alumnos del curso:', alumnosCurso);
    console.log('Empresas:', empresas);
    console.log('Tutores de empresas:', tutoresEmpresas);
    console.log('FCTs:', fcts);

    const verdes = document.getElementById('verdes');
    const amarillos = document.getElementById('amarillos');
    const rojos = document.getElementById('rojos');

    verdes.innerHTML = '';
    amarillos.innerHTML = '';
    rojos.innerHTML = '';

    // Sólo alumnos de su curso
    alumnosCurso = alumnosCurso.filter(alumno => alumno.grupoId === grupoTutor.grupoId)
                                .sort((a, b) => a.nombreAlumno.localeCompare(b.nombreAlumno));

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

    alumnosCurso.forEach((alumno) => {
        computeFinFCT(alumno.alumnoId);
        searchEmpresa(alumno.alumnoId, empresas);
        searchTutorEmpresa(alumno.alumnoId, tutoresEmpresas);
    });
}

function createCell(alumno) {
    const cell = document.createElement('div');
    cell.classList.add('alumno-cell', 'collapsed');

    const bar = document.createElement('p');
    bar.classList.add('alumno-bar');
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
        if (cell.classList.contains('collapsed')) {
            cell.classList.remove('collapsed');
            cell.classList.add('expanded');
            collapseSpan.textContent = `◀`;
        } else {
            cell.classList.remove('expanded');
            cell.classList.add('collapsed');
            collapseSpan.textContent = `▼`;
        }
    };

    const fct = document.createElement('div');
    fct.innerHTML = `
    <form id="fct-form-${alumno.alumnoId}" method="POST">
        <div class="inputs form-container">
            <div class="instance form-input grouped-inputs">
                <div class="form-group form-input">
                    <input id="empresa-${alumno.alumnoId}" type="select" name="empresa" class="text-based input" label="Empresa" data-show-validity="true" data-required="true">
                </div>
            </div>
            <div class="instance form-input grouped-inputs">
                <div class="form-group form-input">
                    <input id="tutor-empresa-${alumno.alumnoId}" type="select" name="tutor_empresa" class="text-based input" label="Tutor de empresa" data-show-validity="true">
                </div>
            </div>
            <div class="instance form-input grouped-inputs">
                <div class="form-group form-input">
                    <input id="fecha-inicio-${alumno.alumnoId}" type="date" name="fechaInicio" class="text-based input" label="Fecha de inicio" data-show-validity="true" data-required="true">
                </div>
            </div>
            <div class="instance form-input grouped-inputs">
                <div class="form-group form-input">
                    <input id="horas-semanales-${alumno.alumnoId}" type="range" name="horasSemanales" class="text-based input" label="{n} Hora{s} semanal{es}" data-required="true" data-min="30" data-max="40" data-step="1" data-value="40">
                </div>
                <div class="form-group form-input">
                    <p class="info">Sin contar sábados y domingos</p>
                    <input id="no-lectivos-${alumno.alumnoId}" type="range" name="noLectivos" class="text-based input" label="{n} No lectivo{s}" data-required="true" data-min="0" data-max="20" data-step="1" data-value="0">
                </div>
                <div class="form-group form-input">
                    <input id="horas-de-practicas-${alumno.alumnoId}" type="range" name="horasDePracticas" class="text-based input" label="{n} Hora{s} de prácticas" data-required="true" data-min="300" data-max="500" data-step="1" data-value="370">
                </div>
            </div>
            <div class="instance form-input grouped-inputs">
                <div class="form-group form-input">
                    <input id="fecha-fin-${alumno.alumnoId}" type="date" name="fechaFin" class="text-based input" label="Fin de FCT" data-show-validity="true" data-required="true">
                </div>
            </div>
        </div>
    <form>
    `;
    cell.appendChild(fct);

    return cell;
}

function computeFinFCT(alumnoId) {
    const formulario = Form.getForm(`fct-form-${alumnoId}`);
    if (!formulario) {
        console.error(`Formulario con ID fct-form-${alumnoId} no encontrado.`);
        return;
    }
    const fechaInicioInput = formulario.getInput(`fecha-inicio-${alumnoId}`);
    const horasSemanalesInput = formulario.getInput(`horas-semanales-${alumnoId}`);
    const noLectivosInput = formulario.getInput(`no-lectivos-${alumnoId}`);
    const horasDePracticasInput = formulario.getInput(`horas-de-practicas-${alumnoId}`);
    const fechaFinInput = formulario.getInput(`fecha-fin-${alumnoId}`);
    if (!fechaInicioInput || !horasSemanalesInput || !noLectivosInput || !horasDePracticasInput || !fechaFinInput) {
        console.error(`Inputs necesarios no encontrados en el formulario fct-form-${alumnoId}.`);
        return;
    }

    fechaInicioInput.input.addEventListener('input', () => {
        compute(fechaInicioInput, horasSemanalesInput, noLectivosInput, horasDePracticasInput, fechaFinInput);
    });
    fechaInicioInput.validate = () => {
        if (fechaFinInput.isEmpty()) return true;
        const fecha = new Date(fechaFinInput.getValue());
        return !(fecha.getDay() === 0 || fecha.getDay() === 6);
    }

    horasSemanalesInput.input.addEventListener('input', () => {
        compute(fechaInicioInput, horasSemanalesInput, noLectivosInput, horasDePracticasInput, fechaFinInput);
    });

    noLectivosInput.input.addEventListener('input', () => {
        compute(fechaInicioInput, horasSemanalesInput, noLectivosInput, horasDePracticasInput, fechaFinInput);
    });

    horasDePracticasInput.input.addEventListener('input', () => {
        compute(fechaInicioInput, horasSemanalesInput, noLectivosInput, horasDePracticasInput, fechaFinInput);
    });
}

function compute(fechaInicio, horasSemanales, noLectivos, horasDePracticas, fechaFin) {
    const fechaInicioValue = fechaInicio.getValue();
    if (!fechaInicioValue) return;
    if (!fechaInicio.validate()) {
        fechaFin.validate = () => false;
        fechaFin.setValue('');
        fechaFin.showValidity();
        fechaInicio.showValidity();
        return;
    }

    const horasSemanalesValue = horasSemanales.getValue();
    const noLectivosValue = noLectivos.getValue();
    const horasDePracticasValue = horasDePracticas.getValue();

    let days = Math.ceil(horasDePracticasValue / parseInt(horasSemanalesValue) * 5); // Días
    days += parseInt(noLectivosValue); // Días extra por no lectivos

    const date = new Date(fechaInicioValue); // Convierte la fecha a un objeto Date
    let count = 0; // Crea una variable para llevar el registro

    while(count < days - 1) {
        const dayOfTheWeek = date.getDay();

        // Si es un día laborable (lunes a viernes)
        if (dayOfTheWeek > 0 && dayOfTheWeek < 6) {
            count++;
        }

        date.setDate(date.getDate() + 1);
    }

    // Para que el día de fin de FCT no sea sábado o domingo
    while (date.getDay() === 0 || date.getDay() === 6) {
        date.setDate(date.getDate() + 1);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses empiezan en 0
    const day = String(date.getDate()).padStart(2, '0'); // Días con dos dígitos
    const fechaFinal = `${year}-${month}-${day}`;

    fechaFin.validate = () => {
        if (fechaFin.isEmpty()) return true;
        const fechaFinValue = fechaFin.getValue();
        return fechaFinValue === fechaFinal;
    }
    fechaFin.setValue(fechaFinal);
    fechaFin.showValidity();
}

function searchEmpresa(alumnoId, empresas) {
    const formulario = Form.getForm(`fct-form-${alumnoId}`);
    if (!formulario) {
        console.error(`Formulario con ID fct-form-${alumnoId} no encontrado.`);
        return;
    }
    const empresasSelect = formulario.getInput(`empresa-${alumnoId}`);
    if (!empresasSelect) {
        console.error(`Input de empresa con ID empresa-${alumnoId} no encontrado.`);
        return;
    }

    empresasSelect.input.addEventListener('input', () => {
        let query = empresasSelect.input.value;
        query = (query || '').toLowerCase().trim();
        console.log(query);
        let options = [];

        empresas.forEach(empresa => {
            const [ nombre, cif, email, plazas, nombreCiclo ] = [empresa.nombreEmpresa, empresa.cif, empresa.email, empresa.plazas, empresa.nombreCiclo];
            const values = [
                (nombre || '').toLowerCase(),
                (cif || '').toLowerCase(),
                (email || '').toLowerCase(),
                (plazas || '').toString().toLowerCase(),
                (nombreCiclo || '').toLowerCase()
            ];

            const match = values.some(val => val.includes(query));
            console.log(match, values);
            console.log(options);
            if (match) {
                options.push({
                    value: empresa.empresaId,
                    label: `${nombre} (${cif}) - ${email}${plazas ? ` - ${plazas} plazas` : ''}${nombreCiclo ? ` - ${nombreCiclo}` : ''}`
                });
            }
        });
        empresasSelect.updateDropdown(options, true);
    });
}

function searchTutorEmpresa(alumnoId, tutoresEmpresas) {
    const formulario = Form.getForm(`fct-form-${alumnoId}`);
    if (!formulario) {
        console.error(`Formulario con ID fct-form-${alumnoId} no encontrado.`);
        return;
    }
    const empresasSelect = formulario.getInput(`empresa-${alumnoId}`);
    if (!empresasSelect) {
        console.error(`Input de empresa con ID empresa-${alumnoId} no encontrado.`);
        return;
    }

    const tutoresSelect = formulario.getInput(`tutor-empresa-${alumnoId}`);
    if (!tutoresSelect) {
        console.error(`Input de tutor de empresa con ID tutor-empresa-${alumnoId} no encontrado.`);
        return;
    }

    tutoresEmpresas = tutoresEmpresas.filter((tutorEmpresa) => tutorEmpresa.empresaId === empresasSelect.getValue());

    tutoresSelect.input.addEventListener('input', () => {
        let query = tutoresSelect.input.value;
        query = (query || '').toLowerCase().trim();
        console.log(query);
        let options = [];

        tutoresEmpresas.forEach(tutor => {
            const [ nombre, email ] = [tutor.nombre, tutor.email];
            const values = [
                (nombre || '').toLowerCase(),
                (email || '').toLowerCase()
            ];

            const match = values.some(val => val.includes(query));
            console.log(match, values);
            console.log(options);
            if (match) {
                options.push({
                    value: tutor.id,
                    label: `${nombre} - ${email}`
                });
            }
        });
        tutoresSelect.updateDropdown(options, true);
    });
}
