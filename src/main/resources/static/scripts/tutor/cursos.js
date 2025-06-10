import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from '../functions.js';

const SECTION = 'curso-actual';

const RATING = {
    VERDE: 'Verde',
    AMARILLO: 'Amarillo',
    ROJO: 'Rojo'
};

window.addEventListener('FormsCreated', (event) => {
    promise();
    const form = Form.getForm('alumno-form');
    form.getInput('nia').validate = function () {
        if (this.input.value.trim().length === 0) return true;
        let nia = this.input.value.trim().toUpperCase();
        return /^\d{1,8}$/.test(nia);
    }
    form.getInput('nia').getValue = function () {
        let nia = this.input.value.trim().toUpperCase();
        return nia.length === 0 ? null : nia;
    }
    form.getInput('nuss').validate = function () {
        if (this.input.value.trim().length === 0) return true;
        let nuss = this.input.value.trim().toUpperCase();
        return /^\d{11}$/.test(nuss);
    }
    form.getInput('nuss').getValue = function () {
        let nuss = this.input.value.trim().toUpperCase();
        return nuss.length === 0 ? null : nuss;
    }
});

function promise() {
    Promise.all([
        fetchAlumnos(),
        fetchCursoActual(),
        fetchGrupoTutor(),
        fetchAlumnosCurso(),
        fetchEmpresas()
    ])
    .then(([
        alumnos,
        cursoActual,
        grupoTutor,
        alumnosCurso,
        empresas
    ]) => {
        build(alumnos, cursoActual, grupoTutor, alumnosCurso, empresas);
    }).catch((error) => {
        console.error('Error al obtener los ciclos lectivos:', error);
    });
}

async function fetchAlumnos() {
    const response = await fetch('/api/vista-all-alumnos/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los alumnos');
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

async function fetchGrupoTutor() {
    const response = await fetch('/api/vista-grupos-ciclos/tutor');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los grupos');
    return await response.json();
}

async function fetchEmpresas() {
    const response = await fetch('/api/empresa/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los grupos');
    return await response.json();
}

function build(alumnos, cursoActual, grupoTutor, alumnosCurso, empresas) {
    console.log('Alumnos:', alumnos);
    console.log('Ciclo lectivo actual:', cursoActual);
    console.log('Grupo tutor:', grupoTutor);
    console.log('Alumnos del curso:', alumnosCurso);
    console.log('Empresas:', empresas);

    const form = Form.getForm('alumno-form');
    crearLista(alumnosCurso, grupoTutor, form, empresas);

    const asignar = Form.getForm('alumno-search-form');
    const searchInput = asignar.getInput('search');
    if (searchInput) {
        searchInput.input.addEventListener('input', () => {
            let query = searchInput.input.value;
            query = (query || '').toLowerCase().trim();
            console.log(query);
            let options = [];
            
            alumnos.forEach(alumno => {
                const [ name, email, nia, dni ] = [alumno.nombreAlumno, alumno.email, alumno.nia, alumno.dni];
                const values = [
                    (name || '').toLowerCase(),
                    (email || '').toLowerCase(),
                    (nia || '').toLowerCase(),
                    (dni || '').toLowerCase()
                ];
                const match = values.some(val => val.includes(query));
                console.log(match, values);
                console.log(options);
                if (match) {
                    options.push({
                        value: alumno.alumnoId,
                        label: `${name} (${nia}) - ${email} - ${dni}`
                    });
                }
            });
            searchInput.updateDropdown(options, true);
        });
    }

    asignar.onsubmit = () => {
        const alumnoId = asignar.getInput('search').getValue();
        if (!alumnoId) {
            asignar.showError('Selecciona un alumno para asignar al grupo');
            return;
        }

        fetch(`/api/cursos/alumno`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idAlumno: alumnoId,
                idGrupo: grupoTutor.grupoId,
                idCicloLectivo: cursoActual.id
            })
        })
        .then(response => {
            if (response.ok) {
                promise();
                asignar.reset();
                asignar.submitFinish();
            } else if (response.status === 400) {
                asignar.showError('El alumno ya está asignado a un grupo');
            } else {
                asignar.showError('Error al asignar el alumno al grupo');
            }
        })
        .catch(error => {
            asignar.showError('Error al enviar los datos: ' + error.message);
        })
        .finally(() => {
            asignar.submitFinish();
        })
    };

    const displaySection = document.getElementById(SECTION);
    while( displaySection.firstChild) displaySection.removeChild(displaySection.firstChild);

    if (grupoTutor.length === 0) {
        displaySection.classList.add('empty');
        displaySection.textContent = 'No tienes ningún grupo asignado como tutor';
        return;
    }

    const cicloInfo = document.createElement('p');
    cicloInfo.classList.add('ciclo-info');
    cicloInfo.textContent = `${cursoActual.nombre} - ${grupoTutor.grupoNombre}`;
    displaySection.appendChild(cicloInfo);
}

function crearLista(alumnosCurso, grupoTutor, form, empresas) {
    const listar = document.getElementById('listar');
    while(listar && listar.firstChild) listar.removeChild(listar.firstChild);

    alumnosCurso = alumnosCurso.filter(alumno => alumno.grupoId === grupoTutor.grupoId)
                                .sort((a, b) => a.nombreAlumno.localeCompare(b.nombreAlumno));

    if (alumnosCurso.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.textContent = 'No hay alumnos en este curso';
        listar.appendChild(mensaje);
        return;
    }

    alumnosCurso.forEach(alumno => {
        const item = document.createElement('div');
        item.classList.add('cell-value', 'alumno-item');
        listar.appendChild(item);

        const titleSpan = document.createElement('span');
        titleSpan.classList.add('cell-value', 'cell-title');
        titleSpan.textContent = alumno.nombreAlumno;
        item.appendChild(titleSpan);

        const niaSpan = document.createElement('span');
        niaSpan.classList.add('cell-value', 'cell-subtitle');
        niaSpan.textContent = `NIA: ${alumno.nia}`;
        item.appendChild(niaSpan);

        const dniSpan = document.createElement('span');
        dniSpan.classList.add('cell-value', 'cell-subtitle');
        dniSpan.textContent = `DNI: ${alumno.dni}`;
        item.appendChild(dniSpan);

        const emailSpan = document.createElement('span');
        emailSpan.classList.add('cell-value', 'cell-subtitle');
        emailSpan.textContent = `Email: ${alumno.email}`;
        item.appendChild(emailSpan);

        const empresasPosibles = document.createElement('div');
        empresasPosibles.classList.add('cell-value', 'empresas-posibles');
        item.appendChild(empresasPosibles);

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
                const found = empresas.find(e => e.id == empresaId);
                console.log(found);

                empresaSpan.textContent = found?.nombre || empresaId;
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

        item.appendChild(
            createClickableSVG(
                '0 -0.5 25 25',
                'M 20.848 1.879 C 19.676 0.707 17.777 0.707 16.605 1.879 L 2.447 16.036 C 2.029 16.455 1.743 16.988 1.627 17.569 L 1.04 20.505 C 0.76 21.904 1.994 23.138 3.393 22.858 L 6.329 22.271 C 6.909 22.155 7.443 21.869 7.862 21.451 L 22.019 7.293 C 23.191 6.121 23.191 4.222 22.019 3.05 L 20.848 1.879 Z M 18.019 3.293 C 18.41 2.902 19.043 2.902 19.433 3.293 L 20.605 4.465 C 20.996 4.855 20.996 5.488 20.605 5.879 L 6.447 20.036 C 6.308 20.176 6.13 20.271 5.936 20.31 L 3.001 20.897 L 3.588 17.962 C 3.627 17.768 3.722 17.59 3.862 17.451 L 13.933 7.379 L 16.52 9.965 L 17.934 8.56 L 15.348 5.965 L 18.019 3.293 Z',
                () => setInputsToUpdate(form, alumno),
                'edit-svg',
                'svg'
            )
        );
        item.appendChild(
            createClickableSVG(
                '-6 -6 60 60',
                'M 42 3 H 28 A 2 2 0 0 0 26 1 H 22 A 2 2 0 0 0 20 3 H 6 A 2 2 0 0 0 6 7 H 42 A 2 2 0 0 0 42 3 Z M 37 11 V 43 H 31 V 19 A 1 1 0 0 0 27 19 V 43 H 21 V 19 A 1 1 0 0 0 17 19 V 43 H 11 V 11 A 2 2 0 0 0 7 11 V 45 A 2 2 0 0 0 9 47 H 39 A 2 2 0 0 0 41 45 V 11 A 2 2 0 0 0 37 11 Z',
                (event) => {
                    event.preventDefault();
                    removeAlumnoFromGrupo(form, alumno.alumnoId, grupoTutor.grupoId);
                },
                'delete-svg',
                'svg'
            )
        );
        item.appendChild(
            createClickableSVG(
                '0 0 24 24',
                'M 12.75 14 C 12.75 13.5858 12.4142 13.25 12 13.25 C 11.5858 13.25 11.25 13.5858 11.25 14 V 18 C 11.25 18.4142 11.5858 18.75 12 18.75 C 12.4142 18.75 12.75 18.4142 12.75 18 V 14 Z M 12 2.75 C 9.1005 2.75 6.75 5.1005 6.75 8 V 9.2534 C 7.1235 9.25 7.5215 9.25 7.945 9.25 H 16.0549 C 17.4225 9.25 18.5248 9.25 19.3918 9.3665 C 20.2919 9.4875 21.0497 9.7464 21.6517 10.3483 C 22.2536 10.9503 22.5125 11.7081 22.6335 12.6082 C 22.75 13.4752 22.75 14.5775 22.75 15.9451 V 16.0549 C 22.75 17.4225 22.75 18.5248 22.6335 19.3918 C 22.5125 20.2919 22.2536 21.0497 21.6517 21.6516 C 21.0497 22.2536 20.2919 22.5125 19.3918 22.6335 C 18.5248 22.75 17.4225 22.75 16.0549 22.75 H 7.9451 C 6.5775 22.75 5.4752 22.75 4.6082 22.6335 C 3.7081 22.5125 2.9503 22.2536 2.3483 21.6516 C 1.7464 21.0497 1.4875 20.2919 1.3665 19.3918 C 1.25 18.5248 1.25 17.4225 1.25 16.0549 V 15.9451 C 1.25 14.5775 1.25 13.4752 1.3665 12.6082 C 1.4875 11.7081 1.7464 10.9503 2.3483 10.3483 C 2.9503 9.7464 3.7081 9.4875 4.6082 9.3665 C 4.8094 9.3395 5.0232 9.3187 5.25 9.3028 V 8 C 5.25 4.2721 8.2721 1.25 12 1.25 C 15.1463 1.25 17.788 3.4019 18.5373 6.3131 C 18.6405 6.7142 18.3991 7.1231 17.9979 7.2263 C 17.5968 7.3296 17.1879 7.0881 17.0846 6.6869 C 16.5018 4.4224 14.4453 2.75 12 2.75 Z M 4.8081 10.8531 C 4.0743 10.9518 3.6858 11.1322 3.409 11.409 C 3.1322 11.6858 2.9518 12.0743 2.8531 12.8081 C 2.7516 13.5635 2.75 14.5646 2.75 16 C 2.75 17.4354 2.7516 18.4365 2.8531 19.1919 C 2.9518 19.9257 3.1322 20.3142 3.409 20.591 C 3.6858 20.8678 4.0743 21.0482 4.8081 21.1469 C 5.5635 21.2484 6.5646 21.25 8 21.25 H 16 C 17.4354 21.25 18.4365 21.2484 19.1919 21.1469 C 19.9257 21.0482 20.3142 20.8678 20.591 20.591 C 20.8678 20.3142 21.0482 19.9257 21.1469 19.1919 C 21.2484 18.4365 21.25 17.4354 21.25 16 C 21.25 14.5646 21.2484 13.5635 21.1469 12.8081 C 21.0482 12.0743 20.8678 11.6858 20.591 11.409 C 20.3142 11.1322 19.9257 10.9518 19.1919 10.8531 C 18.4365 10.7516 17.4354 10.75 16 10.75 H 8 C 6.5646 10.75 5.5635 10.7516 4.8081 10.8531 Z',
                (event) => {
                    event.preventDefault();
                    resetPassword(form, alumno.alumnoId);
                },
                'password-reset-svg',
                'svg'
            )
        );
    });
}

function quitarEmpresa(alumno, empresaId) {
    alumno.posiblesEmpresas = alumno.posiblesEmpresas
        .split(';')
        .filter(id => id !== empresaId)
        .join(';');
    console.log(alumno.posiblesEmpresas);
    
    fetch(`/api/cursos/posibles-empresas/${alumno.cursoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: alumno.posiblesEmpresas
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
            search.reset();
            search.submitFinish();
            parent.classList.remove('active');
            parent.style.left = '0';
            parent.style.top = '0';
        }
    });

    const empresasSelect = search.getInput('buscar-empresa');
    empresasSelect.input.addEventListener('input', () => {
        let query = empresasSelect.input.value;
        query = (query || '').toLowerCase().trim();
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
            if (match) {
                options.push({
                    value: empresa.id,
                    label: `${nombre} (${cif}) - ${email}${plazas ? ` - ${plazas} plazas` : ''}${nombreCiclo ? ` - ${nombreCiclo}` : ''}`
                });
            }
        });
        empresasSelect.updateDropdown(options, true);
    });

    search.onsubmit = () => {
        console.log('Pre', alumno.posiblesEmpresas);
        alumno.posiblesEmpresas = alumno.posiblesEmpresas.split(';');
        console.log('Post', alumno.posiblesEmpresas);
        alumno.posiblesEmpresas.push(empresasSelect.getValue());
        console.log('Push', alumno.posiblesEmpresas);
        alumno.posiblesEmpresas = alumno.posiblesEmpresas.join(';');
        console.log('Empresas posibles:', alumno.posiblesEmpresas);

        fetch(`/api/cursos/posibles-empresas/${alumno.cursoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: alumno.posiblesEmpresas
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

function setInputsToUpdate(form, alumno) {
    document.getElementById('titulo').textContent = `Información del alumno`;

    form.onsubmit = () => {
        const nombre = form.getInput('nombre').getValue();
        const email = form.getInput('email').getValue();
        const phone = form.getInput('phone').getValue();
        const nia = form.getInput('nia').getValue();
        const dni = form.getInput('dni').getValue();
        const nuss = form.getInput('nuss').getValue();
        const address = form.getInput('address').getValue();
        const convocatoria = form.getInput('convocatoria').getValue();
        const rating = form.getInput('rating').getValue();
        const observaciones = form.getInput('observaciones').getValue();

        let changeAlumno = {
            name: nombre,
            email: email,
            phone: phone,
            nia: nia,
            dni: dni,
            nuss: nuss,
            address: address,
            convocatoria: convocatoria,
            rating: rating,
            observaciones: observaciones
        };

        console.log(alumno.cursoId);

        fetch(`/api/cursos/update/${alumno.cursoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(changeAlumno)
        })
        .then(response => {
            if (response.ok) {
                form.showSuccess('Alumno actualizado correctamente');
                form.submitFinish();
                form.reset();
                promise();
            } else {
                form.showError('Error al actualizar el alumno');
                form.submitFinish();
            }
        })
        .catch(error => {
            form.showError('Error al enviar los datos: ' + error.message);
            form.submitFinish();
        });
    };

    form.getInput('nombre').retrack(alumno.nombreAlumno);
    form.getInput('email').retrack(alumno.email);
    form.getInput('phone').retrack(alumno.phone);
    form.getInput('nia').retrack(alumno.nia);
    form.getInput('dni').retrack(alumno.dni);
    form.getInput('nuss').retrack(alumno.nuss);
    form.getInput('address').retrack(alumno.address);
    form.getInput('convocatoria').retrack(alumno.convocatoria);
    form.getInput('rating').retrack(RATING[alumno.rating]);
    form.getInput('observaciones').retrack(alumno.observaciones || '');

    form.form.querySelector('#submit').textContent = 'Actualizar alumno';
}

function removeAlumnoFromGrupo(form, alumnoId, grupoId) {
    if (confirm('¿Estás seguro de que quieres eliminar a este alumno del grupo?')) {
        fetch(`/api/cursos/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idAlumno: alumnoId,
                idGrupo: grupoId
            })
        })
        .then(response => {
            if (response.ok) {
                promise();
            } else {
                form.showError('Error al eliminar el alumno');
            }
        })
        .catch(error => {
            form.showError('Error al eliminar el alumno: ' + error.message);
        });
    }
}

function resetPassword(form, id) {
    if (confirm('¿Estás seguro de que quieres restablecer la contraseña de este alumno?')) {
        fetch(`/api/tutores/resetPassword/${id}`, {
            method: 'PUT'
        })
        .then(response => {
            if (response.ok) {
                alert('La contraseña ha sido cambiada a su NIA.');
                form.showSuccess('Contraseña restablecida correctamente');
                form.submitFinish();
                promise();
            } else {
                form.showError('Error al restablecer la contraseña del alumno');
            }
        })
        .catch(error => {
            form.showError('Error al restablecer la contraseña del alumno: ' + error.message);
        })
    }
}
