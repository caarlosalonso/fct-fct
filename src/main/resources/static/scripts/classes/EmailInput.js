import { TextInput } from './TextInput.js';

export class EmailInput extends TextInput {

    static COMMON_DOMAINS = [
        '@educa.madrid.org',
        '@gmail.com',
        '@outlook.com',
        '@iCloud.com',
        '@hotmail.com',
        '@yahoo.com',
        '@zoho.com',
    ]

    constructor(input) {
        super(input);
        this.getValue = () => {
            return this.input.value.trim().toLowerCase();
        }

        this.shown = false;

        // Para que la validación de si es un email sea en el submit.
        this.input.type = 'text';
        this.validate = () => {
            if (this.isEmpty()) return true;
            const val = String(this.input.value).toLowerCase();
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        }
    }

    init(form) {
        super.init(form);
        this.buildEmail();
    }

    buildEmail() {
        this.autocomplete = document.createElement('p');
        this.autocomplete.classList.add('autocomplete', 'hidden');
        this.autocomplete.addEventListener('click', (event) => {this.input.focus();});
        this.autocomplete.style.font = window.getComputedStyle(this.input).font;

        this.parent.appendChild(this.autocomplete);

        this.input.addEventListener('input', (event) => {
            this.offerAutocomplete();
        });

        this.input.addEventListener('focus', (event) => {
            this.offerAutocomplete();
        });

        this.input.addEventListener('blur', (event) => {
            this.hide();
        });

        this.input.addEventListener('keydown', (event) => {
            if (! this.shown) return;
            if (event.key === 'Tab') {
                event.preventDefault();
                this.input.value += this.autocomplete.innerText;
                this.parent.classList.remove('invalid');
                this.checkChange();
            }

            if (event.key === 'Tab' || event.key === 'Escape')
                this.hide();
        });
    }

    offerAutocomplete() {
        const index = this.input.value.indexOf('@');

        // So it doesn't start with '@'
        if (index === 0) return;
        if (index === -1) {
            if (this.input.value.length === 0) {
                this.hide();
                return;
            }
            // Muestra el primer dominio por defecto
            this.show(EmailInput.COMMON_DOMAINS[0]);
            return;
        }

        let bestMatch = null;
        let domainMatchLength = -1;
        EmailInput.COMMON_DOMAINS.forEach((domain) => {
            if (domain.startsWith(this.input.value.substring(index))) {
                let currentDomainMatchLength = this.input.value.substring(index).length;

                if (bestMatch === null || currentDomainMatchLength > domainMatchLength) {
                    domainMatchLength = currentDomainMatchLength;
                    bestMatch = domain;
                }
            }
        });

        if (bestMatch !== null) this.show(bestMatch.substring(domainMatchLength));
        else                    this.hide();
    }

    show(text) {
        this.autocomplete.innerText = text;
        this.autocomplete.classList.remove('hidden');
        this.shown = true;
        this.moveAutocomplete();
    }

    hide() {
        this.autocomplete.classList.add('hidden');
        this.shown = false;
        this.moveAutocomplete();
    }

    moveAutocomplete() {
        // Get the computed style
        const style = window.getComputedStyle(this.input);
        // Obtain left padding
        const paddingLeft = parseFloat(style.getPropertyValue("padding-left"));
        // Create a canvas context to measure the text's width
        const canvasContext = document.createElement("canvas").getContext("2d");
        canvasContext.font = style.getPropertyValue("font");
        canvasContext.fontSize = parseFloat(style.getPropertyValue("font-size"));
        // Computes the input's width
        const inputWidth = canvasContext.measureText(this.input.value).width;
        // Computes position
        const x = paddingLeft + inputWidth + 1;
        this.autocomplete.style.left = `${x}px`;
    }
}
