import { TextInput } from './TextInput.js';


export class DNIInput extends TextInput {
    constructor(input) {
        super(input);

        this.getValue = () => {
            return this.input.value.trim().toUpperCase();
        }

        this.input.type = 'text';

        this.letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
        this.regex = /^[X-Z\d]\d{0,7}[A-Z]$/;

        this.validate = () => {
            if (this.isEmpty()) return true;

            let dni = this.getValue();

            if (! this.regex.test(dni)) return false;

            // Checks the first letters for NIE
            if (/^[XYZ]/.test(dni)) {
                const letraInicial = dni.charAt(0);
                dni = dni.replace(letraInicial, this.nIEPrefixToNumber(letraInicial));
            }

            const control = dni.slice(-1);

            return control === this.computeLetraControl(dni.slice(0, -1));
        }

        this.buildDNI();
    }

    computeLetraControl(digits) {
        const num = parseInt(digits, 10);
        return this.letters[num % 23];
    }

    buildDNI() {
        this.autocomplete = document.createElement('span');
        this.autocomplete.classList.add('autocomplete', 'hidden');
        this.parent.appendChild(this.autocomplete);

        this.input.addEventListener('input', () => this.offerAutocomplete());
        this.input.addEventListener('focus', () => this.offerAutocomplete());
        this.input.addEventListener('blur', () => this.hideAutocomplete());

        this.input.addEventListener('keydown', (event) => {
            if (this.autocomplete.classList.contains('hidden')) return;
            if (event.key === 'Tab') {
                event.preventDefault();
                // Compose the proposed string
                const composed = this.composeFullValue();
                if (composed !== null) {
                    this.input.value = composed;
                    this.parent.classList.remove('invalid');
                    this.checkChange();
                }
                this.hideAutocomplete();
            }
            if (event.key === 'Tab' || event.key === 'Escape') {
                this.hideAutocomplete();
            }
        });
    }

    composeFullValue() {
        const val = this.input.value.toUpperCase();
        if (/^\d{1,8}$/.test(val)) {
            // DNI: digits only
            if (val.length === 8) {
                return val + this.computeLetraControl(val);
            } else {
                // Pad with zeros to left
                const padded = val.padStart(8, '0');
                return padded + this.computeLetraControl(padded);
            }
        }
        if (/^[XYZ]\d{0,7}$/.test(val)) {
            const prefix = val[0];
            const digits = val.slice(1);
            const zeros = '0'.repeat(7 - digits.length);
            const nieNumber = this.nIEPrefixToNumber(prefix) + zeros + digits;
            const letter = this.computeLetraControl(nieNumber);
            return prefix + zeros + digits + letter;
        }
        return null;
    }

    offerAutocomplete() {
        // Remove all children from autocomplete
        while (this.autocomplete.firstChild) {
            this.autocomplete.removeChild(this.autocomplete.firstChild);
        }
        const val = this.input.value.toUpperCase();

        let spans = [];

        if (/^\d{1,8}$/.test(val)) {
            // DNI: only digits
            if (val.length === 8) {
                // Show solution letter
                spans.push(this.makeSpan(val, 'written'));
                spans.push(this.makeSpan(this.computeLetraControl(val), 'predicted'));
            } else {
                // Pad with zeros
                const zeros = '0'.repeat(8 - val.length);
                const padded = zeros + val;
                spans.push(this.makeSpan(zeros, 'predicted'));
                spans.push(this.makeSpan(val, 'written'));
                spans.push(this.makeSpan(this.computeLetraControl(padded), 'predicted'));
            }
            this.showAutocomplete(spans);
            return;
        }
        if (/^[XYZ]\d{0,7}$/.test(val)) {
            // NIE: X/Y/Z + up to 7 digits
            const prefix = val[0];
            const digits = val.slice(1);
            const zeros = '0'.repeat(7 - digits.length);
            const nieNumber = this.nIEPrefixToNumber(prefix) + zeros + digits;
            const letter = this.computeLetraControl(nieNumber);
            spans.push(this.makeSpan(prefix, 'written'));
            spans.push(this.makeSpan(zeros, 'predicted'));
            if (digits) spans.push(this.makeSpan(digits, 'written'));
            spans.push(this.makeSpan(letter, 'predicted'));
            this.showAutocomplete(spans);
            return;
        }
        // For any other case, hide
        this.hideAutocomplete();
    }

    nIEPrefixToNumber(prefix) {
        return { X: '0', Y: '1', Z: '2' }[prefix] || '';
    }

    makeSpan(text, className) {
        const span = document.createElement('span');
        if (className) span.classList.add(className);
        span.textContent = text;
        return span;
    }

    showAutocomplete(spans) {
        while (this.autocomplete.firstChild) {
            this.autocomplete.removeChild(this.autocomplete.firstChild);
        }
        spans.forEach(span => this.autocomplete.appendChild(span));
        this.autocomplete.classList.remove('hidden');
        this.moveAutocomplete();
    }

    hideAutocomplete() {
        this.autocomplete.classList.add('hidden');
    }

    moveAutocomplete() {
        // Get the computed style
        const style = window.getComputedStyle(this.input);
        const paddingLeft = parseFloat(style.getPropertyValue("padding-left"));
        const canvasContext = document.createElement("canvas").getContext("2d");
        canvasContext.font = style.getPropertyValue("font");
        // Computes the input's width
        const inputWidth = canvasContext.measureText(this.input.value).width;
        // Computes position

        // It shouldn't move?
        const x = paddingLeft + inputWidth + 1;
        this.autocomplete.style.left = `${x}px`;
        this.autocomplete.style.position = 'absolute';
        this.autocomplete.style.top = `${this.input.offsetTop}px`;
        this.autocomplete.style.font = style.getPropertyValue("font");
    }
}
