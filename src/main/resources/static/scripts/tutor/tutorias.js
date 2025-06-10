import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from '../functions.js';

const SECTION = 'curso-actual';

window.addEventListener('FormsCreated', (event) => {
    promise();
});

function promise() {
    Promise.all([
        fetchTutorias(),
        fetchCursoActual(),
        fetchGrupoTutor(),
    ])
    .then(([
        tutorias,
        cursoActual,
        grupoTutor
    ]) => {
        build(tutorias, cursoActual, grupoTutor);
    }).catch((error) => {
        console.error(error);
    });
}

async function fetchTutorias() {
    const response = await fetch('/api/tutorias/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener las tutorías');
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

function build(tutorias, cursoActual, grupoTutor) {
    console.log('Tutorías:', tutorias);
    console.log('Ciclo lectivo actual:', cursoActual);
    console.log('Grupo del tutor:', grupoTutor);

    const form = Form.getForm('crear-form');
    crearLista(tutorias, form);

    setInputsToCreate(form, grupoTutor);

    const displaySection = document.getElementById(SECTION);
    while( displaySection.firstChild) displaySection.removeChild(displaySection.firstChild);

    if (cursoActual.length === 0) {
        displaySection.classList.add('empty');
        displaySection.textContent = 'No tienes ninguna tutoría asignada';
        return;
    }

    const cicloInfo = document.createElement('p');
    cicloInfo.classList.add('ciclo-info');
    cicloInfo.textContent = `${cursoActual.nombre} - ${grupoTutor.grupoNombre}`;
    displaySection.appendChild(cicloInfo);
}

function crearLista(tutorias, form) {
    const listar = document.getElementById('listar');
    while(listar && listar.firstChild) listar.removeChild(listar.firstChild);

    if (tutorias.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.textContent = 'No hay tutorías en este curso';
        listar.appendChild(mensaje);
        return;
    }

    let item = document.createElement('div');
    item.classList.add('tutoria-item', 'add');
    item.id = 'create-tutoria';
    item.onclick = (event) => {
        event.preventDefault();
        setInputsToCreate(form, grupoTutor);
    }
    listar.appendChild(item);
    item.appendChild(
        createSVG(
            '0 0 48 48',
            'M 44 20 L 28 20 L 28 4 C 28 2 26 0 24 0 S 20 2 20 4 L 20 20 L 4 20 C 2 20 0 22 0 24 S 2 28 4 28 L 20 28 L 20 44 C 20 46 22 48 24 48 S 28 46 28 44 L 28 28 L 44 28 C 46 28 48 26 48 24 S 46 20 44 20 Z',
            'add-svg'
        )
    );

    tutorias.forEach(tutoria => {
        item = document.createElement('div');
        item.classList.add('tutoria-item');
        listar.appendChild(item);

        const fechaSpan = document.createElement('span');
        fechaSpan.classList.add('cell-value', 'cell-title');
        fechaSpan.textContent = new Date(tutoria.fecha).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
        item.appendChild(fechaSpan);

        const horaSpan = document.createElement('span');
        horaSpan.classList.add('cell-value', 'cell-subtitle');
        horaSpan.textContent = new Date(tutoria.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        item.appendChild(horaSpan);

        const estadoSpan = document.createElement('span');
        estadoSpan.classList.add('cell-value', 'cell-subtitle');
        estadoSpan.textContent = `Estado: ${new Date(tutoria.fecha) < new Date() ? 'Pasada' : 'Próxima'}`;
        item.appendChild(estadoSpan);

        item.appendChild(
            createClickableSVG(
                '0 -0.5 25 25',
                'M 20.848 1.879 C 19.676 0.707 17.777 0.707 16.605 1.879 L 2.447 16.036 C 2.029 16.455 1.743 16.988 1.627 17.569 L 1.04 20.505 C 0.76 21.904 1.994 23.138 3.393 22.858 L 6.329 22.271 C 6.909 22.155 7.443 21.869 7.862 21.451 L 22.019 7.293 C 23.191 6.121 23.191 4.222 22.019 3.05 L 20.848 1.879 Z M 18.019 3.293 C 18.41 2.902 19.043 2.902 19.433 3.293 L 20.605 4.465 C 20.996 4.855 20.996 5.488 20.605 5.879 L 6.447 20.036 C 6.308 20.176 6.13 20.271 5.936 20.31 L 3.001 20.897 L 3.588 17.962 C 3.627 17.768 3.722 17.59 3.862 17.451 L 13.933 7.379 L 16.52 9.965 L 17.934 8.56 L 15.348 5.965 L 18.019 3.293 Z',
                () => setInputsToUpdate(form, tutoria),
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
                    removeTutoria(form, tutoria);
                },
                'delete-svg',
                'svg'
            )
        );
    });
}

function setInputsToCreate(form, grupoTutor) {
    form.onsubmit = () => {
        const fecha = form.getInput('fecha').getValue();

        let newTutoria = {
            fecha: fecha,
            grupoId: grupoTutor.grupoId
        };

        fetch('/api/tutorias/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTutoria)
        })
        .then(response => {
            if (response.status === 201) {
                promise();
                form.reset();
                form.submitFinish();
                form.showSuccess('Tutoría creada correctamente');
            } else {
                form.showError('Error al crear la tutoría');
            }
        })
        .catch(error => {
            form.showError('Error al enviar los datos: ' + error.message);
        });
    };

    form.getInput('fecha').retrack('');

    form.form.querySelector('#submit').textContent = 'Crear tutoría';
}

function setInputsToUpdate(form, tutoria) {
    form.onsubmit = () => {
        const fecha = form.getInput('fecha').getValue();

        let newTutoria = {
            fecha: fecha
        };

        fetch(`/api/tutorias/${tutoria.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTutoria)
        })
        .then(response => {
            if (response.ok) {
                form.showSuccess('Tutoría actualizada correctamente');
                form.submitFinish();
                form.reset();
                promise();
            } else {
                form.showError('Error al actualizar la tutoría');
                form.submitFinish();
            }
        })
        .catch(error => {
            form.showError('Error al enviar los datos: ' + error.message);
            form.submitFinish();
        });
    };

    form.getInput('fecha').retrack(tutoria.fecha);

    form.form.querySelector('#submit').textContent = 'Actualizar tutoría';
}

function removeTutoria(form, tutoria) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tutoría?')) {
        fetch(`/api/tutorias/${tutoria.id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                promise();
            } else {
                form.showError('Error al eliminar la tutoría');
            }
        })
        .catch(error => {
            form.showError('Error al eliminar la tutoría: ' + error.message);
        });
    }
}
