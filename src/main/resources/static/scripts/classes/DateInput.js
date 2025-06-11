import { TextInput } from './TextInput.js';

export class DateInput extends TextInput {
    constructor(input) {
        super(input);
        this.getValue = () => {
            if (this.isEmpty()) return '';
            const date = new Date(this.input.value);
            return date.toISOString().split('T')[0];
        }

        this.validate = () => {
            if (!this.shouldValidate()) return true;
            if (this.isEmpty()) return true;
            const date = new Date(this.input.value);
            return !isNaN(date.getTime());
        };
    }

    init(form) {
        super.init(form);
        this.input.setAttribute('type', 'date');
    }

    updateState() {
        this.states.active = true;
        super.updateState();
    }
}
