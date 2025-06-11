import { Input } from './Input.js';

export class ToggleSwitch extends Input {
    constructor(input) {
        super(input);
        this.checked = this.input.getAttribute('data-checked') === 'true';
        this.id = this.input.getAttribute('id');
    }

    init() {
        super.init();
        this.buildLabel();
        this.buildInput();
    }

    buildLabel() {
        this.label = document.createElement('p');
        this.label.classList.add('label', 'active');
        this.parent.appendChild(this.label);
    }

    buildInput() {
        this.input.setAttribute('type', 'checkbox');
        this.input.classList.add('toggle-switch');
        this.input.checked = this.checked;

        this.input.addEventListener('input', () => {
            this.toggleElements();
        });
    }

    toggleElements() {
        const elementFalse = document.getElementById(`${this.id}-false`);
        const elementTrue = document.getElementById(`${this.id}-true`);
        if (elementFalse && elementTrue) {
            if (this.input.checked) {
                elementFalse.classList.add('hidden');
                elementTrue.classList.remove('hidden');
            } else {
                elementFalse.classList.remove('hidden');
                elementTrue.classList.add('hidden');
            }
        }
    }
}
