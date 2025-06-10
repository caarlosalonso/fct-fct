import { TextInput } from './TextInput.js';

export class DateTimeInput extends TextInput {
    constructor(input) {
        super(input);
        this.getValue = () => {
            if (this.isEmpty()) return '';
            const date = new Date(this.input.value);
            // Format to match dd/MM/yyyy, HH:mm:ss pattern
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day}, ${hours}:${minutes}:${seconds}`;
        }

        this.validate = () => {
            if (this.isEmpty()) return true;
            const date = new Date(this.input.value);
            return !isNaN(date.getTime());
        };

        this.format = (value) => {
            if (value === null || value === undefined || value === '') return '';
            const date = new Date(value);
            if (isNaN(date.getTime())) return '';
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}`;
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