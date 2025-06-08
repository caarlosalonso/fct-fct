let TIMEOUT;

window.addEventListener('DOMContentLoaded', () => {
    cargarEmpresas();
});

async function cargarEmpresas() {
    mostrarCargando();

    try {
        const empresas = await fetchEmpresas();
        dibujarTabla(empresas);
    } catch (error) {
        mostrarError();
        console.error(error);
    }
}

async function fetchEmpresas() {
    const response = await fetch('/api/empresa/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('No se encontraron empresas');
    return await response.json();
}

function mostrarCargando() {
    const wrapper = document.getElementById('display-grid-wrapper');
    wrapper.innerHTML = "";
    const spinner = document.createElement('div');
    spinner.classList.add('spinner', 'spinner-border', 'text-primary');
    spinner.setAttribute('role', 'status');
    spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';
    wrapper.appendChild(spinner);
}

function mostrarError() {
    const wrapper = document.getElementById('display-grid-wrapper');
    wrapper.innerHTML = "";
    const errorMessageSection = document.createElement('div');
    errorMessageSection.id = 'error-message-section';
    errorMessageSection.innerHTML = `
        <svg class="cross-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path d="M 40.9706 35.3137 L 29.6569 24 L 40.9706 12.6863 C 42.3848 11.2721 42.3848 8.4437 40.9706 7.0294 S 36.7279 5.6152 35.3137 7.0294 L 24 18.3431 L 12.6863 7.0294 C 11.2721 5.6152 8.4437 5.6152 7.0294 7.0294 S 5.6152 11.2721 7.0294 12.6863 L 18.3431 24 L 7.0294 35.3137 C 5.6152 36.7279 5.6152 39.5563 7.0294 40.9706 S 11.2721 42.3848 12.6863 40.9706 L 24 29.6569 L 35.3137 40.9706 C 36.7279 42.3848 39.5563 42.3848 40.9706 40.9706 S 42.3848 36.7279 40.9706 35.3137 Z"/>
        </svg>
    `;
    wrapper.appendChild(errorMessageSection);
}

function dibujarTabla(empresas) {
    const wrapper = document.getElementById('display-grid-wrapper');
    wrapper.innerHTML = "";

    // Agrupar empresas por estado
    const estados = {
        pendiente: [],
        denegado: [],
        aceptado: []
    };
    empresas.forEach(e => {
        const estado = (e.estado || '').toLowerCase();
        if (e.estado === 'pendiente') estados.pendiente.push(e);
        else if (e.estado === 'denegado') estados.denegado.push(e);
        else if (e.estado === 'aceptado') estados.aceptado.push(e);
    });

    // Tabla para cada estado
    if (estados.pendiente.length > 0) {
        wrapper.appendChild(crearTituloTabla('Empresas pendientes'));
        wrapper.appendChild(crearGridEmpresas(estados.pendiente));
    }
    if (estados.denegado.length > 0) {
        wrapper.appendChild(crearTituloTabla('Empresas denegadas'));
        wrapper.appendChild(crearGridEmpresas(estados.denegado));
    }
    if (estados.aceptado.length > 0) {
        wrapper.appendChild(crearTituloTabla('Empresas aceptadas'));
        wrapper.appendChild(crearGridEmpresas(estados.aceptado));
    }
}

function crearTituloTabla(texto) {
    const h = document.createElement('h4');
    h.textContent = texto;
    h.style.margin = "20px 0 10px 0";
    return h;
}

function crearGridEmpresas(empresas) {
    const columns = [
        { key: 'nombre', label: 'Nombre' },
        { key: 'cif', label: 'CIF' },
        { key: 'direccion', label: 'Dirección' },
        { key: 'telefono', label: 'Teléfono' },
        { key: 'email', label: 'Email' }
    ];

    const gridData = document.createElement('div');
    gridData.className = 'grid-data';
    gridData.id = ''; // No id para evitar duplicados

    // Cabecera
    columns.forEach((col, idx) => {
        const cell = document.createElement('div');
        cell.classList.add('cell', 'cell-column-header');
        cell.style.gridRow = '1';
        cell.style.gridColumn = `${idx + 1}`;
        cell.textContent = col.label;
        gridData.appendChild(cell);
    });
    // Cabecera acciones
    const cellAcciones = document.createElement('div');
    cellAcciones.classList.add('cell', 'cell-column-header');
    cellAcciones.style.gridRow = '1';
    cellAcciones.style.gridColumn = `${columns.length + 1}`;
    cellAcciones.textContent = 'Acciones';
    gridData.appendChild(cellAcciones);

    // Filas de empresas
    empresas.forEach((empresa, rowIdx) => {
        columns.forEach((col, colIdx) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.gridRow = `${rowIdx + 2}`;
            cell.style.gridColumn = `${colIdx + 1}`;
            cell.textContent = empresa[col.key] || '';
            gridData.appendChild(cell);
        });

        // Celda de acciones
        const cellActions = document.createElement('div');
        cellActions.classList.add('cell');
        cellActions.style.gridRow = `${rowIdx + 2}`;
        cellActions.style.gridColumn = `${columns.length + 1}`;
        cellActions.innerHTML = `
            <svg class="edit-svg" viewBox="0 -0.5 25 25" xmlns="http://www.w3.org/2000/svg" onclick="editarEmpresa('${empresa.id}')">
                <path d="M 20.848 1.879 C 19.676 0.707 17.777 0.707 16.605 1.879 L 2.447 16.036 C 2.029 16.455 1.743 16.988 1.627 17.569 L 1.04 20.505 C 0.76 21.904 1.994 23.138 3.393 22.858 L 6.329 22.271 C 6.909 22.155 7.443 21.869 7.862 21.451 L 22.019 7.293 C 23.191 6.121 23.191 4.222 22.019 3.05 L 20.848 1.879 Z M 18.019 3.293 C 18.41 2.902 19.043 2.902 19.433 3.293 L 20.605 4.465 C 20.996 4.855 20.996 5.488 20.605 5.879 L 6.447 20.036 C 6.308 20.176 6.13 20.271 5.936 20.31 L 3.001 20.897 L 3.588 17.962 C 3.627 17.768 3.722 17.59 3.862 17.451 L 13.933 7.379 L 16.52 9.965 L 17.934 8.56 L 15.348 5.965 L 18.019 3.293 Z"></path>
            </svg>
            <svg class="delete-svg" viewBox="-6 -6 60 60" xmlns="http://www.w3.org/2000/svg" onclick="eliminarEmpresa('${empresa.id}')">
                <path d="M 42 3 H 28 A 2 2 0 0 0 26 1 H 22 A 2 2 0 0 0 20 3 H 6 A 2 2 0 0 0 6 7 H 42 A 2 2 0 0 0 42 3 Z M 37 11 V 43 H 31 V 19 A 1 1 0 0 0 27 19 V 43 H 21 V 19 A 1 1 0 0 0 17 19 V 43 H 11 V 11 A 2 2 0 0 0 7 11 V 45 A 2 2 0 0 0 9 47 H 39 A 2 2 0 0 0 41 45 V 11 A 2 2 0 0 0 37 11 Z"></path>
            </svg>
        `;
        gridData.appendChild(cellActions);
    });

    // Ajustar grid
    gridData.style.display = 'grid';
    gridData.style.gridTemplateRows = `repeat(${empresas.length + 1}, auto)`;
    gridData.style.gridTemplateColumns = `repeat(${columns.length}, minmax(80px, auto)) 80px`;

    return gridData;
}
// Funciones para editar/eliminar (puedes implementar la lógica real)
function editarEmpresa(id) {
    alert('Editar empresa ' + id);
}
function eliminarEmpresa(id) {
    alert('Eliminar empresa ' + id);
}