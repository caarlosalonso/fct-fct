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
            grupos: gruposCiclos.filter(grupo => grupo.cicloLectivoId === cicloLectivo.id).map(grupo => {
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

function createCiclosLectivos() {
    const cicloLectivoSelection = document.getElementById('ciclo-lectivo-selection');
    cicloLectivoSelection.innerHTML = '';

    const ul = document.createElement('ul');
    ul.classList.add('ciclos-lectivos', 'nav', 'nav-tabs');
    ul.id = 'ciclos-lectivos';
    cicloLectivoSelection.appendChild(ul);

    info.forEach((cicloLectivo) => {
        const li = document.createElement('li');
        li.classList.add('nav-item');
        li.textContent = cicloLectivo.nombre;
        ul.appendChild(li);

        li.addEventListener('click', () => {
            createGruposCiclos(cicloLectivo.id);
        });
    });
}

function createGruposCiclos(cicloLectivoId) {
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
            li.classList.add('nav-item');
            li.textContent = grupo.grupo_nombre;
            ul.appendChild(li);

            li.addEventListener('click', () => {
                createAlumnos(grupo.alumnos);
            });
        });
    }
}

function createAlumnos(alumnos) {
    const alumnosSelection = document.getElementById('alumnos-selection');
    alumnosSelection.innerHTML = '';

    const ul = document.createElement('ul');
    ul.classList.add('alumnos', 'nav', 'nav-tabs');
    ul.id = 'alumnos';
    alumnosSelection.appendChild(ul);

    alumnos.forEach((alumno) => {
        const li = document.createElement('li');
        li.classList.add('nav-item');
        li.textContent = `${alumno.nombre} ${alumno.apellido}`;
        ul.appendChild(li);
    });
}
