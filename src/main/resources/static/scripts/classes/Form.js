import { Utility } from "./Utility.js";
import { Input } from "./Input.js";
import { EmailInput } from "./EmailInput.js";
import { PasswordInput } from "./PasswordInput.js";
import { TextInput } from "./TextInput.js";
import { TelInput } from "./TelInput.js";
import { FileInput } from "./FileInput.js";
import { DateInput } from "./DateInput.js";
import { DNIInput } from "./DNIInput.js";
import { NumberInput } from "./NumberInput.js";
import { SelectInput } from "./SelectInput.js";
import { DateTimeInput } from "./DateTimeInput.js";
import { RangeInput } from "./RangeInput.js";
import { ToggleSwitch } from "./ToggleSwitch.js";

export class Form {
    static formMap = new Map();

    constructor(form) {
        this.form = form;
        this.entries = [];
        // Should be replaced with personal code for the form submission.
        this.onsubmit = () => {};
    }

    init() {
        this.getEntries();
        const showLegend = this.form.getAttribute('form-legend') !== 'false';
        if (showLegend) this.buildLegend();

        const showMessage = this.form.getAttribute('form-message') !== 'false';
        if (showMessage) this.buildMessage();

        const showSubmitButton = this.form.getAttribute('form-submit-button') !== 'false';
        if (showSubmitButton) {
            this.buildSubmit();
            this.buildEvents();
        }

        Form.formMap.set(this.form, this);
    }

    getEntries() {
        this.form.querySelectorAll('.input').forEach(input => {
            switch (input.getAttribute('type')) {
                case 'email':           this.entries.push(new EmailInput(input));       break;
                case 'password':        this.entries.push(new PasswordInput(input));    break;
                case 'text':            this.entries.push(new TextInput(input));        break;
                case 'tel':             this.entries.push(new TelInput(input));         break;
                case 'file':            this.entries.push(new FileInput(input));        break;
                case 'dni':             this.entries.push(new DNIInput(input));         break;
                case 'date':            this.entries.push(new DateInput(input));        break;
                case 'number':          this.entries.push(new NumberInput(input));      break;
                case 'select':          this.entries.push(new SelectInput(input));      break;
                case 'datetime-local':  this.entries.push(new DateTimeInput(input));    break;
                case 'range':           this.entries.push(new RangeInput(input));       break;
                case 'toggle-switch':   this.entries.push(new ToggleSwitch(input));     break;
                default:                this.entries.push(new Input(input));            break;
            }
        });
        this.entries.forEach((input) => {
            input.init(this.form);
            input.input.addEventListener('input', (event) => {
                input.states.errorAffected = false;
            });
        });
    }

    buildMessage() {
        this.messageSection = document.createElement('div');
        this.messageSection.classList.add('form-group');
        this.messageSection.id = 'message-section';
        this.form.appendChild(this.messageSection);

        this.message = document.createElement('p');
        this.message.classList.add('hidden');
        this.message.id = 'message';
        this.messageSection.appendChild(this.message);
    }

    buildSubmit() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('form-group', 'buttons-wrapper');
        wrapper.id = 'buttons-wrapper';
        this.form.appendChild(wrapper);

        this.submit = document.createElement('button');
        this.submit.type = 'submit';
        this.submit.classList.add('form-buttons', 'submit-button');

        this.submit.textContent = Utility.getAttributeValueOrDefault('submit-text', 'Submit', this.form);
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

            this.submitLoading();

            this.onsubmit();
        });
    }

    submitLoading() {
        this.submit.disabled = true;
        this.submit.classList.add('loading');
        this.submit.textContent = '';
        
        const spinner = document.createElement('span');
        spinner.classList.add('spinner-border', 'spinner-border-sm');
        this.submit.appendChild(spinner);
    }

    submitFinish() {
        this.submit.disabled = false;
        this.submit.classList.remove('loading');
        this.submit.textContent = Utility.getAttributeValueOrDefault('submit-text', 'Submit', this.form);
        
        const spinner = this.submit.querySelector('.spinner-border');
        if (spinner) {
            spinner.remove();
        }
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
                return true;
            }
            return false;
        }
        return true;
    }

    reset() {
        this.entries.forEach((input) => {
            input.clear();
        });
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
        this.clearMessage();
        this.message.innerText = message;
        this.message.classList.remove('hidden');
        this.message.classList.add('effect', 'error');
        this.messageTimeout = setTimeout(() => {
            this.message.classList.remove('effect');
        }, 450);
    }

    showSuccess(message) {
        this.clearMessage();
        this.message.innerText = message;
        this.message.classList.remove('hidden');
        this.message.classList.add('effect', 'success');
        this.messageTimeout = setTimeout(() => {
            this.message.classList.remove('effect');
        }, 450);
    }

    clearMessage() {
        clearTimeout(this.messageTimeout);
        this.message.classList.add('hidden');
        this.message.classList.remove('effect', 'error', 'success');
        this.message.innerText = '';
    }

    checkAffected() {
        let anyAffected = false;
        this.entries.forEach((input) => {
            anyAffected |= input.states.errorAffected;
        });
        if (! anyAffected) this.clearMessage();
    }

    showErrorIfRequiredEmpty() {
        return this.showErrorIf(Input.ERROR_MESSAGES.EMPTY_REQUIRED,
                                (input) => {
                                    if (input.states.required && input.isEmpty()) {
                                        input.states.errorAffected = true;
                                        return true;
                                    }
                                    return false;
                                });
    }

    showErrorIfNotValid() {
        return this.showErrorIf(Input.ERROR_MESSAGES.INVALID,
                                (input) => {
                                    // Los que NO son válidos
                                    if ( ! input.validate()) {
                                        input.states.errorAffected = true;
                                        return true;
                                    }
                                    return false;
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
                return null;
            }
        }
        return this.entries.find(entry => entry.input === target) || null;
    }

    static initForm(formElement) {
        const form = new Form(formElement);
        form.init();
        return form;
    }
}
