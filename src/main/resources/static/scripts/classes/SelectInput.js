import { TextInput } from './TextInput.js';

export class SelectInput extends TextInput {
    constructor(input) {
        super(input);
        this.options = [];
        this.input.value = null;
        this.validate = () => {
            if (this.isEmpty()) return true;

            const selectedValue = this.input.value;
            return this.options.some(option => option.value === selectedValue);
        }
    }

    init() {
        super.init();
        this.buildSelect();
    }

    buildSelect() {
        const options = this.input.getAttribute('data-options');
        if (!options) return;

        options.split(',').forEach(option => {
            const [value, label] = option.split(':');
            this.options.push({ value, label });
        });
    }
}
