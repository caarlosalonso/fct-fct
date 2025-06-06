import { TextInput } from './TextInput.js';
import { Utility } from './Utility.js';

export class NumberInput extends TextInput {
    constructor(input) {
        super(input);
        this.minimum = Utility.getAttributeValueOrDefault('data-min', null, this.input);
        if (isNaN(parseFloat(this.minimum))) this.minimum = null;
        this.input.setAttribute('min', this.minimum);
        this.maximum = Utility.getAttributeValueOrDefault('data-max', null, this.input);
        if (isNaN(parseFloat(this.maximum))) this.maximum = null;
        this.input.setAttribute('max', this.maximum);
        this.step = Utility.getAttributeValueOrDefault('data-step', '1', this.input);
        if (isNaN(parseFloat(this.step))) this.step = '1';
        this.input.setAttribute('step', this.step);
        this.validate = () => {
            if (this.isEmpty()) return true;

            const value = parseFloat(this.input.value);
            if (isNaN(value)) return false;

            if (this.minimum !== null && value < parseFloat(this.minimum)) return false;
            if (this.maximum !== null && value > parseFloat(this.maximum)) return false;

            return true;
        }
    }

    init() {
        super.init();
        this.createEventListeners();
    }

    createEventListeners() {
        this.input.addEventListener('input', () => {
            this.states.dirty = true;
            this.updateState();
        });
    }
}