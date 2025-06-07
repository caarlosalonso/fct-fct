window.addEventListener('DOMContentLoaded', (event) => {
    promise();
});

function promise() {
    Promise.resolve(fetchVistaAlumnos())
    .then((alumnos) => {
        setAlumnosList(alumnos);
    }).catch((error) => {
        console.error('Error al obtener los ciclos lectivos:', error);
    })
}

const storedCiclosLectivos = [];

async function fetchVistaAlumnos() {
    const response = await fetch('/api/vista-alumnos/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los alumnos');
    return await response.json();
}

function setAlumnosList(alumnos) {
    console.log(alumnos);
}
