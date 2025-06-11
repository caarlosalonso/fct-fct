import { TextInput } from './TextInput.js';

export class TelInput extends TextInput {
    constructor(input) {
        super(input);
        this.validate = () => {
            if (this.isEmpty()) return true;
            const val = String(this.input.value).replace(/\s/g, '');
            return /^\d{9}$/.test(val);
        }

        this.format = function(value) {
            const raw = value.replace(/\D/g, '');
            return raw.replace(/(\d{1,3})(\d{1,2})?(\d{1,2})?(\d{1,2})?/, (match, p1, p2, p3, p4) => {
                return [p1, p2, p3, p4].filter(Boolean).join(' ');
            });
        }
    }

    init(form) {
        super.init(form);
        this.input.setAttribute('type', 'tel');
        this.input.addEventListener('input', (event) => {
            this.input.value = this.format(this.input.value);
            this.checkChange();
        });
    }
}
