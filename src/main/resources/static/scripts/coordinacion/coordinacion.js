import { Form } from './../classes/Form.js';

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

const fetchedCiclos = [
    { id: 1, name: 'Desarrollo de Aplicaciones Web', acronimo: 'DAW', years: 2, nivel: NIVELES.SUPERIOR },
    { id: 2, name: 'Desarrollo de Aplicaciones Multiplataforma', acronimo: 'DAM', years: 2, nivel: NIVELES.SUPERIOR },
    { id: 3, name: 'Servicios Microinformaticos y Redes', acronimo: 'SMR', years: 2, nivel: NIVELES.MEDIO }
];

const fetchedCiclosLectivos = [
    { id: 1, nombre: '2018-2019', fechaInicio: '01/09/2018' },
    { id: 2, nombre: '2019-2020', fechaInicio: '01/09/2019' },
    { id: 3, nombre: '2020-2021', fechaInicio: '01/09/2020' },
    { id: 4, nombre: '2021-2022', fechaInicio: '01/09/2021' },
    { id: 5, nombre: '2022-2023', fechaInicio: '01/09/2022' },
    { id: 6, nombre: '2023-2024', fechaInicio: '01/09/2023' },
    { id: 7, nombre: '2024-2025', fechaInicio: '01/09/2024' }
];

const fetchedGrupos = [
    { id: 1, cicloId: 1, cicloLectivoId: 1, numero: 1, horario: 'DIURNO' },
    { id: 2, cicloId: 1, cicloLectivoId: 1, numero: 2, horario: 'VESPERTINO' },
    { id: 3, cicloId: 2, cicloLectivoId: 1, numero: 1, horario: 'NOCHE' },
    { id: 4, cicloId: 3, cicloLectivoId: 1, numero: 1, horario: 'DIURNO' },
    { id: 5, cicloId: 3, cicloLectivoId: 2, numero: 1, horario: 'VESPERTINO' }
];

let TIMEOUT;

window.addEventListener('FormsCreated', (event) => {
//window.addEventListener('DOMContentLoaded', (event) => {
    createAbreviatedNameEventListener();
    promise();
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
    tableLoading();

    Promise.all([
        fetchCiclos(),
        fetchCiclosLectivos(),
        fetchGrupos()
    ]).then(
        ([
            ciclos,
            ciclosLectivos,
            grupos
        ]) => {
            drawTable(ciclos, ciclosLectivos, grupos);
        }
    ).catch((error) => {
        tableFail();
        //drawTable(fetchedCiclos, fetchedCiclosLectivos, fetchedGrupos);
    });
}

function fetchCiclos() {
    return new Promise((res, rej) => {
        fetch('/api/ciclos/all')
        .then(response => {
            if (response.status === 204) res([]);
            else if (response.ok) {
                const data = response.json();
                if (data) return res(data);
                else rej(new Error('No se encontraron ciclos'));
            } else {
                rej(new Error('No se encontraron ciclos'));
            }
        })
        .catch((error) => {
            rej(error);
        });
    });
}

function fetchCiclosLectivos() {
    return new Promise((res, rej) => {
        fetch('/api/ciclos-lectivos/all')
        .then(response => {
            if (response.status === 204) res([]);
            else if (response.ok) {
                const data = response.json();
                if (data) return res(data);
                else rej(new Error('No se encontraron ciclos lectivos'));
            } else {
                rej(new Error('No se encontraron ciclos lectivos'));
            }
        })
        .catch((error) => {
            rej(error);
        });
    });
}

function fetchGrupos() {
    return new Promise((res, rej) => {
        fetch('/api/grupos/all')
        .then(response => {
            if (response.status === 204) res([]);
            else if (response.ok) {
                const data = response.json();
                if (data) return res(data);
                else rej(new Error('No se encontraron grupos'));
            } else {
                rej(new Error('No se encontraron grupos'));
            }
        })
        .catch((error) => {
            rej(error);
        });
    });
}

function tableLoading() {
    const ciclosGridWrapper = document.getElementById('display-grid-wrapper');
    ciclosGridWrapper.innerHTML = "";

    const spinner = document.createElement('div');
    spinner.classList.add('spinner', 'spinner-border', 'text-primary');
    spinner.setAttribute('role', 'status');
    spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';
    ciclosGridWrapper.appendChild(spinner);
}

function tableFail() {
    const ciclosGridWrapper = document.getElementById('display-grid-wrapper');
    ciclosGridWrapper.innerHTML = "";

    const errorMessageSection = document.createElement('div');
    errorMessageSection.id = 'error-message-section';
    errorMessageSection.innerHTML = `
        <svg class="cross-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48" xml:space="preserve">
            <path d="M 40.9706 35.3137 L 29.6569 24 L 40.9706 12.6863 C 42.3848 11.2721 42.3848 8.4437 40.9706 7.0294 S 36.7279 5.6152 35.3137 7.0294 L 24 18.3431 L 12.6863 7.0294 C 11.2721 5.6152 8.4437 5.6152 7.0294 7.0294 S 5.6152 11.2721 7.0294 12.6863 L 18.3431 24 L 7.0294 35.3137 C 5.6152 36.7279 5.6152 39.5563 7.0294 40.9706 S 11.2721 42.3848 12.6863 40.9706 L 24 29.6569 L 35.3137 40.9706 C 36.7279 42.3848 39.5563 42.3848 40.9706 40.9706 S 42.3848 36.7279 40.9706 35.3137 Z"/>
        </svg>
    `;
    ciclosGridWrapper.appendChild(errorMessageSection);

    clearTimeout(TIMEOUT);
    TIMEOUT = setTimeout(() => {
        clearTimeout(TIMEOUT);
        
        tableLoading();
        TIMEOUT = setTimeout(() => {
            promise();
        }, 8000);
    }, 2000);
}

function drawTable(ciclos, ciclosLectivos, grupos) {
    const ciclosList = [];

    console.log(grupos);

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
    lastColumnContent.appendChild(
        createAddSVG(() => {
            addCicloLectivo();
        })
    );

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

        for (let year = 1; year <= ciclo.years; year++, rowIdx++) {
            for (let j = 0; j < ciclosLectivos.length; j++) {
                const cicloLectivo = ciclosLectivos[j];

                // Find grupo for this ciclo, year, cicloLectivo
                const grupo = grupos.find(g => g.cicloId === ciclo.id && g.cicloLectivoId === cicloLectivo.id && g.numero === year);

                const cell = document.createElement('div');
                cell.classList.add('cell', 'hoverable');
                cell.style.gridRow = rowIdx;
                cell.style.gridColumn = j + 2;
                gridData.appendChild(cell);

                const display = grupo ?
                                createFilledCell(year, ciclo, grupo) :
                                createEmptyCell(ciclo, cicloLectivo, year);
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
    lastRowContent.appendChild(
        createAddSVG(() => {
            addCiclo();
        })
    );

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

    cellContent.appendChild(
        createSVG(
            'edit-svg',
            '0 -0.5 25 25',
            'M 20.848 1.879 C 19.676 0.707 17.777 0.707 16.605 1.879 L 2.447 16.036 C 2.029 16.455 1.743 16.988 1.627 17.569 L 1.04 20.505 C 0.76 21.904 1.994 23.138 3.393 22.858 L 6.329 22.271 C 6.909 22.155 7.443 21.869 7.862 21.451 L 22.019 7.293 C 23.191 6.121 23.191 4.222 22.019 3.05 L 20.848 1.879 Z M 18.019 3.293 C 18.41 2.902 19.043 2.902 19.433 3.293 L 20.605 4.465 C 20.996 4.855 20.996 5.488 20.605 5.879 L 6.447 20.036 C 6.308 20.176 6.13 20.271 5.936 20.31 L 3.001 20.897 L 3.588 17.962 C 3.627 17.768 3.722 17.59 3.862 17.451 L 13.933 7.379 L 16.52 9.965 L 17.934 8.56 L 15.348 5.965 L 18.019 3.293 Z',
            () => editCicloLectivo(cicloLectivo)
        )
    );
    cellContent.appendChild(
        createSVG(
            'delete-svg',
            '-6 -6 60 60',
            'M 42 3 H 28 A 2 2 0 0 0 26 1 H 22 A 2 2 0 0 0 20 3 H 6 A 2 2 0 0 0 6 7 H 42 A 2 2 0 0 0 42 3 Z M 37 11 V 43 H 31 V 19 A 1 1 0 0 0 27 19 V 43 H 21 V 19 A 1 1 0 0 0 17 19 V 43 H 11 V 11 A 2 2 0 0 0 7 11 V 45 A 2 2 0 0 0 9 47 H 39 A 2 2 0 0 0 41 45 V 11 A 2 2 0 0 0 37 11 Z',
            () => removeCicloLectivo(cicloLectivo)
        )
    );

    cell.appendChild(cellContent);
    return cell;
}

function createCicloCell(ciclo, rowIdx) {
    const cicloHeader = document.createElement('div');
    cicloHeader.classList.add('cell', 'hoverable', 'sticky', 'cell-row-header');
    cicloHeader.style.gridRow = `${rowIdx} / span ${ciclo.years}`;
    cicloHeader.style.gridColumn = '1';

    const cellContent = document.createElement('div');
    cellContent.classList.add('cell-content', 'cell-row-header');

    // Create title span
    const titleSpan = document.createElement('span');
    titleSpan.classList.add('cell-title');
    titleSpan.textContent = `${ciclo.name} `;
    cellContent.appendChild(titleSpan);
    
    const acronymSpan = document.createElement('span');
    acronymSpan.classList.add('cell-subtitle');
    acronymSpan.textContent = `(${ciclo.acronimo})`;
    titleSpan.appendChild(acronymSpan);

    // Create subtitle spans
    const familiaSubtitleSpan = document.createElement('span');
    familiaSubtitleSpan.classList.add('cell-subtitle');
    familiaSubtitleSpan.textContent = ciclo.familiaProfesional;
    cellContent.appendChild(familiaSubtitleSpan);

    const nivelSubtitleSpan = document.createElement('span');
    nivelSubtitleSpan.classList.add('cell-subtitle');
    nivelSubtitleSpan.textContent = NIVELES[ciclo.nivel];
    cellContent.appendChild(nivelSubtitleSpan);

    const horasSubtitleSpan = document.createElement('span');
    horasSubtitleSpan.classList.add('cell-subtitle');
    horasSubtitleSpan.textContent = ciclo.horasPracticas;
    cellContent.appendChild(horasSubtitleSpan);

    // Create actions span
    const actionsSpan = document.createElement('span');
    actionsSpan.classList.add('cell-actions');
    cellContent.appendChild(actionsSpan);

    actionsSpan.appendChild(
        createSVG(
            'edit-svg',
            '0 -0.5 25 25',
            'M 20.848 1.879 C 19.676 0.707 17.777 0.707 16.605 1.879 L 2.447 16.036 C 2.029 16.455 1.743 16.988 1.627 17.569 L 1.04 20.505 C 0.76 21.904 1.994 23.138 3.393 22.858 L 6.329 22.271 C 6.909 22.155 7.443 21.869 7.862 21.451 L 22.019 7.293 C 23.191 6.121 23.191 4.222 22.019 3.05 L 20.848 1.879 Z M 18.019 3.293 C 18.41 2.902 19.043 2.902 19.433 3.293 L 20.605 4.465 C 20.996 4.855 20.996 5.488 20.605 5.879 L 6.447 20.036 C 6.308 20.176 6.13 20.271 5.936 20.31 L 3.001 20.897 L 3.588 17.962 C 3.627 17.768 3.722 17.59 3.862 17.451 L 13.933 7.379 L 16.52 9.965 L 17.934 8.56 L 15.348 5.965 L 18.019 3.293 Z',
            () => editCiclo(ciclo)
        )
    );
    actionsSpan.appendChild(
        createSVG(
            'delete-svg',
            '-6 -6 60 60',
            'M 42 3 H 28 A 2 2 0 0 0 26 1 H 22 A 2 2 0 0 0 20 3 H 6 A 2 2 0 0 0 6 7 H 42 A 2 2 0 0 0 42 3 Z M 37 11 V 43 H 31 V 19 A 1 1 0 0 0 27 19 V 43 H 21 V 19 A 1 1 0 0 0 17 19 V 43 H 11 V 11 A 2 2 0 0 0 7 11 V 45 A 2 2 0 0 0 9 47 H 39 A 2 2 0 0 0 41 45 V 11 A 2 2 0 0 0 37 11 Z',
            () => removeCiclo(ciclo)
        )
    );

    cicloHeader.appendChild(cellContent);

    return cicloHeader;
}

function createFilledCell(year, ciclo, grupo) {
    const cell = document.createElement('div');
    cell.className = 'cell-content filled-cell';

    // Create title span
    const titleSpan = document.createElement('span');
    titleSpan.classList.add('cell-title');
    titleSpan.textContent = `${year}º ${ciclo.acronimo}`;
    cell.appendChild(titleSpan);

    // Create subtitle span
    const subtitleSpan = document.createElement('span');
    subtitleSpan.classList.add('cell-subtitle');
    subtitleSpan.textContent = HORARIOS[grupo.horario];
    cell.appendChild(subtitleSpan);

    cell.appendChild(
        createSVG(
            'edit-svg',
            '0 -0.5 25 25',
            'M 20.848 1.879 C 19.676 0.707 17.777 0.707 16.605 1.879 L 2.447 16.036 C 2.029 16.455 1.743 16.988 1.627 17.569 L 1.04 20.505 C 0.76 21.904 1.994 23.138 3.393 22.858 L 6.329 22.271 C 6.909 22.155 7.443 21.869 7.862 21.451 L 22.019 7.293 C 23.191 6.121 23.191 4.222 22.019 3.05 L 20.848 1.879 Z M 18.019 3.293 C 18.41 2.902 19.043 2.902 19.433 3.293 L 20.605 4.465 C 20.996 4.855 20.996 5.488 20.605 5.879 L 6.447 20.036 C 6.308 20.176 6.13 20.271 5.936 20.31 L 3.001 20.897 L 3.588 17.962 C 3.627 17.768 3.722 17.59 3.862 17.451 L 13.933 7.379 L 16.52 9.965 L 17.934 8.56 L 15.348 5.965 L 18.019 3.293 Z',
            () => editGrupo(grupo)
        )
    );
    cell.appendChild(
        createSVG(
            'delete-svg',
            '-6 -6 60 60',
            'M 42 3 H 28 A 2 2 0 0 0 26 1 H 22 A 2 2 0 0 0 20 3 H 6 A 2 2 0 0 0 6 7 H 42 A 2 2 0 0 0 42 3 Z M 37 11 V 43 H 31 V 19 A 1 1 0 0 0 27 19 V 43 H 21 V 19 A 1 1 0 0 0 17 19 V 43 H 11 V 11 A 2 2 0 0 0 7 11 V 45 A 2 2 0 0 0 9 47 H 39 A 2 2 0 0 0 41 45 V 11 A 2 2 0 0 0 37 11 Z',
            () => removeGrupo(grupo)
        )
    );

    return cell;
}

function createEmptyCell(ciclo, cicloLectivo, numero) {
    const cell = document.createElement('div');
    cell.className = 'cell-content empty-cell add-element';
    cell.appendChild(
        createAddSVG(() => {
            addGrupo(ciclo, cicloLectivo, numero);
        })
    );
    return cell;
}

function createSVG(className, viewBox, pathData, clickHandler) {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.classList.add(className);
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('xmlns', SVG_NS);
    svg.onclick = clickHandler;

    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', pathData);
    svg.appendChild(path);

    return svg;
}

function createAddSVG(clickHandler) {
    return createSVG(
            'plus-svg',
            '0 0 48 48',
            'M 44 20 L 28 20 L 28 4 C 28 2 26 0 24 0 S 20 2 20 4 L 20 20 L 4 20 C 2 20 0 22 0 24 S 2 28 4 28 L 20 28 L 20 44 C 20 46 22 48 24 48 S 28 46 28 44 L 28 28 L 44 28 C 46 28 48 26 48 24 S 46 20 44 20 Z',
            clickHandler
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
        //form.reset();
    });
}

function addGrupo(ciclo, cicloLectivo, numero) {
    collapseAll();

    const form = Form.getForm('grupo-form');
    form.form.parentNode.classList.remove('collapsed');

    form.onsubmit = (event) => {
        const cicloLectivoId = cicloLectivo.id;
        const cicloId = ciclo.id;
        const numero = form.getInput('grupo-numero').getValue();
        const horario = form.getInput('grupo-horario').getValue();

        let grupo = {
            ciclo: cicloId,
            cicloLectivo: cicloLectivoId,
            numero: numero,
            horario: horario
        };

        fetch('/api/grupos/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(grupo)
        }).then(response => {
            if (response.ok || response.status === 201) {
                promise();
            } else {
                form.showError(`Error al crear el grupo: ${response.text()}`);
                console.log(response.text());
            }
        }).catch(error => {
            console.error('Error al crear el grupo:', error);
            form.showError('Error al crear el grupo');
        });
    }

    form.getInput('grupo-numero').retrack(numero);
    form.getInput('grupo-horario').retrack('');

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
        const years = form.getInput('ciclo-years').getValue();
        const horasPracticas = form.getInput('ciclo-practicas').getValue();

        let ciclo = {
            name: name,
            acronimo: acronimo,
            familiaProfesional: familiaProfesional,
            nivel: nivel,
            years: years,
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
                promise();
            } else {
                form.showError(`Error al crear el ciclo: ${response.text()}`);
                console.log(response.text());
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
    form.getInput('ciclo-years').retrack('');
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

        let cicloLectivo = {
            nombre: name,
            fechaInicio: fechaInicio
        };

        fetch('/api/ciclos-lectivos/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cicloLectivo)
        }).then(response => {
            if (response.ok || response.status === 201) {
                promise();
            } else {
                form.showError(`Error al crear el ciclo lectivo: ${response.text()}`);
                console.log(response.text());
            }
        }).catch(error => {
            console.error('Error al crear el ciclo lectivo:', error);
            form.showError('Error al crear el ciclo lectivo');
        });
    }
    
    form.getInput('ciclo-lectivo-nombre').retrack('');
    form.getInput('ciclo-lectivo-inicio').retrack('');

    form.form.setAttribute('submit-text', 'Crear ciclo lectivo');
    form.submit.textContent = 'Crear ciclo lectivo';
}

function removeGrupo(grupo) {
    if (!confirm(`¿Estás seguro de que quieres eliminar el grupo ${grupo.numero} del ciclo ${grupo.ciclo.nombre} (${grupo.ciclo.acronimo})?`)) {
        return;
    }

    fetch(`/api/grupos/${grupo.id}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            promise();
        } else {
            alert(`Error al eliminar el grupo ${grupo.numero}: ${response.text()}`);
                console.log(response.text());
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
            alert(`Error al eliminar el ciclo ${ciclo.acronimo}: ${response.text()}`);
                console.log(response.text());
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
            alert(`Error al eliminar el ciclo lectivo ${cicloLectivo.nombre}: ${response.text()}`);
                console.log(response.text());
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

    const numero = form.getInput('grupo-numero').getValue();
    const horario = form.getInput('grupo-horario').getValue();

    form.onsubmit = (event) => {
        const data = {
            ciclo: parseInt(grupo.ciclo),
            cicloLectivo: parseInt(grupo.cicloLectivo),
            numero: parseInt(numero),
            horario: horario
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
                promise();
            } else {
                const resp = response.json();
                form.showError(`Error al actualizar el grupo: ${resp.message}`);
                console.log(resp);
            }
        })
        .catch((error) => {
            console.error('Error al actualizar el grupo:', error);
            form.showError('Error al actualizar el grupo');
        });
    }

    form.getInput('grupo-numero').retrack(grupo.numero);
    form.getInput('grupo-horario').retrack(grupo.horario);

    form.form.setAttribute('submit-text', 'Actualizar grupo');
    form.submit.textContent = 'Actualizar grupo';
}

function editCiclo(ciclo) {
    collapseAll();

    const form = Form.getForm('ciclo-form');
    form.form.parentNode.classList.remove('collapsed');

    const name = form.getInput('ciclo-nombre').getValue();
    const acronimo = form.getInput('ciclo-acronimo').getValue();
    const nivel = form.getInput('ciclo-nivel').getValue();
    const familiaProfesional = form.getInput('ciclo-familia').getValue();
    const horasPracticas = form.getInput('ciclo-practicas').getValue();

    form.onsubmit = (event) => {
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
                promise();
            } else {
                form.showError(`Error al actualizar el ciclo: ${response.text()}`);
                console.log(response.text());
            }
        })
        .catch((error) => {
            console.error('Error al actualizar el ciclo:', error);
            form.showError('Error al actualizar el ciclo');
        });
    }

    form.getInput('ciclo-nombre').retrack(ciclo.nombre);
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

    const nombre = form.getInput('ciclo-lectivo-nombre').getValue();
    const inicio = form.getInput('ciclo-lectivo-inicio').getValue();

    form.onsubmit = (event) => {
        const data = {
            nombre: nombre,
            inicio: inicio
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
                promise();
            } else {
                form.showError(`Error al actualizar el ciclo lectivo: ${response.text()}`);
                console.log(response.text());
            }
        })
        .catch((error) => {
            console.error('Error al actualizar el ciclo lectivo:', error);
            form.showError('Error al actualizar el ciclo lectivo');
        });
    }

    form.getInput('ciclo-lectivo-nombre').retrack(cicloLectivo.nombre);
    form.getInput('ciclo-lectivo-fecha-inicio').retrack(cicloLectivo.fechaInicio);

    form.form.setAttribute('submit-text', 'Actualizar ciclo lectivo');
    form.submit.textContent = 'Actualizar ciclo lectivo';
}
