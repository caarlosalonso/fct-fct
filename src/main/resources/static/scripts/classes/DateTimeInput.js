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
            date.setHours(date.getHours() + 2); // Adjust for timezone offset
            console.log(date.toISOString());
            return !isNaN(date.getTime());
        };

        this.format = (value) => {
            if (value === null || value === undefined || value === '') return '';
            const date = new Date(value);
            if (isNaN(date.getTime())) return '';
            return date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
        };
    }

    init() {
        super.init();
        this.input.setAttribute('type', 'datetime');
    }

    updateState() {
        this.states.active = true;
        super.updateState();
    }
}
