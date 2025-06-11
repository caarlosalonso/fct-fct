import { Form } from '../classes/Form.js';

const FORM = 'info-form';

window.addEventListener('FormsCreated', (event) => {
    promise();
});

function promise() {
    Promise.all([
        fetchSelf()
    ])
    .then(([
        coordinador
    ]) => {
        build(coordinador);
    }).catch((error) => {
        console.error('Error al obtener el coordinador:', error);
    });
}

async function fetchSelf() {
    const response = await fetch('/api/coordinacion/self');
    if (response.status === 204) return null;
    if (!response.ok) throw new Error('Error al obtener el coordinador');
    return await response.json();
}

function build(coordinador) {
    const form = Form.getForm(FORM);

    form.onsubmit = () => {
        const nombre = form.getInput('nombre').getValue();
        const email = form.getInput('email').getValue();

        let updatedCoordinador = {
            name: nombre,
            email: email
        };

        fetch(`/api/coordinacion/update/${coordinador.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCoordinador)
        })
        .then(response => {
            if (response.status === 200) {
                promise();
                form.showSuccess('Su información se ha actualizado correctamente');
            } else {
                form.showError('Error al actualizar sus datos');
                form.submitFinish();
            }
        })
        .catch(error => {
            form.showError('Error al enviar los datos: ' + error.message);
            form.submitFinish();
        });
    };

    form.getInput('nombre').retrack(coordinador.user.name || '');
    form.getInput('email').retrack(coordinador.user.email || '');
}
