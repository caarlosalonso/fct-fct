document.addEventListener('DOMContentLoaded', (event) => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => new Form(form).init());

    window.dispatchEvent(new CustomEvent('FormsCreated', {
        detail: Form.formMap
    }));
});

class Utility {
    static getBooleanAttribute(name, element) {
        return element.getAttribute(name) === 'true';
    }

    static getAttributeValueOrDefault(name, def, element) {
        const value = element.getAttribute(name);
        return value !== null ? value : def;
    }

    static getElementValueByAttribute(name, element, b = null) {
        return Utility.getBooleanAttribute(name, element) ? element.value : b;
    }
}

class Form {
    static formMap = new Map();

    constructor(form) {
        this.form = form;
        this.entries = [];
        // Should be replaced with personal code for the form submission.
        this.onSubmit = () => {};
    }

    init() {
        this.getEntries();
        this.buildLegend();
        this.buildErrorMessage();
        this.buildSubmitAndReset();
        this.buildEvents();

        Form.formMap.set(this.form, this);
    }

    getEntries() {
        this.form.querySelectorAll('.input').forEach(input => {
            switch (input.getAttribute('type')) {
                case 'email':       this.entries.push(new EmailInput(input));       break;
                case 'password':    this.entries.push(new PasswordInput(input));    break;
                case 'text':        this.entries.push(new TextInput(input));        break;
                default:            this.entries.push(new Input(input));            break;
            }
        });
        this.entries.forEach((input) => {
            input.init();
        });
    }

    buildErrorMessage() {
        this.errorSection = document.createElement('div');
        this.errorSection.classList.add('form-group');
        this.errorSection.id = 'error-section';
        this.form.appendChild(this.errorSection);

        this.errorMessage = document.createElement('p');
        this.errorMessage.classList.add('hidden');
        this.errorMessage.id = 'error-message';
        this.errorSection.appendChild(this.errorMessage);
    }

    buildSubmitAndReset() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('form-group', 'buttons-wrapper');
        this.form.appendChild(wrapper);

        this.submit = document.createElement('input');
        this.submit.type = 'submit';
        this.submit.id = 'submit';
        this.submit.classList.add('form-buttons');

        this.submit.value = Utility.getAttributeValueOrDefault('submit-text', 'Submit', this.form);
        wrapper.appendChild(this.submit);
    }

    buildLegend() {
        const legend = document.createElement('div');
        legend.classList.add('legend');

        const requiredLegend = document.createElement('p');
        requiredLegend.classList.add('legendText', 'required');
        requiredLegend.innerText = 'Campo requerido';
        legend.appendChild(requiredLegend);

        const frozenLegend = document.createElement('p');
        frozenLegend.classList.add('legendText', 'frozen');
        frozenLegend.innerText = 'Campo no modificable';
        legend.appendChild(frozenLegend);

        const trackedLegend = document.createElement('p');
        trackedLegend.classList.add('legendText', 'changed');
        trackedLegend.innerText = 'Campo cambiado';
        legend.appendChild(trackedLegend);

        this.form.appendChild(legend);
    }

    buildEvents() {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (! this.showErrorIfRequiredEmpty()) return;
            if (! this.showErrorIfNotValid()) return;

            this.onSubmit();
        });
    }

    /**
     * Cancels the form submission
     */
    cancel() {
        if (this.hasAnyChanged()) {
            const confirm = window.confirm('Hay cambios sin guardar, ¿Seguro que desea cancelar?');
            if (confirm) {
                this.entries.forEach((input) => {
                    input.undoChanges();
                });
            } else {

            }
        }
    }


    hasAnyChanged() {
        return this.entries.some((input) => {
            return input.isDifferent();
        });
    }

    isAnyRequiredEmpty() {
        return this.entries.some((input) => {
            return input.states.required && input.isEmpty();
        })
    }

    showError(message) {
        this.errorMessage.innerText = message;
        this.errorMessage.classList.remove('hidden');
        this.errorMessage.classList.add('effect');
        setTimeout(() => {
            this.errorMessage.classList.remove('effect');
        }, 450);
    }

    showErrorIfRequiredEmpty() {
        return this.showErrorIf(Input.ERROR_MESSAGES.EMPTY_REQUIRED,
                                (input) => {
                                    return input.states.required && input.isEmpty();
                                });
    }

    showErrorIfNotValid() {
        return this.showErrorIf(Input.ERROR_MESSAGES.INVALID,
                                (input) => {
                                    // Los que NO son válidos
                                    return ! input.validate();
                                });
    }

    showErrorIf(message, func = (input) => {return true}) {
        const filtered = this.entries.filter(func);

        if (filtered.length === 0) return true;

        this.showError(message);

        let ii = 0;
        filtered.forEach((input) => {
            setTimeout(() => {
                input.parent.classList.add('invalid', 'effect');
            }, ii);
            setTimeout(() => {
                input.parent.classList.remove('effect');
            }, 450 + ii);
            ii += 35;
        });
        return false;
    }


    static getForm(target) {
        if (typeof target === 'string') {
            target = document.getElementById(target);
            if (target === null) {
                console.warn(`Form [${target}] is invalid.`);
                return;
            }
        }
        return Form.formMap.get(target) || null;
    }

    getInput(target) {
        if (typeof target === 'string') {
            target = document.getElementById(target);
            if (target === null) {
                console.warn(`Input [${target}] is invalid.`);
                return;
            }
        }
        return this.entries.get(target) || null;
    }

    static initForm(formElement) {
        const form = new Form(formElement);
        form.init();
        return form;
    }
}

class Input {
    static ATTRIBUTES = {
        REQUIRED: 'data-required',
        TRACKED: 'data-track-changes',
        FROZEN: 'data-freeze',
        SHOW_VALIDITY: 'data-show-validity',
    }
    static ERROR_MESSAGES = {
        INVALID: 'Campo inválido',
        EMPTY_REQUIRED: '¡Hay campos requeridos sin rellenar!'
    }
    static VALIDATORS = {
        required: (input) => input.value.trim() !== '',
        email: (input) => /\S+@\S+\.\S+/.test(input.value),
    }

    constructor(input) {
        // Variable definition
        this.input = input;
        this.parent = input.parentNode;

        this.states = {
            'active':           false,
            'focus':            false,
            'required':         Utility.getBooleanAttribute(Input.ATTRIBUTES.REQUIRED, this.input),
            'frozen':           Utility.getBooleanAttribute(Input.ATTRIBUTES.FROZEN, this.input),
            'frozenValue':      Utility.getElementValueByAttribute(Input.ATTRIBUTES.FROZEN, this.input),
            'tracked':          Utility.getBooleanAttribute(Input.ATTRIBUTES.TRACKED, this.input),
            'changed':          false,
            'trackedValue':     Utility.getElementValueByAttribute(Input.ATTRIBUTES.TRACKED, this.input),
            'valid':            null,
            'showValidity':     Utility.getBooleanAttribute(Input.ATTRIBUTES.SHOW_VALIDITY, this.input),
        }
    }

    init() {}

    equals(id) {
        return this.input.id === id;
    }

    validate() {
        return true;
    }

}

class TextInput extends Input {
    constructor(input) {
        super(input);
    }

    init() {
        this.buildInput();
        this.updateState();
        this.createValidityElements();
    }

    buildInput() {
        this.label = document.createElement('p');
        this.label.classList.add('label');
        this.label.innerText = this.input.getAttribute('label');

        /*  The label's height isn't computed until it is added to the DOM, but
            it can't be added to DOM until it's position is computed, because,
            if it's added later, it would slide into position which would look
            bad. To fix this, the height is assumed to be 24px.                 */
        /*                     parent's half height      label's half height   ?*/
        let verticalPosition = this.parent.offsetHeight / 2 - 12             - 1;
        this.label.style.top = verticalPosition + "px";
        this.parent.appendChild(this.label);
        
        if (! this.isEmpty()) {
            this.states.active = true;
        }

        this.input.addEventListener('input', (event) => {
            this.checkChange();
        });

        //  On focus, moves the label up
        this.input.addEventListener('focus', (event) => {
            this.states.focus = true;
            if (this.isEmpty()) this.states.active = true;
            this.updateState();
        });

        //  When focus is lost, moves the label back
        this.input.addEventListener('blur', (event) => {
            this.states.focus = false;
            if (this.isEmpty()) this.states.active = false;
            this.updateState();
        });

        /*  Makes it so, if the label is clicked, the input is focused          */
        this.label.addEventListener('click', (event) => {
            this.input.focus();
        });
    }

    updateState() {
        const {label, states} = this;
        label.classList.toggle('active', states.active);
        label.classList.toggle('focus', states.focus);
        label.classList.toggle('required', states.required);
        label.classList.toggle('tracked', states.tracked);
        label.classList.toggle('changed', states.changed);

        if (this.states.frozen) {
            this.label.classList.add('frozen');
            this.input.setAttribute('disabled', 'disabled');
            this.input.setAttribute('frozen', 'frozen');
        } else {
            this.label.classList.remove('frozen');
            this.input.removeAttribute('disabled');
            this.input.removeAttribute('frozen');
        }
    }

    checkChange() {
        this.parent.classList.remove('invalid');

        this.showValidity();

        if (! this.states.tracked) return;

        this.states.changed =
            this.input.value !== this.states.trackedValue;

        this.updateState();
    }

    createValidityElements() {
        if (! this.states.showValidity) return;

        this.validInput = document.createElement('p');
        this.validInput.classList.add('validity', 'valid');
        this.validInput.textContent = '✓';
        this.parent.appendChild(this.validInput);

        this.invalidInput = document.createElement('p');
        this.invalidInput.classList.add('validity', 'invalid');
        this.invalidInput.textContent = '✗';
        this.parent.appendChild(this.invalidInput);
    }

    showValidity() {
        if (! this.states.showValidity) return;

        if (this.isEmpty()) {
            this.validInput.classList.remove('show');
            this.validInput.classList.add('hide');

            this.invalidInput.classList.remove('show');
            this.invalidInput.classList.add('hide');
            this.states.valid = null;
            return;
        }

        const oldValidity = this.states.valid;
        this.states.valid = this.validate();

        if (oldValidity === null) {
            const show = this.states.valid ? this.validInput : this.invalidInput;
            show.classList.remove('hide');
            show.classList.add('show');
            return;
        }

        if (oldValidity !== this.states.valid) {
            const hide = oldValidity ? this.validInput : this.invalidInput;
            const show = this.states.valid ? this.validInput : this.invalidInput;

            hide.classList.remove('show');
            hide.classList.add('hide');

            show.classList.remove('hide');
            show.classList.add('show');
        }
    }

    getLength() {
        return this.input.value.length;
    }

    isEmpty() {
        return this.getLength() === 0;
    }

    /**
     * Changes the value that is being tracked.
     *
     * @param {string} value New value to track changes
     */
    retrack(value, override = true) {
        if (value === null || value === undefined)
            value = '';

        this.states.trackedValue = value;
        if (override) {
            this.input.value = value;
            this.states.changed = false;
        }

        this.checkChange();
    }

    undoChanges() {
        if (! this.states.tracked) return;
        this.input.value = this.states.trackedValue;
        this.checkChange();
        this.updateState();
    }

    isDifferent() {
        return this.tracked && this.input.value !== this.states.trackedValue;
    }
}

class PasswordInput extends TextInput {

    constructor(input) {
        super(input);
        this.buildPassword();

        this.validate = () => {
            return true;
        }
    }

    buildPassword() {
        if (this.input.type !== 'password') return;

        this.states.passwordType = this.input.getAttribute('data-password-type');
        const validTypes = ['create', 'fill'];
        if (! validTypes.includes(this.states.passwordType)) {
            this.states.passwordType = 'fill';
        }

        this.input.setAttribute('autocomplete', 'off');
        this.input.setAttribute('autocorrect', false);
        this.input.setAttribute('autocapitalize', false);
        this.input.setAttribute('spellcheck', false);

        if (! this.parent.classList.contains('wrapper-password')) {
            this.parent.classList.add('wrapper-password');
        }

        this.icon = document.createElement('div');
        this.icon.classList.add('password-icon');
        this.parent.appendChild(this.icon);

        const img = document.createElement('img');
        img.classList.add('password-icon-img');
        img.src = '../static/images/eye.svg';
        img.alt = 'Toggle password visibility';
        this.icon.appendChild(img);

        /*  Click on the div instead of the image, so that the transparent parts
        of the image are not missable.                                          */
        this.icon.addEventListener('click', () => {
            if (this.input.type === 'password') {
                this.input.type = 'text';
                img.src = '../static/images/eye-crossed.svg';
            } else {
                this.input.type = 'password';
                img.src = '../static/images/eye.svg';
            }
        });
    }
}

class EmailInput extends TextInput {

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

        this.shown = false;

        // Para que la validación de si es un email sea en el submit.
        this.input.type = 'text';
        this.validate = () => {
            if (this.isEmpty()) return true;
            const val = String(this.input.value).toLowerCase();
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        }

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
        const x = paddingLeft + inputWidth + 6;
        this.autocomplete.style.left = `${x}px`;
    }
}
