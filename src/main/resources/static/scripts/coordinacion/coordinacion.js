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
        const acronimoInput = form.getInput('ciclo-abreviacion');
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

    const ci = fetchCiclos();
    const cile = fetchCiclosLectivos();
    const g = fetchGrupos();

    console.log(ci, cile, g);

    Promise.all([
        ci,
        cile,
        g
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

    const ciclosGridWrapper = document.getElementById('display-grid-wrapper');
    ciclosGridWrapper.innerHTML = "";

    const gridData = document.createElement('div');
    gridData.id = 'grid-data';
    ciclosGridWrapper.appendChild(gridData);

    const numRows = ciclos.length + 2;
    const numColumns = Math.max(ciclosLectivos.length, 2);

    gridData.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
    gridData.style.gridTemplateColumns = `250px repeat(${numColumns}, 1fr) 80px`;

    const topLeftCell = document.createElement('div');
    topLeftCell.classList.add('cell', 'sticky', 'cell-column-header', 'cell-row-header');

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

    const lastColumnContent = document.createElement('div');
    lastColumnContent.classList.add('cell-content', 'empty-cell', 'cell-column-header');
    lastColumnContent.innerHTML = getPlusSvg();
    lastColumnContent.title = "Añadir ciclo lectivo";
    lastColumn.onclick = () => {
        addCicloLectivo();
    };

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
    lastRowContent.innerHTML = getPlusSvg();
    lastRowContent.onclick = () => {
        addCiclo();
    };

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

function getPlusSvg() {
    return `
    <svg class="plus-svg" viewBox="0 0 48 48">
        <path d="M 44 20 L 28 20 L 28 4 C 28 2 26 0 24 0 S 20 2 20 4 L 20 20 L 4 20 C 2 20 0 22 0 24 S 2 28 4 28 L 20 28 L 20 44 C 20 46 22 48 24 48 S 28 46 28 44 L 28 28 L 44 28 C 46 28 48 26 48 24 S 46 20 44 20 Z"/>
    </svg>`;
}

function createCicloLectivoCell(cicloLectivo) {
    const cell = document.createElement('div');
    cell.classList.add('cell', 'hoverable', 'cell-column-header');

    const cellContent = document.createElement('div');
    cellContent.classList.add('cell-content', 'cell-column-header', 'filled-cell');
    cellContent.innerHTML = `
        <span class="cell-title">${cicloLectivo.nombre}</span>
        <span class="cell-subtitle">${cicloLectivo.fechaInicio}</span>
        <svg class="edit-svg" viewBox="0 -0.5 25 25" xmlns="http://www.w3.org/2000/svg">
            <path d="M 13.2942 7.9588 L 13.2942 7.9588 Z M 6.811 14.8488 L 7.379 15.3385 C 7.3849 15.3317 7.3906 15.3248 7.3962 15.3178 L 6.811 14.8488 Z M 6.64 15.2668 L 5.8915 15.2179 L 5.8908 15.2321 L 6.64 15.2668 Z M 6.5 18.2898 L 5.7508 18.2551 C 5.7491 18.2923 5.7501 18.3296 5.754 18.3667 L 6.5 18.2898 Z M 7.287 18.9768 L 7.3115 19.7264 C 7.3615 19.7247 7.4113 19.7181 7.46 19.7065 L 7.287 18.9768 Z M 10.287 18.2658 L 10.46 18.9956 L 10.4716 18.9927 L 10.287 18.2658 Z M 10.672 18.0218 L 11.2506 18.4991 L 11.2571 18.491 L 10.672 18.0218 Z M 17.2971 10.959 L 17.2971 10.959 Z M 12.1269 7.0205 L 12.1269 7.0205 Z M 14.3 5.5098 L 14.8851 5.979 C 14.8949 5.9667 14.9044 5.9541 14.9135 5.9412 L 14.3 5.5098 Z M 15.929 5.1898 L 16.4088 4.6133 C 16.3849 4.5934 16.3598 4.5751 16.3337 4.5583 L 15.929 5.1898 Z M 18.166 7.0518 L 18.6968 6.5219 C 18.6805 6.5056 18.6635 6.4901 18.6458 6.4753 L 18.166 7.0518 Z M 18.5029 7.8726 L 19.2529 7.8768 V 7.8768 L 18.5029 7.8726 Z M 18.157 8.6898 L 17.632 8.1541 C 17.6108 8.175 17.5908 8.197 17.5721 8.2203 Z M 16.1271 10.0203 L 16.1271 10.0203 Z M 13.4537 7.3786 L 13.4537 7.3786 Z M 16.813 11.2329 L 16.813 11.2329 Z M 12.1238 7.0207 L 6.2258 14.3797 L 7.3962 15.3178 L 13.2942 7.9588 Z M 6.243 14.359 C 6.0356 14.5995 5.9123 14.9011 5.8916 15.218 L 7.3884 15.3156 C 7.3879 15.324 7.3846 15.3321 7.379 15.3385 L 6.243 14.359 Z M 5.8908 15.2321 L 5.7508 18.2551 L 7.2492 18.3245 L 7.3892 15.3015 L 5.8908 15.2321 Z M 5.754 18.3667 C 5.8356 19.1586 6.5159 19.7524 7.3115 19.7264 L 7.2625 18.2272 C 7.2593 18.2273 7.2577 18.2268 7.2567 18.2264 C 7.2553 18.2259 7.2534 18.2249 7.2514 18.2232 C 7.2495 18.2215 7.2482 18.2198 7.2475 18.2185 C 7.247 18.2175 7.2464 18.216 7.246 18.2128 L 5.754 18.3667 Z M 7.46 19.7065 L 10.46 18.9955 L 10.114 17.536 L 7.114 18.247 L 7.46 19.7065 Z M 10.4716 18.9927 C 10.7771 18.9151 11.05 18.7422 11.2506 18.499 L 10.0934 17.5445 C 10.0958 17.5417 10.0989 17.5397 10.1024 17.5388 L 10.4716 18.9927 Z M 11.2571 18.491 L 17.2971 10.959 L 16.1269 10.0206 L 10.0869 17.5526 L 11.2571 18.491 Z M 13.2971 7.959 L 14.8851 5.979 L 13.7149 5.0405 L 12.1269 7.0205 Z M 14.9135 5.9412 C 15.0521 5.7441 15.3214 5.6912 15.5243 5.8212 L 16.3337 4.5583 C 15.4544 3.9948 14.2873 4.2241 13.6865 5.0783 L 14.9135 5.9412 Z M 15.4492 5.7662 L 17.6862 7.6282 L 18.6458 6.4753 L 16.4088 4.6133 L 15.4492 5.7662 Z M 17.6352 7.5816 C 17.7111 7.6577 17.7535 7.761 17.7529 7.8685 L 19.2529 7.8768 C 19.2557 7.369 19.0555 6.8813 18.6968 6.5219 L 17.6352 7.5816 Z M 17.7529 7.8685 C 17.7524 7.976 17.7088 8.0789 17.632 8.1541 L 18.682 9.2254 C 19.0446 8.87 19.2501 8.3845 19.2529 7.8768 L 17.7529 7.8685 Z M 17.5721 8.2203 L 16.1271 10.0203 L 17.2969 10.9593 L 18.7419 9.1593 L 17.5721 8.2203 Z M 11.9703 7.6009 C 12.3196 9.9322 14.4771 11.5503 16.813 11.2329 L 16.611 9.7466 C 15.0881 9.9535 13.6815 8.8986 13.4537 7.3786 Z"/>
        </svg>
        <svg class="delete-svg" viewBox="-6 -6 60 60" xmlns="http://www.w3.org/2000/svg">
            <path d="M 42 3 H 28 a 2 2 0 0 0 -2 -2 H 22 a 2 2 0 0 0 -2 2 H 6 A 2 2 0 0 0 6 7 H 42 a 2 2 0 0 0 0 -4 Z M 39 9 a 2 2 0 0 0 -2 2 V 43 H 11 V 11 a 2 2 0 0 0 -4 0 V 45 a 2 2 0 0 0 2 2 H 39 a 2 2 0 0 0 2 -2 V 11 A 2 2 0 0 0 39 9 Z M 21 37 V 19 a 2 2 0 0 0 -4 0 V 37 a 2 2 0 0 0 4 0 Z M 31 37 V 19 a 2 2 0 0 0 -4 0 V 37 a 2 2 0 0 0 4 0 Z"/>
        </svg>
    `;
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
    cellContent.innerHTML = `
        <span class="cell-title">${ciclo.name} <span class="cell-subtitle">(${ciclo.acronimo})</span></span>
        <span class="cell-subtitle">${ciclo.familiaProfesional}</span>
        <span class="cell-subtitle">${CICLOS[ciclo.nivel]}</span>
        <span class="cell-subtitle">${ciclo.horasPracticas}</span>
        <span class="cell-actions">
            <svg class="edit-svg" viewBox="0 -0.5 25 25" xmlns="http://www.w3.org/2000/svg">
                <path d="M 13.2942 7.9588 L 13.2942 7.9588 Z M 6.811 14.8488 L 7.379 15.3385 C 7.3849 15.3317 7.3906 15.3248 7.3962 15.3178 L 6.811 14.8488 Z M 6.64 15.2668 L 5.8915 15.2179 L 5.8908 15.2321 L 6.64 15.2668 Z M 6.5 18.2898 L 5.7508 18.2551 C 5.7491 18.2923 5.7501 18.3296 5.754 18.3667 L 6.5 18.2898 Z M 7.287 18.9768 L 7.3115 19.7264 C 7.3615 19.7247 7.4113 19.7181 7.46 19.7065 L 7.287 18.9768 Z M 10.287 18.2658 L 10.46 18.9956 L 10.4716 18.9927 L 10.287 18.2658 Z M 10.672 18.0218 L 11.2506 18.4991 L 11.2571 18.491 L 10.672 18.0218 Z M 17.2971 10.959 L 17.2971 10.959 Z M 12.1269 7.0205 L 12.1269 7.0205 Z M 14.3 5.5098 L 14.8851 5.979 C 14.8949 5.9667 14.9044 5.9541 14.9135 5.9412 L 14.3 5.5098 Z M 15.929 5.1898 L 16.4088 4.6133 C 16.3849 4.5934 16.3598 4.5751 16.3337 4.5583 L 15.929 5.1898 Z M 18.166 7.0518 L 18.6968 6.5219 C 18.6805 6.5056 18.6635 6.4901 18.6458 6.4753 L 18.166 7.0518 Z M 18.5029 7.8726 L 19.2529 7.8768 V 7.8768 L 18.5029 7.8726 Z M 18.157 8.6898 L 17.632 8.1541 C 17.6108 8.175 17.5908 8.197 17.5721 8.2203 Z M 16.1271 10.0203 L 16.1271 10.0203 Z M 13.4537 7.3786 L 13.4537 7.3786 Z M 16.813 11.2329 L 16.813 11.2329 Z M 12.1238 7.0207 L 6.2258 14.3797 L 7.3962 15.3178 L 13.2942 7.9588 Z M 6.243 14.359 C 6.0356 14.5995 5.9123 14.9011 5.8916 15.218 L 7.3884 15.3156 C 7.3879 15.324 7.3846 15.3321 7.379 15.3385 L 6.243 14.359 Z M 5.8908 15.2321 L 5.7508 18.2551 L 7.2492 18.3245 L 7.3892 15.3015 L 5.8908 15.2321 Z M 5.754 18.3667 C 5.8356 19.1586 6.5159 19.7524 7.3115 19.7264 L 7.2625 18.2272 C 7.2593 18.2273 7.2577 18.2268 7.2567 18.2264 C 7.2553 18.2259 7.2534 18.2249 7.2514 18.2232 C 7.2495 18.2215 7.2482 18.2198 7.2475 18.2185 C 7.247 18.2175 7.2464 18.216 7.246 18.2128 L 5.754 18.3667 Z M 7.46 19.7065 L 10.46 18.9955 L 10.114 17.536 L 7.114 18.247 L 7.46 19.7065 Z M 10.4716 18.9927 C 10.7771 18.9151 11.05 18.7422 11.2506 18.499 L 10.0934 17.5445 C 10.0958 17.5417 10.0989 17.5397 10.1024 17.5388 L 10.4716 18.9927 Z M 11.2571 18.491 L 17.2971 10.959 L 16.1269 10.0206 L 10.0869 17.5526 L 11.2571 18.491 Z M 13.2971 7.959 L 14.8851 5.979 L 13.7149 5.0405 L 12.1269 7.0205 Z M 14.9135 5.9412 C 15.0521 5.7441 15.3214 5.6912 15.5243 5.8212 L 16.3337 4.5583 C 15.4544 3.9948 14.2873 4.2241 13.6865 5.0783 L 14.9135 5.9412 Z M 15.4492 5.7662 L 17.6862 7.6282 L 18.6458 6.4753 L 16.4088 4.6133 L 15.4492 5.7662 Z M 17.6352 7.5816 C 17.7111 7.6577 17.7535 7.761 17.7529 7.8685 L 19.2529 7.8768 C 19.2557 7.369 19.0555 6.8813 18.6968 6.5219 L 17.6352 7.5816 Z M 17.7529 7.8685 C 17.7524 7.976 17.7088 8.0789 17.632 8.1541 L 18.682 9.2254 C 19.0446 8.87 19.2501 8.3845 19.2529 7.8768 L 17.7529 7.8685 Z M 17.5721 8.2203 L 16.1271 10.0203 L 17.2969 10.9593 L 18.7419 9.1593 L 17.5721 8.2203 Z M 11.9703 7.6009 C 12.3196 9.9322 14.4771 11.5503 16.813 11.2329 L 16.611 9.7466 C 15.0881 9.9535 13.6815 8.8986 13.4537 7.3786 Z"/>
            </svg>
            <svg class="delete-svg" viewBox="-6 -6 60 60" xmlns="http://www.w3.org/2000/svg">
                <path d="M 42 3 H 28 a 2 2 0 0 0 -2 -2 H 22 a 2 2 0 0 0 -2 2 H 6 A 2 2 0 0 0 6 7 H 42 a 2 2 0 0 0 0 -4 Z M 39 9 a 2 2 0 0 0 -2 2 V 43 H 11 V 11 a 2 2 0 0 0 -4 0 V 45 a 2 2 0 0 0 2 2 H 39 a 2 2 0 0 0 2 -2 V 11 A 2 2 0 0 0 39 9 Z M 21 37 V 19 a 2 2 0 0 0 -4 0 V 37 a 2 2 0 0 0 4 0 Z M 31 37 V 19 a 2 2 0 0 0 -4 0 V 37 a 2 2 0 0 0 4 0 Z"/>
            </svg>
        </span>
    `;

    cicloHeader.appendChild(cellContent);
    return cicloHeader;
}

function createFilledCell(year, ciclo, grupo) {
    const cell = document.createElement('div');
    cell.className = 'cell-content filled-cell';
    cell.innerHTML = `
        <span class="cell-title">${year}º ${ciclo.acronimo}</span>
        <span class="cell-subtitle">${HORARIOS[grupo.horario]}</span>
        <svg class="edit-svg" onclick="editGrupo(${grupo})" viewBox="0 -0.5 25 25" xmlns="http://www.w3.org/2000/svg">
            <path d="M 13.2942 7.9588 L 13.2942 7.9588 Z M 6.811 14.8488 L 7.379 15.3385 C 7.3849 15.3317 7.3906 15.3248 7.3962 15.3178 L 6.811 14.8488 Z M 6.64 15.2668 L 5.8915 15.2179 L 5.8908 15.2321 L 6.64 15.2668 Z M 6.5 18.2898 L 5.7508 18.2551 C 5.7491 18.2923 5.7501 18.3296 5.754 18.3667 L 6.5 18.2898 Z M 7.287 18.9768 L 7.3115 19.7264 C 7.3615 19.7247 7.4113 19.7181 7.46 19.7065 L 7.287 18.9768 Z M 10.287 18.2658 L 10.46 18.9956 L 10.4716 18.9927 L 10.287 18.2658 Z M 10.672 18.0218 L 11.2506 18.4991 L 11.2571 18.491 L 10.672 18.0218 Z M 17.2971 10.959 L 17.2971 10.959 Z M 12.1269 7.0205 L 12.1269 7.0205 Z M 14.3 5.5098 L 14.8851 5.979 C 14.8949 5.9667 14.9044 5.9541 14.9135 5.9412 L 14.3 5.5098 Z M 15.929 5.1898 L 16.4088 4.6133 C 16.3849 4.5934 16.3598 4.5751 16.3337 4.5583 L 15.929 5.1898 Z M 18.166 7.0518 L 18.6968 6.5219 C 18.6805 6.5056 18.6635 6.4901 18.6458 6.4753 L 18.166 7.0518 Z M 18.5029 7.8726 L 19.2529 7.8768 V 7.8768 L 18.5029 7.8726 Z M 18.157 8.6898 L 17.632 8.1541 C 17.6108 8.175 17.5908 8.197 17.5721 8.2203 Z M 16.1271 10.0203 L 16.1271 10.0203 Z M 13.4537 7.3786 L 13.4537 7.3786 Z M 16.813 11.2329 L 16.813 11.2329 Z M 12.1238 7.0207 L 6.2258 14.3797 L 7.3962 15.3178 L 13.2942 7.9588 Z M 6.243 14.359 C 6.0356 14.5995 5.9123 14.9011 5.8916 15.218 L 7.3884 15.3156 C 7.3879 15.324 7.3846 15.3321 7.379 15.3385 L 6.243 14.359 Z M 5.8908 15.2321 L 5.7508 18.2551 L 7.2492 18.3245 L 7.3892 15.3015 L 5.8908 15.2321 Z M 5.754 18.3667 C 5.8356 19.1586 6.5159 19.7524 7.3115 19.7264 L 7.2625 18.2272 C 7.2593 18.2273 7.2577 18.2268 7.2567 18.2264 C 7.2553 18.2259 7.2534 18.2249 7.2514 18.2232 C 7.2495 18.2215 7.2482 18.2198 7.2475 18.2185 C 7.247 18.2175 7.2464 18.216 7.246 18.2128 L 5.754 18.3667 Z M 7.46 19.7065 L 10.46 18.9955 L 10.114 17.536 L 7.114 18.247 L 7.46 19.7065 Z M 10.4716 18.9927 C 10.7771 18.9151 11.05 18.7422 11.2506 18.499 L 10.0934 17.5445 C 10.0958 17.5417 10.0989 17.5397 10.1024 17.5388 L 10.4716 18.9927 Z M 11.2571 18.491 L 17.2971 10.959 L 16.1269 10.0206 L 10.0869 17.5526 L 11.2571 18.491 Z M 13.2971 7.959 L 14.8851 5.979 L 13.7149 5.0405 L 12.1269 7.0205 Z M 14.9135 5.9412 C 15.0521 5.7441 15.3214 5.6912 15.5243 5.8212 L 16.3337 4.5583 C 15.4544 3.9948 14.2873 4.2241 13.6865 5.0783 L 14.9135 5.9412 Z M 15.4492 5.7662 L 17.6862 7.6282 L 18.6458 6.4753 L 16.4088 4.6133 L 15.4492 5.7662 Z M 17.6352 7.5816 C 17.7111 7.6577 17.7535 7.761 17.7529 7.8685 L 19.2529 7.8768 C 19.2557 7.369 19.0555 6.8813 18.6968 6.5219 L 17.6352 7.5816 Z M 17.7529 7.8685 C 17.7524 7.976 17.7088 8.0789 17.632 8.1541 L 18.682 9.2254 C 19.0446 8.87 19.2501 8.3845 19.2529 7.8768 L 17.7529 7.8685 Z M 17.5721 8.2203 L 16.1271 10.0203 L 17.2969 10.9593 L 18.7419 9.1593 L 17.5721 8.2203 Z M 11.9703 7.6009 C 12.3196 9.9322 14.4771 11.5503 16.813 11.2329 L 16.611 9.7466 C 15.0881 9.9535 13.6815 8.8986 13.4537 7.3786 Z"/>
        </svg>
        <svg class="delete-svg" onclick="deleteGroup(${grupo})" viewBox="-6 -6 60 60" xmlns="http://www.w3.org/2000/svg">
            <path d="M 42 3 H 28 a 2 2 0 0 0 -2 -2 H 22 a 2 2 0 0 0 -2 2 H 6 A 2 2 0 0 0 6 7 H 42 a 2 2 0 0 0 0 -4 Z M 39 9 a 2 2 0 0 0 -2 2 V 43 H 11 V 11 a 2 2 0 0 0 -4 0 V 45 a 2 2 0 0 0 2 2 H 39 a 2 2 0 0 0 2 -2 V 11 A 2 2 0 0 0 39 9 Z M 21 37 V 19 a 2 2 0 0 0 -4 0 V 37 a 2 2 0 0 0 4 0 Z M 31 37 V 19 a 2 2 0 0 0 -4 0 V 37 a 2 2 0 0 0 4 0 Z"/>
        </svg>
    `;
    return cell;
}

function createEmptyCell(ciclo, cicloLectivo, numero) {
    const cell = document.createElement('div');
    cell.className = 'cell-content empty-cell add-element';
    cell.innerHTML = getPlusSvg();
    cell.onclick = addGrupo.bind(null, ciclo, cicloLectivo, numero);
    return cell;
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
        event.preventDefault();

        const cicloLectivoId = cicloLectivo.id;
        const cicloId = ciclo.id;
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
                form.showError('Error al crear el grupo');
            }
        }).catch(error => {
            console.error('Error al crear el grupo:', error);
            form.showError('Error al crear el grupo');
        });
    }
}

function addCiclo() {
    collapseAll();

    const form = Form.getForm('ciclo-form');
    form.form.parentNode.classList.remove('collapsed');

    form.onsubmit = (event) => {
        const name = form.getInput('ciclo-nombre').getValue();
        const acronimo = form.getInput('ciclo-abreviacion').getValue();
        const familiaProfesional = form.getInput('ciclo-familia').getValue();
        const nivel = form.getInput('ciclo-nivel').getValue();
        const years = form.getInput('ciclo-years').getValue();
        const horasPracticas = form.getInput('ciclo-practicas').getValue();

        let ciclo = {
            nombre: name,
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
                form.showError('Error al crear el ciclo');
            }
        }).catch(error => {
            console.error('Error al crear el ciclo:', error);
            form.showError('Error al crear el ciclo');
        });
    }
}

function addCicloLectivo() {
    collapseAll();

    const form = Form.getForm('ciclo-lectivo-form');
    form.form.parentNode.classList.remove('collapsed');

    form.onsubmit = (event) => {
        const name = form.getInput('ciclo-lectivo-nombre').getValue();
        const fechaInicio = form.getInput('ciclo-lectivo-fecha-inicio').getValue();

        let cicloLectivo = {
            nombre: name,
            fechaInicio: fechaInicio
        };

        fetch('/api/ciclosLectivos/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cicloLectivo)
        }).then(response => {
            if (response.ok || response.status === 201) {
                promise();
            } else {
                form.showError('Error al crear el ciclo lectivo');
            }
        }).catch(error => {
            console.error('Error al crear el ciclo lectivo:', error);
            form.showError('Error al crear el ciclo lectivo');
        });
    }
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
            alert('Error al eliminar el grupo');
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
            alert('Error al eliminar el ciclo');
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

    fetch(`/api/ciclosLectivos/${cicloLectivo.id}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            promise();
        } else {
            alert('Error al eliminar el ciclo lectivo');
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

    form.getInput('grupo-id').setValue(grupo.id);
    form.getInput('grupo-numero').setValue(grupo.numero);
    form.getInput('grupo-ciclo').setValue(grupo.ciclo.id);
    form.getInput('grupo-ciclo-lectivo').setValue(grupo.cicloLectivo.id);
    form.getInput('grupo-horario').setValue(grupo.horario);

    form.onsubmit = (event) => {
        event.preventDefault();
        // Aquí se puede agregar la lógica para actualizar el grupo
    }
}

function editCiclo(ciclo) {
    collapseAll();

    const form = Form.getForm('ciclo-form');
    form.form.parentNode.classList.remove('collapsed');

    form.getInput('ciclo-id').setValue(ciclo.id);
    form.getInput('ciclo-nombre').setValue(ciclo.nombre);
    form.getInput('ciclo-acronimo').setValue(ciclo.acronimo);
    form.getInput('ciclo-nivel').setValue(ciclo.nivel);
    form.getInput('ciclo-anos').setValue(ciclo.years);

    form.onsubmit = (event) => {
        event.preventDefault();
        // Aquí se puede agregar la lógica para actualizar el ciclo
    }
}

function editCicloLectivo(cicloLectivo) {
    collapseAll();

    const form = Form.getForm('ciclo-lectivo-form');
    form.form.parentNode.classList.remove('collapsed');

    form.getInput('ciclo-lectivo-id').setValue(cicloLectivo.id);
    form.getInput('ciclo-lectivo-nombre').setValue(cicloLectivo.nombre);
    form.getInput('ciclo-lectivo-fecha-inicio').setValue(cicloLectivo.fechaInicio);

    form.onsubmit = (event) => {
        event.preventDefault();
        // Aquí se puede agregar la lógica para actualizar el ciclo lectivo
    }
}
