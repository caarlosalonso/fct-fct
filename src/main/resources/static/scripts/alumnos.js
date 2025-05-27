import { Form } from './classes/Form.js';

let chosenCurso = null;

window.addEventListener('FormsCreated', (event) => {
    const form = Form.getForm('alumno-form');
    form.getInput('nia').validate = function () {
        let nia = this.input.value.trim().toUpperCase();
        return /^\d{1,8}$/.test(nia);
    }
    form.getInput('dni').validate = function () {
        let dni = this.input.value.trim().toUpperCase();

        if (! /^[X-Zx-z\d]\d{0,7}[A-Za-z]$/.test(dni)) return false;

        const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';

        if (/^[XYZ]/.test(dni)) {
            const letraInicial = dni.charAt(0);
            dni = dni.replace(letraInicial, { X: '0', Y: '1', Z: '2' }[letraInicial]);
        }

        const numero = dni.slice(0, -1);
        const letra = dni.slice(-1);
        const letraCalculada = letras[numero % 23];

        return letra === letraCalculada;
    }
    form.getInput('nuss').validate = function () {
        let nuss = this.input.value.trim().toUpperCase();
        return /^\d{11}$/.test(nuss);
    }

    createCursoNavigation();


    setInputsToCreate(form);
    document.getElementById('add').addEventListener('click', () => {
        setInputsToCreate(form);
    });
});

const information = [
    {
        id: 'daw1',
        title: '1º DAW',
        alumnos: [
            {
                id: 92,
                name: 'Pepe Pérez',
            }
        ]
    },
    {
        id: 'daw2',
        title: '2º DAW',
        alumnos: [
            {
                id: 1,
                name: 'Juanito de las Praderas',
                email: 'juanito.praderas@gmail.com',
                phone: '612345678',
                nia: '84727382',
                dni: '83923142Y',
                nuss: '12345678901',
                empresa: 'Alguna por ahí'
            },
            {
                id: 30,
                name: 'UHHHHHHHHHHHHHHHhh',
                email: 'uh.uh@uh.com',
                nia: '99999999',
                dni: '99999999R',
                nuss: '99999999999',
                empresa: 'Uhhhhhhhh'
            }
        ]
    },
    {
        id: 'asir1',
        title: '1º ASIR',
        alumnos: [

        ]
    },
    {
        id: 'asir2',
        title: '2º ASIR',
        alumnos: [

        ]
    },
    {
        id: 'dam1',
        title: '1º DAM',
        alumnos: [

        ]
    },
    {
        id: 'dam2',
        title: '2º DAM',
        alumnos: [

        ]
    }
];

const map = [];

function createCursoNavigation() {
    const cursoSection = document.getElementById('cursos');
    information.forEach(curso => {
        const cursoElement = document.createElement('li');
        cursoElement.classList.add('curso', 'nav-item');
        cursoSection.appendChild(cursoElement);

        const cursoText = document.createElement('p');
        cursoText.classList.add('curso', 'nav-link');
        if (chosenCurso === null) {
            cursoText.classList.add('active');
            chosenCurso = cursoText;
            createListAlumnos(chosenCurso, curso);
        }
        cursoText.id = curso.id;
        cursoText.textContent = curso.title;
        cursoElement.appendChild(cursoText);

        cursoText.addEventListener('click', () => {
            createListAlumnos(cursoText, curso);
        });
    });
}

function createListAlumnos(cursoText, curso) {
    if (chosenCurso) chosenCurso.classList.remove('active');
    cursoText.classList.add('active');
    chosenCurso = cursoText;
    const alumnosList = document.getElementById('alumnos-list-scroll');
    alumnosList.innerHTML = ''; // Clear previous alumnos

    if (curso.alumnos.length === 0) {
        document.getElementById('add').classList.add('empty');
        document.getElementById('alumnos-list-container').classList.add('empty');
        return;
    }
    document.getElementById('add').classList.remove('empty');
    document.getElementById('alumnos-list-container').classList.remove('empty');

    curso.alumnos.forEach(alumno => {
        createAlumnoCell(alumno, Form.getForm('alumno-form'));
    });
}

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

    document.getElementById('titulo').textContent = `Información del alumno de ${chosenCurso.textContent}`;
    deleteDeleteButton();

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

        fetch('/alumnos', {
            method: 'POST',
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

    form.getInput('nombre').retrack('');
    form.getInput('email').retrack('');
    form.getInput('phone').retrack('');
    form.getInput('nia').retrack('');
    form.getInput('dni').retrack('');
    form.getInput('nuss').retrack('');
    form.getInput('empresa').retrack('');
    form.getInput('tutorEmpresa').retrack('');
    form.getInput('tutorEmpresaEmail').retrack('');
    form.getInput('tutorEmpresaPhone').retrack('');

    const submitButton = document.getElementById('submit');
    submitButton.textContent = 'Crear alumno';
}


function setInputsToUpdate(form, id) {
    let isCancelled = form.cancel();
    if (! isCancelled) return;

    document.getElementById('titulo').textContent = `Información del alumno de ${chosenCurso.textContent}`;
    addDeleteButton(form, id);

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

        fetch(`/alumnos/${alumno.id}`, {
            method: 'POST',
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

function deleteDeleteButton() {
    const deleteButton = document.getElementById('delete');
    if (deleteButton) document.getElementById('buttons-wrapper').removeChild(deleteButton);
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
