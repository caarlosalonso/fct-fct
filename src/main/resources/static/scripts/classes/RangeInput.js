import { Input } from './Input.js';

export class RangeInput extends Input {
    constructor(input) {
        super(input);
        this.minimum = parseFloat(this.input.getAttribute('data-min')) || 0;
        this.maximum = parseFloat(this.input.getAttribute('data-max')) || 100;
        this.step = parseFloat(this.input.getAttribute('data-step')) || 1;
        this.value = parseFloat(this.input.getAttribute('data-value')) || this.minimum;
        this.labelText = this.input.getAttribute('label') || '';
        this.validate = () => {
            if (!this.shouldValidate()) return true;
            if (this.isEmpty()) return true;
            const value = parseFloat(this.input.value);
            return !isNaN(value) && value >= this.minimum && value <= this.maximum;
        };

        this.getValue = () => {
            if (this.isEmpty()) return null;
            const value = parseFloat(this.input.value);
            return isNaN(value) ? null : value;
        }

        this.isEmpty = () => {
            return false;
        }
    }

    init(form) {
        super.init(form);
        this.buildLabel();
        this.buildInput();
    }

    buildLabel() {
        this.label = document.createElement('p');
        this.label.classList.add('label', 'active');
        this.parent.appendChild(this.label);
    }

    buildInput() {
        this.input.classList.add('range-input');
        this.input.setAttribute('type', 'range');
        this.input.setAttribute('min', this.minimum);
        this.input.setAttribute('max', this.maximum);
        this.input.setAttribute('step', this.step);
        this.input.value = this.value;
        this.parent.appendChild(this.input);
        this.changeText();

        this.input.addEventListener('input', () => {
            this.changeText();
            this.updateState();
            this.label.classList.add('active');
        });

        this.label.classList.add('active');
    }

    changeText() {
        if (this.labelText.length === 0) return;
        this.label.innerText = this.labelText
                                .replace('{n}', this.input.value)
                                .replace('{s}', this.input.value === '1' ? '' : 's')
                                .replace('{es}', this.input.value === '1' ? '' : 'es');
    }
}
