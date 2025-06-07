import { TextInput } from './TextInput.js';

export class DateInput extends TextInput {
    constructor(input) {
        super(input);
        this.getValue = () => {
            const date = new Date(this.input.value);
            return date.toISOString().split('T')[0];
        }

        this.validate = () => {
            if (this.isEmpty()) return true;
            const date = new Date(this.input.value);
            return !isNaN(date.getTime());
        };
    }

    init() {
        super.init();
        this.input.setAttribute('type', 'date');
    }

    updateState() {
        this.states.active = true;
        super.updateState();
    }
}
