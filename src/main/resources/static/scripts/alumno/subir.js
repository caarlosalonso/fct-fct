import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from '../functions.js';

const SECTION = 'reviews-section';

window.addEventListener('FormsCreated', (event) => {
    const form = Form.getForm('alumno-form');
    if (!form) {
        console.error('No se encontró el formulario con ID: alumno-form');
        return;
    }

    form.onsubmit = () => {
        const archivoInput = form.getInput('file');
        if (!archivoInput) {
            console.error('No se encontró el input de archivo con ID: file');
            return;
        }
        const archivo = archivoInput.getValue()[0];
        if (!archivo) {
            resultado.innerText = "Selecciona un archivo.";
            return;
        }
        const select = form.getInput('tipo');
        if (!select) {
            console.error('No se encontró el select con ID: tipo');
            return;
        }
        const valor = select.getValue();
        if (!valor) {
            resultado.innerText = "Selecciona un tipo de archivo.";
            return;
        }

        const formData = new FormData();
        formData.append('archivo', archivo);
        formData.append('tipo', valor);

        fetch('/api/archivo/subir', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
        })
        .then(response => response.text())
        .then(text => {
            form.submitFinish();
            form.showSuccess('Archivo subido correctamente.');
        })
        .catch(error => {
            form.showError('Error al subir el archivo.');
        });
    }
});
