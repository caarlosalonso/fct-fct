import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from '../functions.js';

const SECTION = 'reviews-section';

window.addEventListener('DOMContentLoaded', (event) => {
    promise();
});

function promise() {
    Promise.all([
        fetchEmpresas()
    ])
    .then(([
        empresas
    ]) => {
        build(empresas);
    }).catch((error) => {
        console.error('Error al obtener las empresas:', error);
    });
}

async function fetchEmpresas() {
    const response = await fetch('/api/vista-empresas-plazas/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener las empresas');
    return await response.json();
}

function build(empresas) {
    console.log('Empresas:', empresas);
}
