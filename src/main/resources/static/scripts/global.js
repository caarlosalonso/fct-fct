import { Form } from './classes/Form.js';

document.addEventListener('DOMContentLoaded', (event) => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => new Form(form).init());

    window.dispatchEvent(new CustomEvent('FormsCreated', {
        detail: Form.formMap
    }));
});

