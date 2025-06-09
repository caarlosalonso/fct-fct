import { TextInput } from './TextInput.js';


export class DNIInput extends TextInput {
    constructor(input) {
        super(input);

        this.getValue = () => {
            return this.input.value.trim().toUpperCase();
        }

        this.input.type = "text";

        this.letters = "TRWAGMYFPDXBNJZSQVHLCKE";
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

            return dni.slice(-1) === DNIInput.computeLetraControl(dni.slice(0, -1));
        }
    }

    init() {
        super.init();
        this.buildDNI();
        this.createEventListeners();
    }

    buildDNI() {
        this.autocomplete = document.createElement("span");
        this.autocomplete.classList.add("autocomplete", "hidden", "dni");
        this.parent.appendChild(this.autocomplete);
        this.autocomplete.style.font = window.getComputedStyle(this.input).getPropertyValue("font");
    }

    createEventListeners() {
        this.input.addEventListener("input", () => this.offerAutocomplete());
        this.input.addEventListener("focus", () => this.offerAutocomplete());
        this.input.addEventListener("blur", () => this.hideAutocomplete());

        this.input.addEventListener("keydown", (event) => {
            if (this.autocomplete.classList.contains("hidden")) return;
            if (event.key === "Tab") {
                event.preventDefault();

                const composed = this.composeFullValue();   // The complete DNI
                if (composed !== null) {
                    this.input.value = composed;
                    this.parent.classList.remove("invalid");
                    this.checkChange();
                }
                this.hideAutocomplete();
            }
            if (event.key === "Tab" || event.key === "Escape") {
                this.hideAutocomplete();
            }
        });
    }

    static computeLetraControl(digits) {
        console.log("Computing control letter for:", digits);
        const num = parseInt(digits, 10);
        console.log("Parsed number:", num);
        console.log("Control letter index:", num % 23);
        console.log("Control letter:", this.letters[num % 23]);
        return this.letters[num % 23];
    }

    static nIEPrefixToNumber(prefix) {
        return { X: "0", Y: "1", Z: "2" }[prefix] || "";
    }

    composeFullValue() {
        const val = this.input.value.toUpperCase();
        // Only digits
        if (/^\d{1,8}$/.test(val)) {
            const identidad = val.length === 8 ? val : val.padStart(8, "0");
            return identidad + DNIInput.computeLetraControl(identidad);
        }

        // NIE: X/Y/Z + up to 7 digits
        if (/^[XYZ]\d{0,7}$/.test(val)) {
            const prefix = val[0];
            const digits = val.slice(1);
            const zeros = "0".repeat(7 - digits.length);
            const letter = DNIInput.computeLetraControl(
                DNIInput.nIEPrefixToNumber(prefix) +
                zeros +
                digits
            );          // Computes the control letter of the NIE based on its digits
            return prefix + zeros + digits + letter;
        }

        // It's not a valid DNI or NIE
        return null;
    }

    offerAutocomplete() {
        // Remove all children from autocomplete
        while (this.autocomplete.firstChild) {
            this.autocomplete.removeChild(this.autocomplete.firstChild);
        }
        const val = this.input.value.toUpperCase();

        this.spans = [];

        if (/^\d{1,8}$/.test(val)) {
            // DNI: only digits
            if (val.length === 8) {
                // Show solution letter
                this.spans.push(this.makeSpan(val, "written"));
                this.spans.push(this.makeSpan(DNIInput.computeLetraControl(val), "predicted"));
            } else {
                // Pad with zeros
                const zeros = "0".repeat(8 - val.length);
                const padded = zeros + val;
                this.spans.push(this.makeSpan(zeros, "predicted"));
                this.spans.push(this.makeSpan(val, "written"));
                this.spans.push(this.makeSpan(DNIInput.computeLetraControl(padded), "predicted"));
            }
            this.showAutocomplete(this.spans);
            return;
        }
        if (/^[XYZ]\d{0,7}$/.test(val)) {
            // NIE: X/Y/Z + up to 7 digits
            const prefix = val[0];
            const digits = val.slice(1);
            const zeros = "0".repeat(7 - digits.length);
            const nieNumber = DNIInput.nIEPrefixToNumber(prefix) + zeros + digits;
            const letter = DNIInput.computeLetraControl(nieNumber);
            this.spans.push(this.makeSpan(prefix, "written"));
            this.spans.push(this.makeSpan(zeros, "predicted"));
            if (digits) this.spans.push(this.makeSpan(digits, "written"));
            this.spans.push(this.makeSpan(letter, "predicted"));
            this.showAutocomplete();
            return;
        }
        // For any other case, hide
        this.hideAutocomplete();
    }

    makeSpan(text, className) {
        const span = document.createElement("span");
        if (className) span.classList.add("autocomplete-values", className);
        span.textContent = text;
        return span;
    }

    showAutocomplete() {
        while (this.autocomplete.firstChild) {
            this.autocomplete.removeChild(this.autocomplete.firstChild);
        }
        this.spans.forEach((span) => this.autocomplete.appendChild(span));
        this.autocomplete.classList.remove("hidden");
    }

    hideAutocomplete() {
        this.autocomplete.classList.add("hidden");
    }
}
