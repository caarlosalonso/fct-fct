import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from '../functions.js';

const SECTION = 'curso-actual';

window.addEventListener('DOMContentLoaded', () => {
    promise();
});

window.addEventListener('FormsCreated', (event) => {
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
        fetchCursoActual(),
        fetchGrupoTutor()
    ])
    .then(([
        cursoActual,
        grupoTutor
    ]) => {
        build(cursoActual, grupoTutor);
    }).catch((error) => {
        console.error('Error al obtener los ciclos lectivos:', error);
    })
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

function build(cursoActual, grupoTutor) {
    const displaySection = document.getElementById(SECTION);
    while( displaySection.firstChild) displaySection.removeChild(displaySection.firstChild);

    if (grupoTutor.length === 0) {
        displaySection.classList.add('empty');
        displaySection.textContent = 'No tienes ningún grupo asignado como tutor';
        return;
    }

    console.log('Ciclo lectivo actual:', cursoActual);
    console.log('Grupo tutor:', grupoTutor);
}




































async function fetchCiclosLectivos() {
    const response = await fetch('/api/ciclos-lectivos/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los ciclos lectivos');
    return await response.json();
}

async function fetchGruposCiclos() {
    const response = await fetch('/api/vista-grupos-ciclos/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los grupos');
    return await response.json();
}

async function fetchAlumnos() {
    const response = await fetch('/api/vista-alumnos/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los alumnos');
    return await response.json();
}

const info = [];
let chosenCicloLectivo = null;
let chosenGrupo = null;
let cicloLectivoId = null;
let grupoId = null;
let numero = null;
/*
function build(ciclosLectivos, gruposCiclos, alumnos) {
    ciclosLectivos.forEach((cicloLectivo) => {
        info.push({
            id: cicloLectivo.id,
            createdAt: cicloLectivo.createdAt,
            updatedAt: cicloLectivo.updatedAt,
            nombre: cicloLectivo.nombre,
            fechaInicio: cicloLectivo.fechaInicio,
            grupos: gruposCiclos.filter(grupo => grupo.cicloLectivoId === cicloLectivo.id).map(grupo => {
                return {
                    cicloLectivoId: grupo.cicloLectivoId,
                    grupoId: grupo.grupoId,
                    grupo_nombre: grupo.grupo_nombre,
                    numero: grupo.numero,
                    ciclo_id: grupo.cicloId,
                    alumnos: alumnos.filter(alumno => alumno.grupoCicloId === grupo.id)
                };
            })
        })
    });
    console.log(info);

    createCiclosLectivos();

    const form = Form.getForm('alumno-form');
    setInputsToCreate(form);
    document.getElementById('add').addEventListener('click', () => {
        setInputsToCreate(form);
    });
}
    */

function createCiclosLectivos() {
    const cicloLectivoSelection = document.getElementById('ciclo-lectivo-selection');
    cicloLectivoSelection.innerHTML = '';

    if (info.length === 0) {
        cicloLectivoSelection.classList.add('empty');
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No hay ciclos lectivos disponibles';
        cicloLectivoSelection.appendChild(emptyMessage);
        return;
    }

    const ul = document.createElement('ul');
    ul.classList.add('ciclos-lectivos', 'nav', 'nav-tabs');
    ul.id = 'ciclos-lectivos';
    cicloLectivoSelection.appendChild(ul);

    info.forEach((cicloLectivo) => {
        const li = document.createElement('li');
        li.classList.add('nav-item');
        ul.appendChild(li);

        const cicloLectivoText = document.createElement('p');
        cicloLectivoText.classList.add('cicloLectivo', 'nav-link');
        cicloLectivoText.id = `ciclo-lectivo-${cicloLectivo.id}`;
        cicloLectivoText.textContent = cicloLectivo.nombre;
        li.appendChild(cicloLectivoText);

        li.addEventListener('click', () => {
            if (chosenCicloLectivo) chosenCicloLectivo.classList.remove('active');
            li.classList.add('active');
            chosenCicloLectivo = li;
            cicloLectivoId = cicloLectivo.id;
            createGruposCiclos(cicloLectivo.id);
        });

        if (chosenCicloLectivo === null) {
            li.classList.add('active');
            chosenCicloLectivo = li;
            createGruposCiclos(cicloLectivo.id);
        }
    });
}

function createGruposCiclos(cicloLectivoId) {
    console.log(`Creating grupos ciclos for cicloLectivoId: ${cicloLectivoId}`);
    const gruposCiclosSelection = document.getElementById('grupos-ciclos-selection');
    gruposCiclosSelection.innerHTML = '';

    const ul = document.createElement('ul');
    ul.classList.add('grupos-ciclos', 'nav', 'nav-tabs');
    ul.id = 'grupos-ciclos';
    gruposCiclosSelection.appendChild(ul);

    const cicloLectivo = info.find(ciclo => ciclo.id === cicloLectivoId);
    if (cicloLectivo) {
        cicloLectivo.grupos.forEach((grupo) => {
            const li = document.createElement('li');
            li.classList.add('grupo', 'nav-item');
            ul.appendChild(li);

            const grupoText = document.createElement('p');
            grupoText.classList.add('curso', 'nav-link');
            grupoText.id = `grupo-${grupo.grupoId}`;
            grupoText.textContent = grupo.grupo_nombre;
            li.appendChild(grupoText);

            li.addEventListener('click', () => {
                if (chosenGrupo) chosenGrupo.classList.remove('active');
                li.classList.add('active');
                chosenGrupo = li;
                grupoId = grupo.grupoId;
                numero = grupo.numero;
                createAlumnos(grupo.alumnos);
            });

            if (chosenGrupo === null) {
                li.classList.add('active');
                chosenGrupo = li;
                createAlumnos(grupo.alumnos);
            }
        });
    }
}

function createAlumnos(alumnos) {
    const alumnosSelection = document.getElementById('alumnos-list-scroll');
    alumnosSelection.innerHTML = '';

    if (alumnos.length === 0) {
        document.getElementById('add').classList.add('empty');
        document.getElementById('alumnos-list-container').classList.add('empty');
        return;
    }
    document.getElementById('add').classList.remove('empty');
    document.getElementById('alumnos-list-container').classList.remove('empty');

    alumnos.forEach(alumno => {
        createAlumnoCell(alumno, Form.getForm('alumno-form'));
    });
}

const map = [];

function createAlumnoCell(alumno, form) {
    const alumnosList = document.getElementById('alumnos-list-scroll');
    const alumnoElement = document.createElement('div');
    alumnoElement.classList.add('alumno', 'cell');
    alumnoElement.id = `alumno-${alumno.id}`;
    alumnoElement.textContent = alumno.name;
    alumnosList.appendChild(alumnoElement);

    map.push({
        id: alumno.id,
        element: alumnoElement,
        data: alumno
    });

    alumnoElement.addEventListener('click', (event) => {
        setInputsToUpdate(form, alumno.id);
    });
}

function setInputsToCreate(form) {
    let isCancelled = form.cancel();
    if (! isCancelled) return;

    document.getElementById('titulo').textContent = `Información del alumno de ${chosenGrupo.textContent} de ${chosenCicloLectivo.textContent}`;
    deleteDeleteButton();

    form.onsubmit = function (event) {
        const nombre = form.getInput('nombre').getValue();
        const email = form.getInput('email').getValue();
        const phone = form.getInput('phone').getValue();
        const nia = form.getInput('nia').getValue();
        const dni = form.getInput('dni').getValue();
        const nuss = form.getInput('nuss').getValue();
        const address = form.getInput('address').getValue();

        let newAlumno = {
            nombreAlumno: nombre,
            email: email,
            dni: dni,
            nia: nia,
            nuss: nuss,
            phone: phone,
            address: address,
            grupoId: grupoId,
            numero: numero,
            cicloLectivoId: cicloLectivoId,
        };

        let success = true;

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
                form.submitFinish();
            } else {
                form.showError('Error al crear el alumno');
                success = false;
            }
        })
        .catch(error => {
            form.showError('Error al enviar los datos: ' + error.message);
            success = false;
        })
        .finally(() => {
            if (success) {
                listAlumnos.push(newAlumno);
                createAlumnoCell(newAlumno);
                form.submitFinish('Alumno creado correctamente');

                form.reset();
            }
        });
    };

    form.getInput('nombre').retrack('');
    form.getInput('email').retrack('');
    form.getInput('phone').retrack('');
    form.getInput('nia').retrack('');
    form.getInput('dni').retrack('');
    form.getInput('nuss').retrack('');
    form.getInput('address').retrack('');

    const submitButton = document.getElementById('submit');
    submitButton.textContent = 'Crear alumno';
}

function setInputsToUpdate(form, id) {
    let isCancelled = form.cancel();
    if (! isCancelled) return;

    document.getElementById('titulo').textContent = `Información del alumno de ${chosenCurso.textContent}`;
    addDeleteButton(form, id);
    addForgotPasswordButton(form, id);

    const alumno = map.find(a => a.id === id);
    if (!alumno) return;

    form.onsubmit = function (event) {
        const nombre = form.getInput('nombre').getValue().trim();
        const email = form.getInput('email').getValue().trim().toLowerCase();
        const phone = form.getInput('phone').getValue().trim();
        const nia = form.getInput('nia').getValue().trim().toUpperCase();
        const dni = form.getInput('dni').getValue().trim().toUpperCase();
        const nuss = form.getInput('nuss').getValue().trim().toUpperCase();
        const empresa = form.getInput('empresa').getValue().trim();
        const tutorEmpresa = form.getInput('tutorEmpresa').getValue().trim();
        const tutorEmpresaEmail = form.getInput('tutorEmpresaEmail').getValue().trim().toLowerCase();
        const tutorEmpresaPhone = form.getInput('tutorEmpresaPhone').getValue().trim();

        let newAlumno = {
            name: nombre,
            email: email,
            phone: phone,
            nia: nia,
            dni: dni,
            nuss: nuss,
            empresa: empresa,
            tutorEmpresa: tutorEmpresa,
            tutorEmpresaEmail: tutorEmpresaEmail,
            tutorEmpresaPhone: tutorEmpresaPhone
        };

        let success = true;

        fetch(`/api/alumnos/${alumno.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAlumno)
        })
        .then(response => {
            switch (response.status) {
                case 200:
                    return response.json();
                case 400:
                    form.showError('Error en los datos enviados');
                    success = false;
                    break;
                case 500:
                    form.showError('Error interno del servidor');
                    success = false;
                    break;
                default:
                    form.showError('Error desconocido al enviar los datos');
                    success = false;
                    break;
            }
        })
        .then(data => {
            newAlumno.id = data.id;
        })
        .catch(error => {
            form.showError('Error al enviar los datos: ' + error.message);
            success = false;
        })
        .finally(() => {
            if (success) {
                listAlumnos.push(newAlumno);
                createAlumnoCell(newAlumno);
                form.submitFinish('Alumno creado correctamente');

                form.reset();
            }
        });
    };

    form.getInput('nombre').retrack(alumno.data.name);
    form.getInput('email').retrack(alumno.data.email);
    form.getInput('phone').retrack(alumno.data.phone);
    form.getInput('nia').retrack(alumno.data.nia);
    form.getInput('dni').retrack(alumno.data.dni);
    form.getInput('nuss').retrack(alumno.data.nuss);
    form.getInput('empresa').retrack(alumno.data.empresa);
    form.getInput('tutorEmpresa').retrack(alumno.data.tutorEmpresa);
    form.getInput('tutorEmpresaEmail').retrack(alumno.data.tutorEmpresaEmail);
    form.getInput('tutorEmpresaPhone').retrack(alumno.data.tutorEmpresaPhone);

    const submitButton = document.getElementById('submit');
    submitButton.textContent = 'Actualizar alumno';
}

function addDeleteButton(form, id) {
    deleteDeleteButton();

    const deleteButton = document.createElement('button');
    deleteButton.id = 'delete';
    deleteButton.classList.add('form-buttons');
    deleteButton.textContent = 'Eliminar alumno';
    document.getElementById('buttons-wrapper').appendChild(deleteButton);

    deleteButton.addEventListener('click', (event) => {
        event.preventDefault();
        deleteLoading(deleteButton);
        if (confirm('¿Estás seguro de que quieres eliminar este alumno?')) {
            fetch(`/alumnos/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    deleteFinish(deleteButton);

                    const alumnoElement = document.getElementById(`alumno-${id}`);
                    if (alumnoElement) {
                        alumnoElement.remove();
                    }
                } else {
                    form.showError('Error al eliminar el alumno');
                }
            })
            .catch(error => {
                form.showError('Error al eliminar el alumno: ' + error.message);
            })
            .finally(() => {
                deleteFinish(deleteButton);
            });
        } else {
            deleteFinish(deleteButton);
        }
    });
}

function deleteLoading(deleteButton) {
    deleteButton.disabled = true;
    deleteButton.classList.add('loading');
    deleteButton.textContent = '';
    const spinner = document.createElement('span');
    spinner.classList.add('spinner-border', 'spinner-border-sm');
    deleteButton.appendChild(spinner);
}

function deleteFinish(deleteButton) {
    deleteButton.disabled = false;
    deleteButton.classList.remove('loading');
    deleteButton.textContent = 'Eliminar alumno';
    const spinner = deleteButton.querySelector('.spinner-border');
    if (spinner) {
        spinner.remove();
    }
}

function deleteForgotPasswordButton() {
    const forgotPasswordButtonDiv = document.getElementById('forgot-password-div');
    if (forgotPasswordButtonDiv) document.getElementById('buttons-wrapper').removeChild(forgotPasswordButtonDiv);
}

function addForgotPasswordButton(form, id) {
    deleteForgotPasswordButton();

    const forgotPasswordButtonDiv = document.createElement('div');
    forgotPasswordButtonDiv.id = 'forgot-password-div';
    forgotPasswordButtonDiv.style.display = 'flex';
    forgotPasswordButtonDiv.style.alignItems = 'center';
    document.getElementById('buttons-wrapper').appendChild(forgotPasswordButtonDiv);

    const forgotPasswordButton = document.createElement('button');
    forgotPasswordButton.id = 'forgot-password';
    forgotPasswordButton.classList.add('form-buttons');
    forgotPasswordButton.textContent = 'Restablecer contraseña';
    forgotPasswordButtonDiv.appendChild(forgotPasswordButton);

    const forgotPasswordField = document.createElement('input');
    forgotPasswordField.id = 'forgot-password-field';
    forgotPasswordField.classList.add('collapsed', 'text-based', 'input');
    forgotPasswordField.type = 'password';
    forgotPasswordField.setAttribute('label', "Nueva contraseña");
    forgotPasswordField.setAttribute('data-required', 'true');
    forgotPasswordButtonDiv.appendChild(forgotPasswordField);

    new PasswordInput(forgotPasswordField);

    let confirmMode = false;
    let escapeHandler = null;

    function cancelPasswordReset() {
        forgotPasswordField.value = '';
        forgotPasswordField.classList.add('collapsed');
        forgotPasswordButton.textContent = 'Restablecer contraseña';
        confirmMode = false;
        if (escapeHandler) {
            forgotPasswordField.removeEventListener('keydown', escapeHandler);
            escapeHandler = null;
        }
    }

    forgotPasswordButton.addEventListener('click', async (event) => {
        event.preventDefault();
        if (!confirmMode) {
            forgotPasswordField.classList.remove('collapsed');
            forgotPasswordField.focus();
            forgotPasswordButton.textContent = 'Confirmar';
            confirmMode = true;

            // Add escape handler
            escapeHandler = (event) => {
                if (event.key === 'Escape') {
                    cancelPasswordReset();
                }
            };
            forgotPasswordField.addEventListener('keydown', escapeHandler);
        } else {
            const newPassword = forgotPasswordField.value.trim();
            if (!newPassword) {
                form.showError('Introduce una nueva contraseña');
                return;
            }
            passwordResetLoading(forgotPasswordButton);
            try {
                const response = await fetch(`/api/users/reset-password/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ newPassword })
                });
                if (response.ok) {
                    form.submitFinish('Contraseña restablecida correctamente');
                    cancelPasswordReset();
                } else {
                    form.showError('Error al restablecer la contraseña');
                }
            } catch (error) {
                form.showError('Error al restablecer la contraseña: ' + error.message);
            } finally {
                passwordResetFinish(forgotPasswordButton);
            }
        }
    });
}

function passwordResetLoading(forgotPasswordButton) {
    forgotPasswordButton.disabled = true;
    forgotPasswordButton.classList.add('loading');
    forgotPasswordButton.textContent = '';
    const spinner = document.createElement('span');
    spinner.classList.add('spinner-border', 'spinner-border-sm');
    forgotPasswordButton.appendChild(spinner);
}

function passwordResetFinish(forgotPasswordButton) {
    forgotPasswordButton.disabled = false;
    forgotPasswordButton.classList.remove('loading');
    forgotPasswordButton.textContent = 'Restablecer contraseña';
    const spinner = forgotPasswordButton.querySelector('.spinner-border');
    if (spinner) {
        spinner.remove();
    }
}

function deleteDeleteButton() {
    const deleteButton = document.getElementById('delete');
    if (deleteButton) document.getElementById('buttons-wrapper').removeChild(deleteButton);
}
