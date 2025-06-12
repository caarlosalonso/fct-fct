import { Form } from '../classes/Form.js';

window.addEventListener('FormsCreated', (event) => {
    const form = Form.getForm('empresa-form');

    form.onsubmit = () => {
        const empresaNombre = form.getInput('empresa-nombre').getValue();
        const cif = form.getInput('empresa-cif').getValue();
        const telefono = form.getInput('empresa-telefono').getValue();
        const email = form.getInput('empresa-email').getValue();
        const sector = form.getInput('empresa-sector').getValue();
        const address = form.getInput('empresa-address').getValue();
        const personaContacto = form.getInput('empresa-persona-contacto').getValue();
        const observaciones = form.getInput('empresa-observaciones').getValue();

        const data = {
            nombre: empresaNombre,
            cif: cif,
            telefono: telefono,
            email: email,
            sector: sector,
            address: address,
            personaContacto: personaContacto,
            observaciones: `Observaciones del alumno: ${observaciones}`
        }

        fetch('/api/empresa/proponer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            if (response.status === 201) {
                form.showSuccess('Empresa propuesta correctamente');
                form.reset();
            } else {
                form.showError('Error al proponer la empresa');
            }
        })
        .catch((error) => {
            form.showError('Error al enviar los datos: ' + error.message);
        })
        .finally(() => {
            form.submitFinish();
        });
    }
});

