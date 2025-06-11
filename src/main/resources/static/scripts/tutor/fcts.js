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
    const response = await fetch('/api/fcts/all');
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

    document.getElementById('modal').innerHTML = `
        <form id="agregar-empresa-form" method="POST" submit-text="Agregar Empresa" form-legend="false">
            <div class="form-group form-input">
                <input type="select" id="buscar-empresa" name="nombre-empresa" class="text-based input" label="Empresa" data-required="true">
            </div>
        </form>
    `;

    let counts = {
        verdes: 0,
        amarillos: 0,
        rojos: 0
    };
    alumnosCurso.forEach((alumno) => {
        const cell = createCell(alumno, fcts, grupoTutor, empresas);
        if (alumno.rating === 'VERDE') {
            verdes.appendChild(cell);
            counts.verdes++;
        } else if (alumno.rating === 'AMARILLO') {
            amarillos.appendChild(cell);
            counts.amarillos++;
        } else if (alumno.rating === 'ROJO') {
            rojos.appendChild(cell);
            counts.rojos++;
        }
    });

    document.getElementById('green-title').textContent = `Alumnos que seguramente promocionen (${counts.verdes})`;
    document.getElementById('yellow-title').textContent = `Alumnos que puede que promocionen (${counts.amarillos})`;
    document.getElementById('red-title').textContent = `Alumnos que están en riesgo (${counts.rojos})`;

    if (counts.verdes === 0) {
        const message = document.createElement('p');
        message.textContent = 'No hay alumnos que seguramente promocionen.';
        verdes.appendChild(message);
    }
    if (counts.amarillos === 0) {
        const message = document.createElement('p');
        message.textContent = 'No hay alumnos que puede que promocionen.';
        amarillos.appendChild(message);
    }
    if (counts.rojos === 0) {
        const message = document.createElement('p');
        message.textContent = 'No hay alumnos que están en riesgo. Yay!';
        rojos.appendChild(message);
    }

    document.querySelectorAll('form').forEach(form => new Form(form).init());

    alumnosCurso.forEach((alumno) => {
        computeFinFCT(alumno.alumnoId);
        searchEmpresa(alumno.alumnoId, empresas);
        searchTutorEmpresa(alumno.alumnoId, tutoresEmpresas);
        onsubmit(alumno.alumnoId, alumno.cursoId);
    });
}

function createCell(alumno, fcts, grupoTutor, empresas) {
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

    const fct = fcts.filter(fct => fct.alumnoId === alumno.alumnoId)
                    .filter(fct => fct.cicloId === grupoTutor.cicloId);

    const horasRestantesSpan = document.createElement('span');
    horasRestantesSpan.classList.add('alumno-horas-restantes');
    horasRestantesSpan.textContent = `Horas restantes: ${fct.length > 0 ? grupoTutor.horasPracticas - fct[0].horasPracticas : grupoTutor.horasPracticas}`;
    bar.appendChild(horasRestantesSpan);

    const collapseSpan = document.createElement('span');
    collapseSpan.classList.add('alumno-collapse', 'collapsed');
    collapseSpan.textContent = `◀`;
    bar.appendChild(collapseSpan);
    bar.onclick = () => {
        if (cell.classList.contains('collapsed')) {
            cell.classList.remove('collapsed');
            cell.classList.add('expanded');
            collapseSpan.textContent = `▼`;
        } else {
            cell.classList.remove('expanded');
            cell.classList.add('collapsed');
            collapseSpan.textContent = `◀`;
        }
    };

    const empresasPosibles = document.createElement('div');
    empresasPosibles.classList.add('cell-value', 'empresas-posibles');
    cell.appendChild(empresasPosibles);

    empresasPosibles.appendChild(
        createClickableSVG(
            '0 0 48 48',
            'M 44 20 L 28 20 L 28 4 C 28 2 26 0 24 0 S 20 2 20 4 L 20 20 L 4 20 C 2 20 0 22 0 24 S 2 28 4 28 L 20 28 L 20 44 C 20 46 22 48 24 48 S 28 46 28 44 L 28 28 L 44 28 C 46 28 48 26 48 24 S 46 20 44 20 Z',
            () => agregarEmpresaPosible(alumno, empresas, empresasPosibles),
            'add-empresa-svg'
        )
    );

    if (alumno.posiblesEmpresas.length > 0) {
        alumno.posiblesEmpresas.split(';').forEach((empresaId) => {
            const empresaSpan = document.createElement('span');
            empresaSpan.classList.add('empresa-posible');
            const found = empresas.find(e => e.empresaId == empresaId);
            empresaSpan.textContent = found?.nombreEmpresa || empresaId;
            empresasPosibles.appendChild(empresaSpan);
            empresaSpan.appendChild(
                createClickableSVG(
                    '0 0 48 48',
                    'M 40.9706 35.3137 L 29.6569 24 L 40.9706 12.6863 C 42.3848 11.2721 42.3848 8.4437 40.9706 7.0294 S 36.7279 5.6152 35.3137 7.0294 L 24 18.3431 L 12.6863 7.0294 C 11.2721 5.6152 8.4437 5.6152 7.0294 7.0294 S 5.6152 11.2721 7.0294 12.6863 L 18.3431 24 L 7.0294 35.3137 C 5.6152 36.7279 5.6152 39.5563 7.0294 40.9706 S 11.2721 42.3848 12.6863 40.9706 L 24 29.6569 L 35.3137 40.9706 C 36.7279 42.3848 39.5563 42.3848 40.9706 40.9706 S 42.3848 36.7279 40.9706 35.3137 Z',
                    () => quitarEmpresa(alumno, empresaId),
                    'remove-empresa-svg'
                )
            );
        });
    }

    const fctDiv = document.createElement('div');
    fctDiv.innerHTML = `
    <form id="fct-form-${alumno.alumnoId}" method="POST" submit-text="Guardar FCT">
        <div class="inputs form-container">
            <div class="instance form-input grouped-inputs">
                <div class="form-group form-input">
                    <input id="checkbox-${alumno.alumnoId}" type="toggle-switch" name="renuncia" class="input" label="¿Renuncia a prácticas?">
                </div>
            </div>
            <div id="checkbox-${alumno.alumnoId}-false">
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
                        <input id="horas-de-practicas-${alumno.alumnoId}" type="range" name="horasDePracticas" class="text-based input" label="{n} Hora{s} de prácticas" data-required="true" data-min="100" data-max="${grupoTutor.horasPracticas}" data-step="1" data-value="${grupoTutor.horasPracticas < 370 ? grupoTutor.horasPracticas : 370}">
                    </div>
                </div>
                <div class="instance form-input grouped-inputs">
                    <div class="form-group form-input">
                        <input id="fecha-fin-${alumno.alumnoId}" type="date" name="fechaFin" class="text-based input" label="Fin de FCT" data-show-validity="true" data-required="true">
                    </div>
                </div>
            </div>
            <div id="checkbox-${alumno.alumnoId}-true">
                <div class="instance form-input grouped-inputs">
                    <div class="form-group form-input">
                        <input id="motivo-renuncia-${alumno.alumnoId}" type="text" name="motivoRenuncia" class="text-based input" label="Motivo renuncia" data-required="true">
                    </div>
                </div>
            </div>
        </div>
    </form>
    `;
    cell.appendChild(fctDiv);

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
        if (dayOfTheWeek > 0 && dayOfTheWeek < 6) count++; // Si es un día laborable (lunes a viernes)
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
        let options = [];

        empresas.filter((empresa) => empresa.estado !== "DENEGADO")
            .forEach(empresa => {
            const [ nombre, cif, email, plazas, sector ] = [empresa.nombreEmpresa, empresa.cif, empresa.email, empresa.plazas, empresa.sector];
            const values = [
                (nombre || '').toLowerCase(),
                (cif || '').toLowerCase(),
                (email || '').toLowerCase(),
                (plazas || '').toString().toLowerCase(),
                (sector || '').toLowerCase()
            ];

            const match = values.some(val => val.includes(query));
            if (match) {
                options.push({
                    value: empresa.empresaId,
                    label: `${nombre} (${cif ? cif : 'Sin CIF'}) - ${email}${plazas ? ` - ${plazas} plazas` : ''}${sector ? ` - ${sector}` : ''}`
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
        let options = [];

        tutoresEmpresas.forEach(tutor => {
            const [ nombre, email ] = [tutor.nombre, tutor.email];
            const values = [
                (nombre || '').toLowerCase(),
                (email || '').toLowerCase()
            ];

            const match = values.some(val => val.includes(query));
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

function onsubmit(alumnoId, cursoId) {
    const formulario = Form.getForm(`fct-form-${alumnoId}`);
    if (!formulario) {
        console.error(`Formulario con ID fct-form-${alumnoId} no encontrado.`);
        return;
    }

    formulario.onsubmit = () => {
        const empresaInput = formulario.getInput(`empresa-${alumnoId}`);
        const tutorEmpresaInput = formulario.getInput(`tutor-empresa-${alumnoId}`);
        const fechaInicioInput = formulario.getInput(`fecha-inicio-${alumnoId}`);
        const horasSemanalesInput = formulario.getInput(`horas-semanales-${alumnoId}`);
        const noLectivosInput = formulario.getInput(`no-lectivos-${alumnoId}`);
        const horasDePracticasInput = formulario.getInput(`horas-de-practicas-${alumnoId}`);
        const fechaFinInput = formulario.getInput(`fecha-fin-${alumnoId}`);

        const data = {
            cursoId: cursoId,
            empresaId: empresaInput.getValue(),
            tutorEmpresaId: tutorEmpresaInput.getValue(),
            fechaInicio: fechaInicioInput.getValue(),
            horasSemanales: horasSemanalesInput.getValue(),
            noLectivos: noLectivosInput.getValue(),
            horasDePracticas: horasDePracticasInput.getValue(),
            fechaFin: fechaFinInput.getValue()
        };

        console.log('Datos del FCT:', data);

        fetch('/api/fcts/fct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            if (response.ok || response.status === 201) {
                promise();
            } else {
                formulario.showError('Error al crear el FCT. Por favor, revisa los datos introducidos.');
            formulario.submitFinish();
            }
        })
        .catch((error) => {
            formulario.showError('Error al enviar los datos: ' + error.message);
            formulario.submitFinish();
        });
    };
}

function quitarEmpresa(alumno, empresaId) {
    alumno.posiblesEmpresas = alumno.posiblesEmpresas
        .split(';')
        .filter(id => id !== empresaId)
        .join(';');
    
    fetch(`/api/cursos/posibles-empresas/${alumno.cursoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            posiblesEmpresas: alumno.posiblesEmpresas
        })
    })
    .then((response) => {
        if (response.ok) {
            promise();
        } else {
            console.error('Error al quitar la empresa del alumno');
        }
    })
    .catch((error) => {
        console.error('Error al quitar la empresa del alumno:', error);
    });
}

function agregarEmpresaPosible(alumno, empresas, empresasPosibles) {
    const search = Form.getForm('agregar-empresa-form');
    const parent = search.form.parentElement;

    if (empresasPosibles && parent) {
        const rect = empresasPosibles.getBoundingClientRect();
        parent.style.left = `${rect.left + window.scrollX}px`;
        parent.style.top = `${rect.bottom + 30 + window.scrollY}px`;
    }

    parent.classList.add('active');
    parent.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            clearModal(search, parent);
        }
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            clearModal(search, parent);
        }
    });

    const empresasSelect = search.getInput('buscar-empresa');
    empresasSelect.input.addEventListener('input', () => {
        let query = empresasSelect.input.value;
        query = (query || '').toLowerCase().trim();
        let options = [];

        empresas.filter((empresa) => empresa.estado !== "DENEGADO")
            .forEach(empresa => {
            const [ nombre, cif, email ] = [empresa.nombreEmpresa, empresa.cif, empresa.email];
            const values = [
                (nombre || '').toLowerCase(),
                (cif || '').toLowerCase(),
                (email || '').toLowerCase()
            ];

            const match = values.some(val => val.includes(query));
            if (match) {
                options.push({
                    value: empresa.empresaId,
                    label: `${nombre} (${cif ? cif : 'Sin CIF'}) - ${email}`
                });
            }
        });
        empresasSelect.updateDropdown(options, true);
    });

    search.onsubmit = () => {
        let posiblesEmpresas = alumno.posiblesEmpresas.split(';');
        if (posiblesEmpresas.includes('' + empresasSelect.getValue())) {
            clearModal(search, parent);
            return;
        }
        if (alumno.posiblesEmpresas.length === 0) posiblesEmpresas = [];
        posiblesEmpresas.push('' + empresasSelect.getValue());
        posiblesEmpresas = posiblesEmpresas.join(';');

        fetch(`/api/cursos/posibles-empresas/${alumno.cursoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                posiblesEmpresas: posiblesEmpresas
            })
        })
        .then((response) => {
            if (response.ok) {
                search.reset();
                search.submitFinish();
                parent.classList.remove('active');
                parent.style.left = '0';
                parent.style.top = '0';
                promise();
            } else {
                search.submitFinish();
                console.error('Error al agregar la empresa del alumno');
            }
        })
        .catch((error) => {
            search.submitFinish();
            console.error('Error al agregar la empresa del alumno:', error);
        });
    }
}

function clearModal(search, parent) {
    search.reset();
    search.submitFinish();
    parent.classList.remove('active');
    parent.style.left = '0';
    parent.style.top = '0';
}
