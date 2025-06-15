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

        this.format = (value) => {
            if (value === null || value === undefined) return '';
            if (typeof value === 'number') return value.toString();
            if (typeof value === 'string') {
                const parsed = parseFloat(value);
                return isNaN(parsed) ? '' : parsed.toString();
            }
            return this.minimum !== null ? this.minimum : 0;
        }

        this.validate = () => {
            if (!this.shouldValidate()) return true;
            if (this.isEmpty()) return true;

            const value = parseFloat(this.input.value);
            if (isNaN(value)) return false;

            if (this.minimum !== null && value < parseFloat(this.minimum)) return false;
            if (this.maximum !== null && value > parseFloat(this.maximum)) return false;

            return true;
        }
    }

    init(form) {
        super.init(form);
    }

    retrack(value) {
        if (value === null || value === undefined)
            value = this.minimum !== null ? this.minimum : 0;

        value = this.format(value);

        this.states.tracked = true;
        this.states.trackedValue = value;
        this.setValue(value);
        this.states.changed = false;

        if (value.length > 0) {
            this.forceActive();
        }
        this.updateState();
    }
}
