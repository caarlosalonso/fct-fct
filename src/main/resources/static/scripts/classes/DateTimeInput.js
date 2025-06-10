import { TextInput } from './TextInput.js';

export class DateTimeInput extends TextInput {
    constructor(input) {
        super(input);
        this.getValue = () => {
            if (this.isEmpty()) return '';
            const date = new Date(this.input.value);
            return moment(date.toISOString()).utcOffset(0, true).format();
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
            const formattedDate = moment(date.toISOString()).utcOffset(0, true).format();
            return formattedDate.split('T')[0] + ' ' + formattedDate.split(' ')[1];
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
