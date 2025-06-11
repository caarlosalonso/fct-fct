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
        tutor
    ]) => {
        build(tutor);
    }).catch((error) => {
        console.error('Error al obtener el tutor:', error);
    });
}

async function fetchSelf() {
    const response = await fetch('/api/tutores/self');
    if (response.status === 204) return null;
    if (!response.ok) throw new Error('Error al obtener el tutor');
    return await response.json();
}

function build(tutor) {
    const form = Form.getForm(FORM);

    form.onsubmit = () => {
        const nombre = form.getInput('nombre').getValue();
        const email = form.getInput('email').getValue();

        let updatedTutor = {
            name: nombre,
            email: email
        };

        fetch(`/api/tutores/update/${tutor.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTutor)
        })
        .then(response => {
            if (response.status === 201) {
                promise();
                form.reset();
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
    console.log(tutor);
    form.getInput('nombre').retrack(tutor.user.name || '');
    form.getInput('email').retrack(tutor.user.email || '');
}
