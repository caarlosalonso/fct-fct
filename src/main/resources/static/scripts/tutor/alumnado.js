import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from '../functions.js';

const SECTION = 'curso-actual';

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
        fetchAlumnosCurso()
    ])
    .then(([
        alumnos,
        cursoActual,
        grupoTutor,
        alumnosCurso
    ]) => {
        build(alumnos, cursoActual, grupoTutor, alumnosCurso);
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

function build(alumnos, cursoActual, grupoTutor, alumnosCurso) {
    console.log('Alumnos:', alumnos);
    console.log('Ciclo lectivo actual:', cursoActual);
    console.log('Grupo tutor:', grupoTutor);
    console.log('Alumnos del curso:', alumnosCurso);
    
    const form = Form.getForm('alumno-form');
    crearLista(alumnosCurso, grupoTutor, form);

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
        })
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
                idGrupo: grupoTutor.grupoId
            })
        })
        .then(response => {
            if (response.ok) {
                asignar.submitFinish();
            } else if (response.status === 400) {
                asignar.showError('El alumno ya está asignado a este grupo');
            } else {
                asignar.showError('Error al asignar el alumno al grupo');
            }
        })
        .catch(error => {
            asignar.showError('Error al enviar los datos: ' + error.message);
        });
    };

    const crearAlumno = document.getElementById('create-alumno');
    crearAlumno.addEventListener('click', (event) => {
        event.preventDefault();
        setInputsToCreate(form);
    });

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

function crearLista(alumnosCurso, grupoTutor, form) {
    const listar = document.getElementById('listar');
    while(listar && listar.firstChild) listar.removeChild(listar.firstChild);

    if (alumnosCurso.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.textContent = 'No hay alumnos en este curso';
        listar.appendChild(mensaje);
        return;
    }

    alumnosCurso.forEach(alumno => {
        const item = document.createElement('div');
        item.classList.add('alumno-item');
        listar.appendChild(item);

        const titleSpan = document.createElement('span');
        titleSpan.classList.add('cell-title');
        titleSpan.textContent = alumno.nombreAlumno;
        item.appendChild(titleSpan);

        const niaSpan = document.createElement('span');
        niaSpan.classList.add('cell-subtitle');
        niaSpan.textContent = `NIA: ${alumno.nia}`;
        item.appendChild(niaSpan);

        const dniSpan = document.createElement('span');
        dniSpan.classList.add('cell-subtitle');
        dniSpan.textContent = `DNI: ${alumno.dni}`;
        item.appendChild(dniSpan);

        const emailSpan = document.createElement('span');
        emailSpan.classList.add('cell-subtitle');
        emailSpan.textContent = `Email: ${alumno.email}`;
        item.appendChild(emailSpan);

        item.appendChild(
            createClickableSVG(
                '0 -0.5 25 25',
                'M 20.848 1.879 C 19.676 0.707 17.777 0.707 16.605 1.879 L 2.447 16.036 C 2.029 16.455 1.743 16.988 1.627 17.569 L 1.04 20.505 C 0.76 21.904 1.994 23.138 3.393 22.858 L 6.329 22.271 C 6.909 22.155 7.443 21.869 7.862 21.451 L 22.019 7.293 C 23.191 6.121 23.191 4.222 22.019 3.05 L 20.848 1.879 Z M 18.019 3.293 C 18.41 2.902 19.043 2.902 19.433 3.293 L 20.605 4.465 C 20.996 4.855 20.996 5.488 20.605 5.879 L 6.447 20.036 C 6.308 20.176 6.13 20.271 5.936 20.31 L 3.001 20.897 L 3.588 17.962 C 3.627 17.768 3.722 17.59 3.862 17.451 L 13.933 7.379 L 16.52 9.965 L 17.934 8.56 L 15.348 5.965 L 18.019 3.293 Z',
                () => setInputsToUpdate(form, alumno),
                'edit-svg'
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
                'delete-svg'
            )
        );
    });
}

function setInputsToCreate(form) {
    let isCancelled = form.cancel();
    if (! isCancelled) return;

    document.getElementById('titulo').textContent = 'Creación de un nuevo alumno';

    form.onsubmit = function (event) {
        const nombre = form.getInput('nombre').getValue();
        const email = form.getInput('email').getValue();
        const phone = form.getInput('phone').getValue();
        const nia = form.getInput('nia').getValue();
        const dni = form.getInput('dni').getValue();
        const nuss = form.getInput('nuss').getValue();
        const address = form.getInput('address').getValue();
        const convocatoria = form.getInput('convocatoria').getValue();

        let newAlumno = {
            nombreAlumno: nombre,
            email: email,
            dni: dni,
            nia: nia,
            nuss: nuss,
            phone: phone,
            address: address,
            convocatoria: convocatoria
        };

        fetch('/api/alumnos/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAlumno)
        })
        .then(response => {
            if (response.status === 201) {
                promise();
                form.reset();
                form.submitFinish();
                form.showSuccess('Alumno creado correctamente');
            } else {
                form.showError('Error al crear el alumno');
            }
        })
        .catch(error => {
            form.showError('Error al enviar los datos: ' + error.message);
        });
    };

    form.getInput('nombre').retrack('');
    form.getInput('email').retrack('');
    form.getInput('phone').retrack('');
    form.getInput('nia').retrack('');
    form.getInput('dni').retrack('');
    form.getInput('nuss').retrack('');
    form.getInput('address').retrack('');
    form.getInput('convocatoria').retrack('');

    const submitButton = document.getElementById('submit');
    submitButton.textContent = 'Crear alumno';
}

function setInputsToUpdate(form, alumno) {
    document.getElementById('titulo').textContent = `Información del alumno`;

    form.onsubmit = function (event) {
        const nombre = form.getInput('nombre').getValue();
        const email = form.getInput('email').getValue();
        const phone = form.getInput('phone').getValue();
        const nia = form.getInput('nia').getValue();
        const dni = form.getInput('dni').getValue();
        const nuss = form.getInput('nuss').getValue();
        const address = form.getInput('address').getValue();
        const convocatoria = form.getInput('convocatoria').getValue();

        let newAlumno = {
            name: nombre,
            email: email,
            phone: phone,
            nia: nia,
            dni: dni,
            nuss: nuss,
            address: address,
            convocatoria: convocatoria
        };

        fetch(`/api/alumnos/${alumno.alumnoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAlumno)
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

    const submitButton = document.getElementById('submit');
    submitButton.textContent = 'Actualizar alumno';
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

function addResetPasswordButton(form, id) {
    deleteResetPasswordButton();

    const resetButton = document.createElement('button');
    resetButton.id = 'reset-password';
    resetButton.classList.add('form-buttons');
    resetButton.textContent = 'Restablecer contraseña';
    document.getElementById('buttons-wrapper').appendChild(resetButton);

    resetButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (confirm('¿Estás seguro de que quieres restablecer la contraseña de este alumno?')) {
            fetch(`/alumnos/${id}/reset-password`, {
                method: 'POST'
            })
            .then(response => {
                if (response.ok) {
                    deleteFinish(resetButton);

                    const alumnoElement = document.getElementById(`alumno-${id}`);
                    if (alumnoElement) {
                        alumnoElement.remove();
                    }
                } else {
                    form.showError('Error al restablecer la contraseña del alumno');
                }
            })
            .catch(error => {
                form.showError('Error al restablecer la contraseña del alumno: ' + error.message);
            })
            .finally(() => {
                deleteFinish(resetButton);
            });
        } else {
            deleteFinish(resetButton);
        }
    });
}

function deleteForgotPasswordButton() {
    const forgotPasswordButtonDiv = document.getElementById('forgot-password-div');
    if (forgotPasswordButtonDiv) document.getElementById('buttons-wrapper').removeChild(forgotPasswordButtonDiv);
}
