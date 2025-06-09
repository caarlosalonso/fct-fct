import { Input } from './Input.js';

export class TextInput extends Input {
    constructor(input) {
        super(input);
        this.isDifferent = function() {
            return this.states.tracked && this.input.value !== this.states.trackedValue;
        }
        this.getValue = function() {
            let val = this.input.value;
            if (val === null || val === undefined) return null;
            return val.trim();
        }
    }

    init() {
        this.buildLabel();
        this.buildInput();
        this.updateState();
        this.createValidityElements();
    }

    buildInput() {
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

    checkChange() {
        this.parent.classList.remove('invalid');

        this.showValidity();

        if (! this.states.tracked) return;

        this.states.changed =
            this.input.value !== this.states.trackedValue;

        this.updateState();
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
    retrack(value) {
        if (value === null || value === undefined)
            value = '';

        value = this.format(value);

        this.states.tracked = true;
        this.states.trackedValue = value;
        this.input.value = value;
        this.states.changed = false;

        if (value.length > 0) {
            this.forceActive();
        }
        this.states.active = false;
        this.updateState();
    }

    undoChanges() {
        if (! this.states.tracked) return;
        this.input.value = this.states.trackedValue;
        this.checkChange();
        this.updateState();
    }

    clear() {
        this.input.value = '';
        this.states.active = false;
        this.states.changed = false;
        this.states.trackedValue = '';
        this.updateState();
        this.checkChange();
    }
}
