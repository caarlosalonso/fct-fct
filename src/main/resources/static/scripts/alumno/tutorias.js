const SECTION = 'curso-actual';

window.addEventListener('DOMContentLoaded', (event) => {
    promise();
});

function promise() {
    Promise.all([
        fetchTutorias(),
        fetchCursoActual(),
        fetchCursoAlumno(),
    ])
    .then(([
        tutorias,
        cursoActual,
        cursoAlumno
    ]) => {
        build(tutorias, cursoActual, cursoAlumno);
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

async function fetchCursoAlumno() {
    const response = await fetch('/api/vista-alumno-ciclos/alumno');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los grupos');
    return await response.json();
}

function build(tutorias, cursoActual, cursoAlumno) {
    console.log('Tutorías:', tutorias);
    console.log('Curso Actual:', cursoActual);
    console.log('Curso Alumno:', cursoAlumno);

    crearLista(tutorias);

    const displaySection = document.getElementById(SECTION);
    while( displaySection.firstChild) displaySection.removeChild(displaySection.firstChild);

    if (cursoActual.length === 0) {
        displaySection.classList.add('empty');
        displaySection.textContent = 'No tienes ninguna tutoría asignada';
        return;
    }

    const cicloInfo = document.createElement('p');
    cicloInfo.classList.add('ciclo-info');
    cicloInfo.textContent = `${cursoActual.nombre} - ${cursoAlumno.grupoNombre}`;
    displaySection.appendChild(cicloInfo);
}

function crearLista(tutorias) {
    const listar = document.getElementById('listar');
    while(listar && listar.firstChild) listar.removeChild(listar.firstChild);

    if (tutorias.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.textContent = 'No hay tutorías en este curso';
        listar.appendChild(mensaje);
        return;
    }

    tutorias.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    tutorias.forEach(tutoria => {
        const item = document.createElement('div');
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
        const isPasada = new Date(tutoria.fecha) < new Date();
        if (isPasada) estadoSpan.classList.add('pasada');
        estadoSpan.textContent = `Estado: ${isPasada ? 'Pasada' : 'Próxima'}`;
        item.appendChild(estadoSpan);
    });
}
