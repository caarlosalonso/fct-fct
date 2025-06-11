import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from '../functions.js';

window.addEventListener('FormsCreated', (event) => {
    promise();
    const form = Form.getForm('info-form');
    form.getInput('nia').validate = function () {
        if (this.input.value.trim().length === 0) return true;
        let nia = this.input.value.trim().toUpperCase();
        return /^\d{8}$/.test(nia);
    }
    form.getInput('nia').getValue = function () {
        let nia = this.input.value.trim().toUpperCase();
        return nia.length === 0 ? null : nia;
    }
    form.getInput('nuss').validate = function () {
        if (this.input.value.trim().length === 0) return true;
        let nuss = this.input.value.trim().toUpperCase();
        return /^\d{11}$/.test(nuss);
    }
    form.getInput('nuss').getValue = function () {
        let nuss = this.input.value.trim().toUpperCase();
        return nuss.length === 0 ? null : nuss;
    }
});

function promise() {
    Promise.all([
        fetchSelf()
    ])
    .then(([
        alumno
    ]) => {
        build(alumno);
    }).catch((error) => {
        console.error('Error al obtener el alumno:', error);
    });
}

async function fetchSelf() {
    const response = await fetch('/api/alumnos/self');
    if (response.status === 204) return null;
    if (!response.ok) throw new Error('Error al obtener el alumno');
    return await response.json();
}

function build(alumno) {
    console.log('Alumno:', alumno);

    const form = Form.getForm('alumno-form');

    form.onsubmit = () => {
        const nombre = form.getInput('nombre').getValue();
        const email = form.getInput('email').getValue();
        const phone = form.getInput('phone').getValue();
        const nia = form.getInput('nia').getValue();
        const dni = form.getInput('dni').getValue();
        const nuss = form.getInput('nuss').getValue();
        const address = form.getInput('address').getValue();
        const convocatoria = form.getInput('convocatoria').getValue();

        let newAlumno = {
            nombreAlumno: nombre,
            email: email,
            dni: dni,
            nia: nia,
            nuss: nuss,
            phone: phone,
            address: address
        };

        fetch(`/api/alumnos/${alumno.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAlumno)
        })
        .then(response => {
            if (response.status === 201) {
                promise();
                form.reset();
                form.submitFinish();
                form.showSuccess('Alumno creado correctamente');
            } else {
                form.showError('Error al crear el alumno');
            }
        })
        .catch(error => {
            form.showError('Error al enviar los datos: ' + error.message);
        });
    };

    form.getInput('nombre').retrack('');
    form.getInput('email').retrack('');
    form.getInput('telefono').retrack(alumno.phone || '');
    form.getInput('nia').retrack(alumno.nia || '');
    form.getInput('dni').retrack(alumno.dni || '');
    form.getInput('nuss').retrack(alumno.nuss || '');
    form.getInput('address').retrack(alumno.address || '');

    form.form.querySelector('.submit-button').textContent = 'Crear alumno';
}
