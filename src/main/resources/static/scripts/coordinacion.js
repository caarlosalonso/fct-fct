window.addEventListener('DOMContentLoaded', (event) => {
    Promise.all([
        fetchCiclos(),
        fetchCiclosLectivos(),
        fetchGrupos()
    ]).then(([
        ciclos,
        ciclosLectivos,
        grupos
    ]) => {
        drawTable(ciclos, ciclosLectivos, grupos);
    });
});

const NIVELES = {
    'BASICA': 'Básica',
    'MEDIO': 'Medio',
    'SUPERIOR': 'Superior'
};

function fetchCiclos() {
    return new Promise((res, rej) => {
        fetch('/api/ciclos/all')
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    res(data);
                } else {
                    rej(new Error('No se encontraron ciclos'));
                }
            })
            .catch(error => {
                console.error('Error fetching ciclos:', error);
                rej(error);
            });
    });
}

function fetchCiclosLectivos() {
    return new Promise((res, rej) => {
        fetch('/api/ciclosLectivos/all')
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                res(data);
            } else {
                rej(new Error('No se encontraron ciclos lectivos'));
            }
        })
        .catch(error => {
            console.error('Error fetching ciclos lectivos:', error);
            rej(error);
        });
    });
}

function fetchGrupos() {
    return new Promise((res, rej) => {
        fetch('/api/grupos/all')
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                res(data);
            } else {
                rej(new Error('No se encontraron grupos'));
            }
        })
        .catch(error => {
            console.error('Error fetching grupos:', error);
            rej(error);
        });
    });
}

function drawTable(ciclos, ciclosLectivos, grupos) {
    const ciclosSection = document.getElementById('ciclos-container');
    ciclosSection.innerHTML = ""; // Clear previous table

    // Create table
    const table = document.createElement('table');
    table.className = "table table-bordered align-middle";
    ciclosSection.appendChild(table);

    // Build header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    thead.appendChild(headerRow);

    // Sticky ciclo header
    const thCiclo = document.createElement('th');
    thCiclo.textContent = "Ciclo";
    thCiclo.className = "sticky-corner";
    headerRow.appendChild(thCiclo);

    // Add a column for each ciclo lectivo
    ciclosLectivos.forEach(cl => {
        const th = document.createElement('th');
        th.textContent = cl.nombre;
        th.className = "sticky-header text-center";
        headerRow.appendChild(th);
    });
    table.appendChild(thead);

    // Build body
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    ciclos.forEach(ciclo => {
        const row = document.createElement('tr');
        tbody.appendChild(row);

        const tdCiclo = document.createElement('td');
        tdCiclo.textContent = ciclo.abreviatura;
        tdCiclo.className = "sticky-col fw-bold";
        row.appendChild(tdCiclo);

        const expectedGrupos = [];
        for(let i = 1; i <= ciclo.years; ++i) {
            expectedGrupos.push(`${i}º`);
        }

        ciclosLectivos.forEach(cl => {
            const td = document.createElement('td');
            td.className = "grupo-cell";
            const groups = grupos.filter(g => g.cicloId === ciclo.id && g.cicloLectivoId === cl.id);

            const rendered = new Set();
            groups.forEach(g => {
                const div = document.createElement('div');
                div.className = "d-flex justify-content-between align-items-center mb-1";

                div.innerHTML = `<span>${g.nombre} ${ciclo.abreviatura}</span>
                    <button class="btn btn-sm btn-outline-primary ms-2">Editar</button>`;
                td.appendChild(div);
                rendered.add(g.nombre);
            });

            expectedGrupos.forEach(expectedNombre => {
                if (!rendered.has(expectedNombre)) {
                    const div = document.createElement('div');
                    div.className = "mb-1 text-muted";
                    div.textContent = `${expectedNombre} ${ciclo.abreviatura}`;
                    td.appendChild(div);
                }
            });

            row.appendChild(td);
        });
    });

    setTimeout(() => {
        ciclosSection.scrollLeft = ciclosSection.scrollWidth;
    }, 0);
}
