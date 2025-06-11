import { Form } from '../classes/Form.js';

window.addEventListener('FormsCreated', (event) => {
    const form = Form.getForm('empresa-form');

    form.onsubmit = () => {
        const empresaNombre = form.getInput('empresa-nombre').getValue();
        const cif = form.getInput('empresa-cif').getValue();
        const telefono = form.getInput('empresa-telefono').getValue();
        const email = form.getInput('empresa-email').getValue();
        const sector = form.getInput('empresa-sector').getValue();
        const direccion = form.getInput('empresa-direccion').getValue();
        const personaContacto = form.getInput('empresa-persona-contacto').getValue();
        const observaciones = form.getInput('empresa-observaciones').getValue();

        const data = {
            nombre: empresaNombre,
            cif: cif,
            telefono: telefono,
            email: email,
            sector: sector,
            direccion: direccion,
            personaContacto: personaContacto,
            observaciones: observaciones
        }

        fetch('/api/empresas/proponer', {
            
        })
    }
});

