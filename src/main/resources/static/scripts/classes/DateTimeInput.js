import { TextInput } from './TextInput.js';

export class DateTimeInput extends TextInput {
    constructor(input) {
        super(input);
        this.getValue = () => {
            if (this.isEmpty()) return '';
            const date = new Date(this.input.value);
            return date.toISOString();
        }

        this.validate = () => {
            if (this.isEmpty()) return true;
            const date = new Date(this.input.value);
            return !isNaN(date.getTime());
        };
    }

    init() {
        super.init();
        this.input.setAttribute('type', 'datetime-local');
    }

    updateState() {
        this.states.active = true;
        super.updateState();
    }
}
