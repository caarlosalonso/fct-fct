import { Form } from './classes/Form.js';

    window.addEventListener('FormsCreated', (event) => {
        const form = Form.getForm('user-creation');
        if (! form) {
            console.error("Form with ID 'user-creation' not found.");
            return;
        }

        form.onsubmit = () => {
            const nombre = form.getInput('nombre').getValue();
            const email = form.getInput('email').getValue();
            const role = form.getInput('role').getValue();
            const password = form.getInput('password').getValue();

            const data = {
                name: nombre,
                email: email,
                role: role,
                password: password
            };

            fetch('/api/coordinacion/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.status === 201) {
                    form.showSuccess('Usuario creado correctamente.');
                    form.submitFinish();
                    form.reset();
                } else if (response.status === 409) {
                    form.showError('El correo electrónico ya está en uso.');
                } else {
                    form.showError('Error al crear el usuario. Por favor, inténtalo de nuevo.');
                }
            })
            .catch(error => {
                form.showError('Error al crear el usuario. Por favor, inténtalo de nuevo.');
            });
        }
    });
