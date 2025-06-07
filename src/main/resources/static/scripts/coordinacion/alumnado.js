window.addEventListener('DOMContentLoaded', (event) => {
    promise();
});

function promise() {
    Promise.all([
        fetchCiclosLectivos(),
        fetchGruposCiclos(),
        fetchAlumnos()
    ])
    .then(([
        ciclosLectivos,
        gruposCiclos,
        alumnos
    ]) => {
        build(ciclosLectivos, gruposCiclos, alumnos);
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

function build(ciclosLectivos, gruposCiclos, alumnos) {
    ciclosLectivos.forEach((cicloLectivo) => {
        info.push({
            id: cicloLectivo.id,
            createdAt: cicloLectivo.createdAt,
            updatedAt: cicloLectivo.updatedAt,
            nombre: cicloLectivo.nombre,
            fechaInicio: cicloLectivo.fechaInicio,
            grupo: gruposCiclos.filter(grupo => grupo.cicloLectivoId === cicloLectivo.id).map(grupo => {
                return {
                    cicloLectivoId: grupo.cicloLectivoId,
                    grupoId: grupo.grupoId,
                    grupo_nombre: grupo.grupo_nombre,
                    ciclo_id: grupo.cicloId,
                    alumnos: alumnos.filter(alumno => alumno.grupoCicloId === grupo.id)
                };
            })
        })
    });
    console.log(info);
}
