import { Form } from './classes/Form.js';

window.addEventListener('FormsCreated', (event) => {
    const form = Form.getForm('login-form');
    if (! form) {
        console.error("Form with ID 'login-form' not found.");
        return;
    }

    form.onsubmit = () => {
        console.log("Form sent");

        const email = form.getInput('email').getValue();
        const password = form.getInput('password').getValue();

        // Information to be sent
        const data = {
            email: email,
            password: password,
        };

        fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (response.ok) {
                form.showSuccess('Login exitoso.');
                window.location.href = '/index';
            } else {
                form.showError('Login fallido: Email o contraseña incorrectos.');
            }
            form.submitFinish();
        })
        .catch(error => {
            form.showError('Internal Server Error');
            form.submitFinish();
        });
    }
});
