let TIMEOUT;

        window.addEventListener('DOMContentLoaded', () => {
            promise();
        });

        function promise() {
            tableLoading();

            fetchEmpresas()
                .then(empresas => {
                    drawTable(empresas);
                })
                .catch(error => {
                    tableFail();
                    console.error(error);
                });
        }

        async function fetchEmpresas() {
        const response = await fetch('/api/empresa/all');
        if (response.status === 204) return [];
        if (!response.ok) throw new Error('No se encontraron empresas');
        return await response.json();
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

        function drawTable(empresas) {
            const wrapper = document.getElementById('display-grid-wrapper');
    wrapper.innerHTML = "";

    const gridData = document.createElement('div');
    gridData.id = 'grid-data';
    wrapper.appendChild(gridData);

    // Define columnas que quieres mostrar
    const columns = [
        { key: 'nombre', label: 'Nombre' },
        { key: 'cif', label: 'CIF' },
        { key: 'direccion', label: 'Dirección' },
        { key: 'telefono', label: 'Teléfono' },
        { key: 'email', label: 'Email' }
    ];

    // Header
    columns.forEach((col, idx) => {
        const cell = document.createElement('div');
        cell.classList.add('cell', 'cell-column-header');
        cell.style.gridRow = '1';
        cell.style.gridColumn = `${idx + 1}`;
        cell.textContent = col.label;
        gridData.appendChild(cell);
    });

    // Rows
    empresas.forEach((empresa, rowIdx) => {
        columns.forEach((col, colIdx) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.gridRow = `${rowIdx + 2}`;
            cell.style.gridColumn = `${colIdx + 1}`;
            cell.textContent = empresa[col.key] || '';
            gridData.appendChild(cell);
        });
    });

    // Grid CSS
    gridData.style.display = 'grid';
    gridData.style.gridTemplateRows = `repeat(${empresas.length + 1}, 1fr)`;
    gridData.style.gridTemplateColumns = `repeat(${columns.length}, 1fr)`;

    }