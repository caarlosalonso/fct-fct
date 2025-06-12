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
let chosenCicloLectivo = null;
let chosenGrupo = null;

function build(ciclosLectivos, gruposCiclos, alumnos) {
    ciclosLectivos.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
    console.log(ciclosLectivos, gruposCiclos, alumnos);
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

    createCiclosLectivos();
}

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
    const alumnosSelection = document.getElementById('alumnos-list');
    alumnosSelection.innerHTML = '';

    if (alumnos.length === 0) {
        document.getElementById('alumnos-list-container').classList.add('empty');
        return;
    }
    document.getElementById('alumnos-list-container').classList.remove('empty');

    alumnos.forEach(alumno => {
        const alumnoElement = document.createElement('div');
        alumnoElement.classList.add('alumno', 'cell');
        alumnoElement.id = `alumno-${alumno.id}`;

        const nameElement = document.createElement('p');
        nameElement.textContent = `Nombre: ${alumno.name}`;
        alumnoElement.appendChild(nameElement);

        const niaElement = document.createElement('p');
        niaElement.textContent = `NIA: ${alumno.nia}`;
        alumnoElement.appendChild(niaElement);

        const emailElement = document.createElement('p');
        emailElement.textContent = `Correo: ${alumno.email}`;
        alumnoElement.appendChild(emailElement);

        alumnosSelection.appendChild(alumnoElement);
    });
}
