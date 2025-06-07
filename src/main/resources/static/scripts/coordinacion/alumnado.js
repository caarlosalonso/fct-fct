window.addEventListener('DOMContentLoaded', (event) => {
    promise();
});

function promise() {
    Promise.all([
        fetchCiclosLectivos()
    ])
    .then(([
        ciclosLectivos
    ]) => {
        setCiclosLectivosList(ciclosLectivos);
    }).catch((error) => {
        console.error('Error al obtener los ciclos lectivos:', error);
    })
}

async function fetchCiclosLectivos() {
    const response = await fetch('/api/ciclos-lectivos/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los ciclos lectivos');
    return await response.json();
}

function setCiclosLectivosList(ciclosLectivos) {
    console.log(ciclosLectivos);
}
