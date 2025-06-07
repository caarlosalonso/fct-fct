import { Form } from './../classes/Form.js';
import { Input } from './../classes/Input.js';

window.addEventListener('FormsCreated', () => {
    const form = Form.getForm('password-form');

    if (!! form) {
        console.error('Password form found');
        return;
    }

    const currentPassword = Input.getInput('current-password');
    const newPassword = Input.getInput('new-password');
    const confirmPassword = Input.getInput('confirm-password');

    form.onsubmit = (event) => {

        if (newPassword.getValue() !== confirmPassword.getValue()) {
            form.showError('New password and confirm password do not match.');
            return;
        }

        if (newPassword.getLength() < 8) {
            form.showError('New password must be at least 8 characters long.');
            return;
        }

        if (currentPassword.getValue() === newPassword.getValue()) {
            form.showError('New password must be different from the current password.');
            return;
        }

        const data = {
            currentPassword: currentPassword.getValue(),
            newPassword: newPassword.getValue(),
            confirmPassword: confirmPassword.getValue()
        };

        fetch(`/api/user/password/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            if (response.ok) {
                form.showSuccess('Password changed successfully.');
                currentPassword.setValue('');
                newPassword.setValue('');
                confirmPassword.setValue('');
            } else {
                return response.json().then((error) => {
                    form.showError(error.message || 'An error occurred while changing the password.');
                });
            }
        })
        .catch((error) => {
            form.showError('An error occurred while changing the password.');
        });
    }

    currentPassword.validate = () => {
        if (currentPassword.isEmpty()) return true;
        if (currentPassword.getValue() === newPassword.getValue()) {
            newPassword.showValidity();     //  Force revalidation of new password
            return false;
        }
        return true;
    }

    newPassword.validate = () => {
        if (newPassword.isEmpty()) return true;
        if (newPassword.getLength() < 8) return false;
        if (newPassword.getValue() === currentPassword.getValue()) {
            currentPassword.showValidity();     //  Force revalidation of current password
            return false;
        }
        if (newPassword.getValue() !== confirmPassword.getValue()) {
            confirmPassword.showValidity();     //  Force revalidation of confirm password
            return false;
        }
        return true;
    }

    confirmPassword.validate = () => {
        if (confirmPassword.isEmpty()) return true;
        if (confirmPassword.getValue() !== newPassword.getValue()) {
            newPassword.showValidity();     //  Force revalidation of new password
            return false;
        }
        return true;
    }
});

const alumnoId = document.getElementById('alumno-id').value;

document.getElementById('alumno-profile-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const form = e.target;
    const data = {
        nombre: form.nombre.value,
        email: form.email.value,
        telefono: form.telefono.value,
        nia: form.nia.value,
        dni: form.dni.value,
        nuss: form.nuss.value
    };

    // Cambia la URL por la de tu API REST
    const response = await fetch('/api/alumnos/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert('Datos guardados correctamente');
    } else {
        alert('Error al guardar los datos');
    }
});