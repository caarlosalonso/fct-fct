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
        if (estado === 'pendiente') estados.pendiente.push(e);
        else if (estado === 'denegado') estados.denegado.push(e);
        else if (estado === 'aceptado') estados.aceptado.push(e);
    });

    // Helper para crear cada bloque
    function crearBloqueEstado(titulo, lista) {
        const gridWrapper = document.createElement('div');
        gridWrapper.className = 'grid-wrapper collapsible-wrapper';

        // Cabecera clickable
        const header = document.createElement('div');
        header.className = 'collapsible-header';
        header.tabIndex = 0;
        header.innerHTML = `<h4>${titulo} <span class="collapsible-arrow">&#9654;</span></h4>`;

        // Contenido colapsable
        const content = document.createElement('div');
        content.className = 'collapsible-content';
        content.appendChild(crearGridEmpresas(lista));

        // Evento para expandir/colapsar
        header.addEventListener('click', () => {
            content.classList.toggle('active');
            header.querySelector('.collapsible-arrow').classList.toggle('rotated');
        });

        gridWrapper.appendChild(header);
        gridWrapper.appendChild(content);
        return gridWrapper;
    }

    // Tabla para cada estado
    if (estados.pendiente.length > 0) {
        wrapper.appendChild(crearBloqueEstado('Empresas pendientes', estados.pendiente));
    }
    if (estados.aceptado.length > 0) {
        wrapper.appendChild(crearBloqueEstado('Empresas aceptadas', estados.aceptado));
    }
    if (estados.denegado.length > 0) {
        wrapper.appendChild(crearBloqueEstado('Empresas denegadas', estados.denegado));
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
        { key: 'sector', label: 'Sector' },
        { key: 'address', label: 'Dirección' },
        { key: 'telefono', label: 'Teléfono' },
        { key: 'email', label: 'Email' },
        { key: 'persona_contacto', label: 'Persona de Contacto' }
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
        cellActions.appendChild(createSVG(
            '0 -0.5 25 25',
            'M 20.848 1.879 ...', // path edit
            () => editEmpresa(empresa),
            'edit-svg'
        ));
        cellActions.appendChild(createSVG(
            '-6 -6 60 60',
            'M 42 3 H 28 ...', // path delete
            () => removeEmpresa(empresa),
            'delete-svg'
        ));
        gridData.appendChild(cellActions);
    });

    // Ajustar grid
    gridData.style.display = 'grid';
    gridData.style.gridTemplateRows = `repeat(${empresas.length + 1}, auto)`;
    gridData.style.gridTemplateColumns = `repeat(${columns.length}, minmax(80px, auto)) 80px`;

    return gridData;
}

function createSVG(viewBox, pathData, clickHandler, ...classList) {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(SVG_NS, 'svg');
    classList.forEach(cls => svg.classList.add(cls));
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('xmlns', SVG_NS);
    svg.onclick = clickHandler;

    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', pathData);
    svg.appendChild(path);

    return svg;
}

// Funciones para editar/eliminar (puedes implementar la lógica real)
function editarEmpresa(id) {
    alert('Editar empresa ' + id);
}
function eliminarEmpresa(id) {
    alert('Eliminar empresa ' + id);
}

function collapseAll() {
    const form = document.getElementById('empresa-form');
    if (form) form.parentNode.classList.add('collapsed');
}

function finish(form) {
    form.reset();
    if (typeof form.submitFinish === 'function') form.submitFinish();
    collapseAll();
    cargarEmpresas();
}

function editEmpresa(empresa) {
    collapseAll();

    const form = Form.getForm('empresa-form');
    form.form.parentNode.classList.remove('collapsed');

    // Rellenar campos
    form.getInput('empresa-nombre').retrack(empresa.nombre);
    form.getInput('empresa-cif').retrack(empresa.cif);
    form.getInput('empresa-sector').retrack(empresa.sector);
    form.getInput('empresa-address').retrack(empresa.address);
    form.getInput('empresa-telefono').retrack(empresa.telefono);
    form.getInput('empresa-email').retrack(empresa.email);
    form.getInput('empresa-persona_contacto').retrack(empresa.persona_contacto);

    form.form.setAttribute('submit-text', 'Actualizar empresa');
    form.submit.textContent = 'Actualizar empresa';

    form.onsubmit = (event) => {
        const data = {
            nombre: form.getInput('empresa-nombre').getValue(),
            cif: form.getInput('empresa-cif').getValue(),
            sector: form.getInput('empresa-sector').getValue(),
            address: form.getInput('empresa-address').getValue(),
            telefono: form.getInput('empresa-telefono').getValue(),
            email: form.getInput('empresa-email').getValue(),
            persona_contacto: form.getInput('empresa-persona_contacto').getValue()
        };

        fetch(`/api/empresa/${empresa.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                finish(form);
            } else {
                response.text().then(text => {
                    form.showError(`Error al actualizar la empresa: ${text}`);
                });
            }
        })
        .catch(error => {
            console.error('Error al actualizar la empresa:', error);
            form.showError('Error al actualizar la empresa');
        });
    };
}