import { Utility } from './Utility.js';

export class Input {
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
            'errorAffected':    false
        }
    }

    equals(id) {
        return this.input.id === id;
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

    buildLabel() {
        this.label = document.createElement('p');
        this.label.classList.add('label');
        this.label.innerText = this.input.getAttribute('label');

        /*  The label's height isn't computed until it is added to the DOM, but
            it can't be added to DOM until it's position is computed, because,
            if it's added later, it would slide into position which would look
            bad. To fix this, the height is assumed to be 24px.                 */
        /*                     parent's half height      label's half height   ?*/
        let verticalPosition = this.parent.offsetHeight / 2 - 12             - 1;
        //this.label.style.top = `${verticalPosition}px`;
        this.parent.appendChild(this.label);
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

    validate() {
        return true;
    }

    init() {}

    isDifferent() {
        return false;
    }

    format(value) {
        return value;
    }

    getValue() {
        return null;
    }

    setValue(value) {
        this.input.value = value;
    }

    forceActive() {
        this.label.classList.remove('active');
        this.states.active = true;
        this.updateState();
    }
}
