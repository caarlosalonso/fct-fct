import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from '../functions.js';

const NIVELES = {
    'BASICA': 'Básica',
    'MEDIO': 'Medio',
    'SUPERIOR': 'Superior'
};

const HORARIOS = {
    'DIURNO': 'Diurno',
    'VESPERTINO': 'Vespertino',
    'NOCHE': 'Noche'
}

let TIMEOUT;
const SECTION = 'display-grid-wrapper';

window.addEventListener('DOMContentLoaded', (event) => {
    promise();
})

window.addEventListener('FormsCreated', (event) => {
    createAbreviatedNameEventListener();
});

function createAbreviatedNameEventListener() {
    const form = Form.getForm('ciclo-form');
    form.getInput('ciclo-nombre').input.addEventListener('input', (event) => {
        const input = form.getInput('ciclo-nombre').getValue();
        const acronimoInput = form.getInput('ciclo-acronimo');
        if (input && input.length > 0) {
            acronimoInput.retrack(
                input.split(' ')
                     .map(word => {
                        word = word.toLowerCase();
                        if (['de', 'y', 'la', 'los'].includes(word)) return '';
                        return word.charAt(0).toUpperCase();
                     })
                     .join('')
                );
        } else {
            acronimoInput.input.value = '';
        }
    });
}

function promise() {
    tableLoading(SECTION);

    Promise.all([
        fetchCiclos(),
        fetchCiclosLectivos(),
        fetchGrupos(),
        fetchTutores()
    ]).then(
        ([
            ciclos,
            ciclosLectivos,
            grupos,
            tutores
        ]) => {
            drawTable(ciclos, ciclosLectivos, grupos, tutores);
        }
    ).catch((error) => {
        tableFail(SECTION, TIMEOUT, promise);
        console.error(error);
    });
}

async function fetchCiclos() {
    const response = await fetch('/api/ciclos/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('No se encontraron ciclos');
    return await response.json();
}

async function fetchCiclosLectivos() {
    const response = await fetch('/api/ciclos-lectivos/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('No se encontraron ciclos lectivos');
    return await response.json();
}

async function fetchGrupos() {
    const response = await fetch('/api/grupos/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('No se encontraron grupos');
    return await response.json();
}

async function fetchTutores() {
    const response = await fetch(`/api/tutores/all`);
    if (!response.ok) throw new Error('Error al obtener tutores disponibles');
    return await response.json();
}

function drawTable(ciclos, ciclosLectivos, grupos, tutores) {
    console.log('Ciclos:', ciclos);
    console.log('Ciclos Lectivos:', ciclosLectivos);
    console.log('Grupos:', grupos);
    console.log('Tutores:', tutores);

    const ciclosList = [];
    ciclosLectivos.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));

    const ciclosGridWrapper = document.getElementById('display-grid-wrapper');
    ciclosGridWrapper.innerHTML = "";

    const gridData = document.createElement('div');
    gridData.id = 'grid-data';
    ciclosGridWrapper.appendChild(gridData);

    const numRows = ciclos.length + 1;
    const numColumns = ciclosLectivos.length;

    gridData.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
    gridData.style.gridTemplateColumns = `250px repeat(${numColumns}, 1fr) 80px`;

    const topLeftCell = document.createElement('div');
    topLeftCell.classList.add('cell', 'sticky', 'cell-column-header', 'cell-row-header');
    topLeftCell.style.gridRow = '1';
    topLeftCell.style.gridColumn = '1';

    const topLeftCellContent = document.createElement('div');
    topLeftCellContent.classList.add('cell-content', 'cell-column-header', 'cell-row-header');
    topLeftCellContent.textContent = "Ciclos";
    topLeftCell.appendChild(topLeftCellContent);
    gridData.appendChild(topLeftCell);
    ciclosList.push(topLeftCell);

    for (const cl of ciclosLectivos) {
        gridData.appendChild(createCicloLectivoCell(cl));
    }

    const lastColumn = document.createElement('div');
    lastColumn.classList.add('cell', 'hoverable', 'last-column', 'cell-column-header', 'add-element');
    lastColumn.style.gridColumn = `${numColumns + 2}`;

    const lastColumnContent = document.createElement('div');
    lastColumnContent.classList.add('cell-content', 'empty-cell', 'cell-column-header');
    lastColumnContent.appendChild(createAddSVG());
    lastColumnContent.onclick = () => {addCicloLectivo();};

    lastColumn.appendChild(lastColumnContent);
    gridData.appendChild(lastColumn);

    let rowIdx = 2; // Start after header row
    let totalRows = 1;

    ciclos.forEach((ciclo) => {
        const cicloDiv = createCicloCell(ciclo, rowIdx);
        gridData.appendChild(
            cicloDiv
        );
        ciclosList.push(cicloDiv);

        for (let year = 1; year <= 2; year++, rowIdx++) {
            for (let j = 0; j < ciclosLectivos.length; j++) {
                const cicloLectivo = ciclosLectivos[j];

                // Find grupo for this ciclo, year, cicloLectivo
                const grupo = grupos.find(g => g.ciclo.id === ciclo.id && g.cicloLectivo.id === cicloLectivo.id && g.numero === year);

                const cell = document.createElement('div');
                cell.classList.add('cell', 'hoverable');
                cell.style.gridRow = rowIdx;
                cell.style.gridColumn = j + 2;
                gridData.appendChild(cell);

                const display = grupo ?
                                createFilledCell(year, ciclo, grupo, tutores) :
                                createEmptyCell(ciclo, cicloLectivo, year, tutores);
                if (!grupo) cell.onclick = () => {
                    addGrupo(ciclo, cicloLectivo, year, tutores);
                }
                cell.appendChild(display);
            }
            totalRows++;
        }
    });

    const lastRow = document.createElement('div');
    lastRow.classList.add('cell', 'hoverable', 'last-row', 'sticky', 'cell-row-header');
    lastRow.style.gridRow = `${rowIdx} / span ${totalRows}`;

    const lastRowContent = document.createElement('div');
    lastRowContent.classList.add('cell-content', 'empty-cell', 'cell-row-header', 'full');
    lastRowContent.appendChild(createAddSVG());
    lastRowContent.onclick = () => {addCiclo();};

    lastRow.appendChild(lastRowContent);
    ciclosGridWrapper.appendChild(lastRow);

    lastColumn.style.gridRow = `1 / span ${totalRows}`;

    gridData.addEventListener('scroll', function () {
        ciclosList.forEach(ciclo => {
            const child = ciclo.firstChild;

            if (gridData.scrollLeft === 0)  child.classList.add('full');
            else                            child.classList.remove('full');
        });
    });

    const form = Form.getForm('grupo-form');

    if (tutores.length === 0) {
        form.getInput('tutor').options.push({
            value: -1,
            label: 'No hay tutores disponibles'
        });
    }
    let options = [];
    tutores.forEach(tutor => {
        const [value, label] = [tutor.id, tutor.name];
        options.push({value, label});
    });
    form.getInput('tutor').updateDropdown(options);


    setTimeout(() => {
        gridData.scrollLeft = gridData.scrollWidth;
    }, 0);
}

function createCicloLectivoCell(cicloLectivo) {
    const cell = document.createElement('div');
    cell.classList.add('cell', 'hoverable', 'cell-column-header');

    const cellContent = document.createElement('div');
    cellContent.classList.add('cell-content', 'cell-column-header', 'filled-cell');

    // Create title span
    const titleSpan = document.createElement('span');
    titleSpan.classList.add('cell-title');
    titleSpan.textContent = cicloLectivo.nombre;
    cellContent.appendChild(titleSpan);

    // Create subtitle span
    const subtitleSpan = document.createElement('span');
    subtitleSpan.classList.add('cell-subtitle');
    subtitleSpan.textContent = cicloLectivo.fechaInicio;
    cellContent.appendChild(subtitleSpan);

    const finSpan = document.createElement('span');
    finSpan.classList.add('cell-subtitle');
    finSpan.textContent = cicloLectivo.fechaFin || 'En curso';
    cellContent.appendChild(finSpan);

    cellContent.appendChild(
        createClickableSVG(
            '0 -0.5 25 25',
            'M 20.848 1.879 C 19.676 0.707 17.777 0.707 16.605 1.879 L 2.447 16.036 C 2.029 16.455 1.743 16.988 1.627 17.569 L 1.04 20.505 C 0.76 21.904 1.994 23.138 3.393 22.858 L 6.329 22.271 C 6.909 22.155 7.443 21.869 7.862 21.451 L 22.019 7.293 C 23.191 6.121 23.191 4.222 22.019 3.05 L 20.848 1.879 Z M 18.019 3.293 C 18.41 2.902 19.043 2.902 19.433 3.293 L 20.605 4.465 C 20.996 4.855 20.996 5.488 20.605 5.879 L 6.447 20.036 C 6.308 20.176 6.13 20.271 5.936 20.31 L 3.001 20.897 L 3.588 17.962 C 3.627 17.768 3.722 17.59 3.862 17.451 L 13.933 7.379 L 16.52 9.965 L 17.934 8.56 L 15.348 5.965 L 18.019 3.293 Z',
            () => editCicloLectivo(cicloLectivo),
            'edit-svg'
        )
    );
    cellContent.appendChild(
        createClickableSVG(
            '-6 -6 60 60',
            'M 42 3 H 28 A 2 2 0 0 0 26 1 H 22 A 2 2 0 0 0 20 3 H 6 A 2 2 0 0 0 6 7 H 42 A 2 2 0 0 0 42 3 Z M 37 11 V 43 H 31 V 19 A 1 1 0 0 0 27 19 V 43 H 21 V 19 A 1 1 0 0 0 17 19 V 43 H 11 V 11 A 2 2 0 0 0 7 11 V 45 A 2 2 0 0 0 9 47 H 39 A 2 2 0 0 0 41 45 V 11 A 2 2 0 0 0 37 11 Z',
            () => removeCicloLectivo(cicloLectivo),
            'delete-svg'
        )
    );

    cell.appendChild(cellContent);
    return cell;
}

function createCicloCell(ciclo, rowIdx) {
    const cicloHeader = document.createElement('div');
    cicloHeader.classList.add('cell', 'hoverable', 'sticky', 'cell-row-header');
    cicloHeader.style.gridRow = `${rowIdx} / span 2`;
    cicloHeader.style.gridColumn = '1';

    const cellContent = document.createElement('div');
    cellContent.classList.add('cell-content', 'cell-row-header');

    // Create title span
    const titleSpan = document.createElement('span');
    titleSpan.classList.add('cell-title', 'row-header-span');
    titleSpan.textContent = `${ciclo.name}`;
    cellContent.appendChild(titleSpan);
    
    const acronymSpan = document.createElement('span');
    acronymSpan.classList.add('cell-subtitle');
    acronymSpan.textContent = `(${ciclo.acronimo})`;
    titleSpan.appendChild(acronymSpan);

    // Create subtitle spans
    const familiaSubtitleSpan = document.createElement('span');
    familiaSubtitleSpan.classList.add('cell-subtitle', 'row-header-span');
    familiaSubtitleSpan.textContent = ciclo.familiaProfesional;
    cellContent.appendChild(familiaSubtitleSpan);

    const nivelSubtitleSpan = document.createElement('span');
    nivelSubtitleSpan.classList.add('cell-subtitle', 'row-header-span');
    nivelSubtitleSpan.textContent = NIVELES[ciclo.nivel];
    cellContent.appendChild(nivelSubtitleSpan);

    const horasSubtitleSpan = document.createElement('span');
    horasSubtitleSpan.classList.add('cell-subtitle', 'row-header-span');
    horasSubtitleSpan.textContent = ciclo.horasPracticas;
    cellContent.appendChild(horasSubtitleSpan);

    cellContent.appendChild(
        createClickableSVG(
            '0 -0.5 25 25',
            'M 20.848 1.879 C 19.676 0.707 17.777 0.707 16.605 1.879 L 2.447 16.036 C 2.029 16.455 1.743 16.988 1.627 17.569 L 1.04 20.505 C 0.76 21.904 1.994 23.138 3.393 22.858 L 6.329 22.271 C 6.909 22.155 7.443 21.869 7.862 21.451 L 22.019 7.293 C 23.191 6.121 23.191 4.222 22.019 3.05 L 20.848 1.879 Z M 18.019 3.293 C 18.41 2.902 19.043 2.902 19.433 3.293 L 20.605 4.465 C 20.996 4.855 20.996 5.488 20.605 5.879 L 6.447 20.036 C 6.308 20.176 6.13 20.271 5.936 20.31 L 3.001 20.897 L 3.588 17.962 C 3.627 17.768 3.722 17.59 3.862 17.451 L 13.933 7.379 L 16.52 9.965 L 17.934 8.56 L 15.348 5.965 L 18.019 3.293 Z',
            () => editCiclo(ciclo),
            'edit-svg',
            'row-header-svg'
        )
    );
    cellContent.appendChild(
        createClickableSVG(
            '-6 -6 60 60',
            'M 42 3 H 28 A 2 2 0 0 0 26 1 H 22 A 2 2 0 0 0 20 3 H 6 A 2 2 0 0 0 6 7 H 42 A 2 2 0 0 0 42 3 Z M 37 11 V 43 H 31 V 19 A 1 1 0 0 0 27 19 V 43 H 21 V 19 A 1 1 0 0 0 17 19 V 43 H 11 V 11 A 2 2 0 0 0 7 11 V 45 A 2 2 0 0 0 9 47 H 39 A 2 2 0 0 0 41 45 V 11 A 2 2 0 0 0 37 11 Z',
            () => removeCiclo(ciclo),
            'delete-svg',
            'row-header-svg'
        )
    );

    cicloHeader.appendChild(cellContent);

    return cicloHeader;
}

function createFilledCell(year, ciclo, grupo, tutores) {
    const cell = document.createElement('div');
    cell.className = 'cell-content filled-cell';

    // Create title span
    const titleSpan = document.createElement('span');
    titleSpan.classList.add('cell-title');
    titleSpan.textContent = `${year}º ${ciclo.acronimo}`;
    cell.appendChild(titleSpan);

    const tutorSpan = document.createElement('span');
    tutorSpan.classList.add('cell-subtitle');
    tutorSpan.textContent = grupo.tutor.user.name || 'Falta tutor';
    cell.appendChild(tutorSpan);

    // Create subtitle span
    const subtitleSpan = document.createElement('span');
    subtitleSpan.classList.add('cell-subtitle');
    subtitleSpan.textContent = HORARIOS[grupo.horario];
    cell.appendChild(subtitleSpan);

    cell.appendChild(
        createClickableSVG(
            '0 -0.5 25 25',
            'M 20.848 1.879 C 19.676 0.707 17.777 0.707 16.605 1.879 L 2.447 16.036 C 2.029 16.455 1.743 16.988 1.627 17.569 L 1.04 20.505 C 0.76 21.904 1.994 23.138 3.393 22.858 L 6.329 22.271 C 6.909 22.155 7.443 21.869 7.862 21.451 L 22.019 7.293 C 23.191 6.121 23.191 4.222 22.019 3.05 L 20.848 1.879 Z M 18.019 3.293 C 18.41 2.902 19.043 2.902 19.433 3.293 L 20.605 4.465 C 20.996 4.855 20.996 5.488 20.605 5.879 L 6.447 20.036 C 6.308 20.176 6.13 20.271 5.936 20.31 L 3.001 20.897 L 3.588 17.962 C 3.627 17.768 3.722 17.59 3.862 17.451 L 13.933 7.379 L 16.52 9.965 L 17.934 8.56 L 15.348 5.965 L 18.019 3.293 Z',
            () => editGrupo(grupo),
            'edit-svg'
        )
    );
    cell.appendChild(
        createClickableSVG(
            '-6 -6 60 60',
            'M 42 3 H 28 A 2 2 0 0 0 26 1 H 22 A 2 2 0 0 0 20 3 H 6 A 2 2 0 0 0 6 7 H 42 A 2 2 0 0 0 42 3 Z M 37 11 V 43 H 31 V 19 A 1 1 0 0 0 27 19 V 43 H 21 V 19 A 1 1 0 0 0 17 19 V 43 H 11 V 11 A 2 2 0 0 0 7 11 V 45 A 2 2 0 0 0 9 47 H 39 A 2 2 0 0 0 41 45 V 11 A 2 2 0 0 0 37 11 Z',
            () => removeGrupo(grupo, ciclo),
            'delete-svg'
        )
    );

    return cell;
}

function createEmptyCell(ciclo, cicloLectivo, numero, tutores) {
    const cell = document.createElement('div');
    cell.className = 'cell-content empty-cell add-element';
    cell.appendChild(createAddSVG());
    return cell;
}

function createAddSVG() {
    return createSVG(
            '0 0 48 48',
            'M 44 20 L 28 20 L 28 4 C 28 2 26 0 24 0 S 20 2 20 4 L 20 20 L 4 20 C 2 20 0 22 0 24 S 2 28 4 28 L 20 28 L 20 44 C 20 46 22 48 24 48 S 28 46 28 44 L 28 28 L 44 28 C 46 28 48 26 48 24 S 46 20 44 20 Z',
            'plus-svg'
    );
}

function collapseAll() {
    const forms = [
        Form.getForm('ciclo-form'),
        Form.getForm('ciclo-lectivo-form'),
        Form.getForm('grupo-form')
    ];
    forms.forEach(form => {
        form.form.parentNode.classList.add('collapsed');
    });
}

function finish(form) {
    form.reset();
    form.submitFinish();
    collapseAll();
    promise();
}

async function fetchTutoresDisponibles(cicloLectivo) {
    const response = await fetch(`/api/vista-tutores/disponibles/${cicloLectivo.id}`);
    if (!response.ok) throw new Error('Error al obtener tutores disponibles');
    return await response.json();
}

async function addGrupo(ciclo, cicloLectivo, numero, tutores) {
    collapseAll();

    const form = Form.getForm('grupo-form');
    form.form.parentNode.classList.remove('collapsed');

    form.onsubmit = (event) => {
        const cicloLectivoId = cicloLectivo.id;
        const cicloId = ciclo.id;
        const numero = form.getInput('grupo-numero').getValue();
        const horario = form.getInput('grupo-horario').getValue();
        const tutor = form.getInput('tutor').getValue();

        if (tutor === -1) {
            form.showError('Por favor, selecciona un tutor válido.');
            return;
        }

        let grupo = {
            ciclo: cicloId,
            cicloLectivo: cicloLectivoId,
            numero: parseInt(numero),
            horario: horario,
            tutor_id: tutor
        };

        fetch('/api/grupos/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(grupo)
        }).then(response => {
            if (response.ok || response.status === 201) {
                finish(form);
            } else {
                response.text().then((text) => {
                    form.showError(`Error al crear el grupo: ${text}`);
                });
            }
        }).catch(error => {
            console.error('Error al crear el grupo:', error);
            form.showError('Error al crear el grupo');
        });
    }

    form.getInput('grupo-numero').retrack(numero);
    form.getInput('grupo-horario').retrack('');
    form.getInput('tutor').retrack('');

    form.form.setAttribute('submit-text', 'Crear grupo');
    form.submit.textContent = 'Crear grupo';
}

function addCiclo() {
    collapseAll();

    const form = Form.getForm('ciclo-form');
    form.form.parentNode.classList.remove('collapsed');

    form.onsubmit = (event) => {
        const name = form.getInput('ciclo-nombre').getValue();
        const acronimo = form.getInput('ciclo-acronimo').getValue();
        const familiaProfesional = form.getInput('ciclo-familia').getValue();
        const nivel = form.getInput('ciclo-nivel').getValue();
        const horasPracticas = form.getInput('ciclo-practicas').getValue();

        let ciclo = {
            name: name,
            acronimo: acronimo,
            familiaProfesional: familiaProfesional,
            nivel: nivel,
            horasPracticas: horasPracticas
        }

        fetch('/api/ciclos/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ciclo)
        }).then(response => {
            if (response.ok || response.status === 201) {
                finish(form);
            } else {
                response.text().then((text) => {
                    form.showError(`Error al crear el ciclo: ${text}`);
                });
            }
        }).catch(error => {
            console.error('Error al crear el ciclo:', error);
            form.showError('Error al crear el ciclo');
        });
    }

    form.getInput('ciclo-nombre').retrack('');
    form.getInput('ciclo-acronimo').retrack('');
    form.getInput('ciclo-familia').retrack('');
    form.getInput('ciclo-nivel').retrack('');
    form.getInput('ciclo-practicas').retrack('');

    form.form.setAttribute('submit-text', 'Crear ciclo');
    form.submit.textContent = 'Crear ciclo';
}

function addCicloLectivo() {
    collapseAll();

    const form = Form.getForm('ciclo-lectivo-form');
    form.form.parentNode.classList.remove('collapsed');

    form.onsubmit = (event) => {
        const name = form.getInput('ciclo-lectivo-nombre').getValue();
        const fechaInicio = form.getInput('ciclo-lectivo-inicio').getValue();
        const fechaFin = form.getInput('ciclo-lectivo-fin').getValue();

        let cicloLectivo = {
            nombre: name,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        };

        fetch('/api/ciclos-lectivos/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cicloLectivo)
        }).then(response => {
            if (response.ok || response.status === 201) {
                finish(form);
            } else {
                response.text().then((text) => {
                    form.showError(`Error al crear el ciclo lectivo: ${text}`);
                });
            }
        }).catch(error => {
            console.error('Error al crear el ciclo lectivo:', error);
            form.showError('Error al crear el ciclo lectivo');
        });
    }
    
    form.getInput('ciclo-lectivo-nombre').retrack('');
    form.getInput('ciclo-lectivo-inicio').retrack('');
    form.getInput('ciclo-lectivo-fin').retrack('');

    form.form.setAttribute('submit-text', 'Crear ciclo lectivo');
    form.submit.textContent = 'Crear ciclo lectivo';
}

function removeGrupo(grupo, ciclo) {
    if (!confirm(`¿Estás seguro de que quieres eliminar el grupo ${grupo.numero} del ciclo ${ciclo.nombre} (${ciclo.acronimo})?`)) {
        return;
    }

    fetch(`/api/grupos/${grupo.id}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            promise();
        } else {
            response.text().then((text) => {
                alert(`Error al eliminar el grupo ${grupo.numero}: ${text}`);
            });
        }
    }).catch(error => {
        console.error('Error al eliminar el grupo:', error);
        alert('Error al eliminar el grupo');
    });
}

function removeCiclo(ciclo) {
    if (!confirm(`¿Estás seguro de que quieres eliminar el ciclo ${ciclo.nombre} (${ciclo.acronimo})?`)) {
        return;
    }

    fetch(`/api/ciclos/${ciclo.id}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            promise();
        } else {
            response.text().then((text) => {
                form.showError(`Error al eliminar el ciclo: ${text}`);
            });
        }
    }).catch(error => {
        console.error('Error al eliminar el ciclo:', error);
        alert('Error al eliminar el ciclo');
    });
}

function removeCicloLectivo(cicloLectivo) {
    if (!confirm(`¿Estás seguro de que quieres eliminar el ciclo lectivo ${cicloLectivo.nombre}?`)) {
        return;
    }

    fetch(`/api/ciclos-lectivos/${cicloLectivo.id}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            promise();
        } else {
            response.text().then((text) => {
                form.showError(`Error al eliminar el ciclo lectivo: ${text}`);
            });
        }
    }).catch(error => {
        console.error('Error al eliminar el ciclo lectivo:', error);
        alert('Error al eliminar el ciclo lectivo');
    });
}

function editGrupo(grupo) {
    collapseAll();

    const form = Form.getForm('grupo-form');
    form.form.parentNode.classList.remove('collapsed');

    form.onsubmit = (event) => {
        const numero = form.getInput('grupo-numero').getValue();
        const horario = form.getInput('grupo-horario').getValue();
        const tutor = form.getInput('tutor').getValue();

        const data = {
            ciclo: grupo.cicloId,
            cicloLectivo: grupo.cicloLectivoId,
            numero: numero,
            horario: horario,
            tutor_id: tutor
        }

        fetch(`/api/grupos/${grupo.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            if (response.ok || response.status === 201) {
                finish(form);
            } else {
                response.text().then((text) => {
                    form.showError(`Error al actualizar el grupo: ${text}`);
                });
            }
        })
        .catch((error) => {
            console.error('Error al actualizar el grupo:', error);
            form.showError('Error al actualizar el grupo');
        });
    }

    form.getInput('grupo-numero').retrack(grupo.numero);
    form.getInput('grupo-horario').retrack(grupo.horario);
    form.getInput('tutor').retrack(grupo.tutor.id);

    form.form.setAttribute('submit-text', 'Actualizar grupo');
    form.submit.textContent = 'Actualizar grupo';
}

function editCiclo(ciclo) {
    collapseAll();

    const form = Form.getForm('ciclo-form');
    form.form.parentNode.classList.remove('collapsed');

    form.onsubmit = (event) => {
        const name = form.getInput('ciclo-nombre').getValue();
        const acronimo = form.getInput('ciclo-acronimo').getValue();
        const nivel = form.getInput('ciclo-nivel').getValue();
        const familiaProfesional = form.getInput('ciclo-familia').getValue();
        const horasPracticas = form.getInput('ciclo-practicas').getValue();

        const data = {
            name: name,
            acronimo: acronimo,
            nivel: nivel,
            familiaProfesional: familiaProfesional,
            horasPracticas: horasPracticas
        }

        fetch(`/api/ciclos/${ciclo.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            if (response.ok || response.status === 201) {
                finish(form);
            } else {
                response.text().then((text) => {
                    form.showError(`Error al actualizar el ciclo: ${text}`);
                });
            }
        })
        .catch((error) => {
            console.error('Error al actualizar el ciclo:', error);
            form.showError('Error al actualizar el ciclo');
        });
    }

    form.getInput('ciclo-nombre').retrack(ciclo.name);
    form.getInput('ciclo-acronimo').retrack(ciclo.acronimo);
    form.getInput('ciclo-nivel').retrack(ciclo.nivel);
    form.getInput('ciclo-familia').retrack(ciclo.familiaProfesional);
    form.getInput('ciclo-practicas').retrack(ciclo.horasPracticas);

    form.form.setAttribute('submit-text', 'Actualizar ciclo');
    form.submit.textContent = 'Actualizar ciclo';
}

function editCicloLectivo(cicloLectivo) {
    collapseAll();

    const form = Form.getForm('ciclo-lectivo-form');
    form.form.parentNode.classList.remove('collapsed');

    form.onsubmit = (event) => {
        const nombre = form.getInput('ciclo-lectivo-nombre').getValue();
        const inicio = form.getInput('ciclo-lectivo-inicio').getValue();

        const data = {
            nombre: nombre,
            fechaInicio: inicio
        }

        fetch(`/api/ciclos-lectivos/${cicloLectivo.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            if (response.ok || response.status === 201) {
                finish(form);
            } else {
                response.text().then((text) => {
                    form.showError(`Error al actualizar el ciclo lectivo: ${text}`);
                });
            }
        })
        .catch((error) => {
            console.error('Error al actualizar el ciclo lectivo:', error);
            form.showError('Error al actualizar el ciclo lectivo');
        });
    }

    form.getInput('ciclo-lectivo-nombre').retrack(cicloLectivo.nombre);
    form.getInput('ciclo-lectivo-inicio').retrack(cicloLectivo.fechaInicio);

    form.form.setAttribute('submit-text', 'Actualizar ciclo lectivo');
    form.submit.textContent = 'Actualizar ciclo lectivo';
}
