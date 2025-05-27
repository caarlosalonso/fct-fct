import { Input } from './Input.js';

export class DateInput extends Input {
    constructor(input) {
        super(input);
        this.validate = () => {
            if (this.isEmpty()) return true;
            const date = new Date(this.input.value);
            return !isNaN(date.getTime());
        };

        this.format = (value) => {
            const date = new Date(value);
            return date.toISOString().split('T')[0];
        };
    }

    init() {
        this.input.setAttribute('type', 'date');
        this.createValidityElements();
    }
}
