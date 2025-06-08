import { Form } from './../classes/Form.js';
import { Input } from './../classes/Input.js';

window.addEventListener('FormsCreated', () => {
    const form = Form.getForm('password-form');

    if (!form) {
        console.error('Password form not found');
        return;
    }

    const currentPassword = form.getInput('current-password');
    const newPassword = form.getInput('new-password');
    const confirmPassword = form.getInput('confirm-password');

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
        return currentPassword.getValue() !== newPassword.getValue();
    }

    newPassword.validate = () => {
        if (newPassword.isEmpty()) return true;
        if (newPassword.getLength() < 8) return false;
        if (newPassword.getValue() === currentPassword.getValue()) return false;
        return newPassword.getValue() === confirmPassword.getValue();
    }

    confirmPassword.validate = () => {
        if (confirmPassword.isEmpty()) return true;
        return confirmPassword.getValue() === newPassword.getValue();
    }

    currentPassword.input.addEventListener('input', updateValidity);
    newPassword.input.addEventListener('input', updateValidity);
    confirmPassword.input.addEventListener('input', updateValidity);

    function updateValidity() {
        currentPassword.showValidity();
        newPassword.showValidity();
        confirmPassword.showValidity();
    }
});
