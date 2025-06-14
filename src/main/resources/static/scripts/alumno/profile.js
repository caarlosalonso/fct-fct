import { Form } from '../classes/Form.js';

const FORM = 'info-form';

window.addEventListener('FormsCreated', (event) => {
    promise();
    const form = Form.getForm(FORM);
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
    const form = Form.getForm(FORM);

    form.onsubmit = () => {
        const nombre = form.getInput('nombre').getValue();
        const email = form.getInput('email').getValue();
        const telefono = form.getInput('telefono').getValue();
        const nia = form.getInput('nia').getValue();
        const dni = form.getInput('dni').getValue();
        const nuss = form.getInput('nuss').getValue();
        const address = form.getInput('address').getValue();

        let updatedAlumno = {
            name: nombre,
            email: email,
            phone: telefono,
            nia: nia,
            dni: dni,
            nuss: nuss,
            address: address
        };

        fetch(`/api/alumnos/update/${alumno.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedAlumno)
        })
        .then(response => {
            if (response.status === 200) {
                promise();
                form.showSuccess('Tu información se ha actualizado correctamente');
            } else {
                form.showError('Error al actualizar tus datos');
            }
        })
        .catch(error => {
            form.showError('Error al enviar los datos: ' + error.message);
        })
        .finally(() => {
            form.submitFinish();
        });
    };

    form.getInput('nombre').retrack(alumno.user.name || '');
    form.getInput('email').retrack(alumno.user.email || '');
    form.getInput('telefono').retrack(alumno.phone || '');
    form.getInput('nia').retrack(alumno.nia || '');
    form.getInput('dni').retrack(alumno.dni || '');
    form.getInput('nuss').retrack(alumno.nuss || '');
    form.getInput('address').retrack(alumno.address || '');
}
