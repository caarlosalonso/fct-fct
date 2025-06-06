//import { Form } from './../classes/Form.js';

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

document.addEventListener('DOMContentLoaded', (event) => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => new Form(form).init());

    window.dispatchEvent(new CustomEvent('FormsCreated', {
        detail: Form.formMap
    }));
});

class Form {
    static formMap = new Map();

    constructor(form) {
        this.form = form;
        this.entries = [];
        // Should be replaced with personal code for the form submission.
        this.onsubmit = () => {};
    }

    init() {
        this.getEntries();
        this.buildLegend();
        this.buildMessage();
        this.buildSubmit();
        this.buildEvents();

        Form.formMap.set(this.form, this);
    }

    getEntries() {
        this.form.querySelectorAll('.input').forEach(input => {
            switch (input.getAttribute('type')) {
                case 'email':       this.entries.push(new EmailInput(input));       break;
                case 'password':    this.entries.push(new PasswordInput(input));    break;
                case 'text':        this.entries.push(new TextInput(input));        break;
                case 'tel':         this.entries.push(new TelInput(input));         break;
                case 'file':        this.entries.push(new FileInput(input));        break;
                case 'dni':         this.entries.push(new DNIInput(input));         break;
                case 'date':        this.entries.push(new DateInput(input));        break;
                case 'number':      this.entries.push(new NumberInput(input));      break;
                case 'select':      this.entries.push(new SelectInput(input));      break;
                default:            this.entries.push(new Input(input));            break;
            }
        });
        this.entries.forEach((input) => {
            input.init();
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
        this.submit.id = 'submit';
        this.submit.classList.add('form-buttons');

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
        this.label.style.top = `${verticalPosition}px`;
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
}

class DateInput extends Input {
    constructor(input) {
        super(input);
        this.validate = () => {
            if (this.isEmpty()) return true;
            const date = new Date(this.input.value);
            return !isNaN(date.getTime());
        };

        this.format = (value) => {
            const date = new Date(value);
            return date.toISOString().split('T')[0];
        };
    }

    init() {
        this.input.setAttribute('type', 'date');
        this.createValidityElements();
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

class TextInput extends Input {
    constructor(input) {
        super(input);
        this.isDifferent = function() {
            return this.states.tracked && this.input.value !== this.states.trackedValue;
        }
        this.getValue = function() {
            return this.input.value.trim();
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
    retrack(value, override = true) {
        if (value === null || value === undefined)
            value = '';

        value = this.format(value);

        this.states.tracked = true;
        this.states.trackedValue = value;
        if (override) {
            this.input.value = value;
            this.states.changed = false;
        }
        this.states.active = !this.isEmpty();

        this.checkChange();
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

class NumberInput extends TextInput {
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

        input.addEventListener('pointerdown', () => {
            this.states.active = true;
            this.updateState();
        });
    }

    init() {
        super.init();
    }
}

class SelectInput extends Input {
    constructor(input) {
        super(input);
        this.options = [];
        this.input.value = null;
        this.validate = () => {
            if (this.isEmpty()) return true;

            const selectedValue = this.input.value;
            return this.options.some(option => option.value === selectedValue);
        }
    }

    init() {
        super.init();
        this.buildSelect();
    }

    buildSelect() {
        const options = this.input.getAttribute('data-options');
        if (!options) return;

        options.split(',').forEach(option => {
            const [value, label] = option.split(':');
            this.options.push({ value, label });
        });
    }

    clear() {
        this.input.value = null;
    }
}

















const NIVELES = {
    'BASICA': 'Básica',
    'MEDIO': 'Medio',
    'SUPERIOR': 'Superior'
};

const HORARIOS = {
    'DIURNO': 'Diurno',
    'VESPERTINO': 'Vespertino',
    'NOCHE': 'Noche'
}

const fetchedCiclos = [
    { id: 1, nombre: 'Desarrollo de Aplicaciones Web', acronimo: 'DAW', years: 2, nivel: NIVELES.SUPERIOR },
    { id: 2, nombre: 'Desarrollo de Aplicaciones Multiplataforma', acronimo: 'DAM', years: 2, nivel: NIVELES.SUPERIOR },
    { id: 3, nombre: 'Servicios Microinformaticos y Redes', acronimo: 'SMR', years: 2, nivel: NIVELES.MEDIO }
];

const fetchedCiclosLectivos = [
    { id: 1, nombre: '2018-2019', fechaInicio: '01/09/2018' },
    { id: 2, nombre: '2019-2020', fechaInicio: '01/09/2019' },
    { id: 3, nombre: '2020-2021', fechaInicio: '01/09/2020' },
    { id: 4, nombre: '2021-2022', fechaInicio: '01/09/2021' },
    { id: 5, nombre: '2022-2023', fechaInicio: '01/09/2022' },
    { id: 6, nombre: '2023-2024', fechaInicio: '01/09/2023' },
    { id: 7, nombre: '2024-2025', fechaInicio: '01/09/2024' }
];

const fetchedGrupos = [
    { id: 1, cicloId: 1, cicloLectivoId: 1, numero: 1, horario: 'DIURNO' },
    { id: 2, cicloId: 1, cicloLectivoId: 1, numero: 2, horario: 'VESPERTINO' },
    { id: 3, cicloId: 2, cicloLectivoId: 1, numero: 1, horario: 'NOCHE' },
    { id: 4, cicloId: 3, cicloLectivoId: 1, numero: 1, horario: 'DIURNO' },
    { id: 5, cicloId: 3, cicloLectivoId: 2, numero: 1, horario: 'VESPERTINO' }
];

let TIMEOUT;

window.addEventListener('FormsCreated', (event) => {
//window.addEventListener('DOMContentLoaded', (event) => {
    createAbreviatedNameEventListener();
    promise();
});

function createAbreviatedNameEventListener() {
    const form = Form.getForm('ciclo-form');
    form.getInput('ciclo-nombre').input.addEventListener('input', (event) => {
        const input = form.getInput('ciclo-nombre').getValue();
        const acronimoInput = form.getInput('ciclo-abreviacion');
        if (input && input.length > 0) {
            acronimoInput.retrack(
                input.split(' ')
                     .map(word => {
                        word = word.toLowerCase();
                        if (['de', 'y', 'la', 'los'].includes(word)) return '';
                        return word.charAt(0).toUpperCase();
                     })
                     .join('')
                );
        } else {
            acronimoInput.input.value = '';
        }
    });
}

function promise() {
    tableLoading();

    Promise.all([
        fetchCiclos(),
        fetchCiclosLectivos(),
        fetchGrupos()
    ]).then(
        ([
            ciclos,
            ciclosLectivos,
            grupos
        ]) => {
            drawTable(ciclos, ciclosLectivos, grupos);
        }
    ).catch((error) => {
        //tableFail();
        drawTable(fetchedCiclos, fetchedCiclosLectivos, fetchedGrupos);
    });
}

function fetchCiclos() {
    return new Promise((res, rej) => {
        fetch('/api/ciclos/all')
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    res(data);
                } else {
                    rej(new Error('No se encontraron ciclos'));
                }
            })
            .catch((error) => {
                rej(error);
            });
    });
}

function fetchCiclosLectivos() {
    return new Promise((res, rej) => {
        fetch('/api/ciclosLectivos/all')
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                res(data);
            } else {
                rej(new Error('No se encontraron ciclos lectivos'));
            }
        })
        .catch((error) => {
            rej(error);
        });
    });
}

function fetchGrupos() {
    return new Promise((res, rej) => {
        fetch('/api/grupos/all')
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                res(data);
            } else {
                rej(new Error('No se encontraron grupos'));
            }
        })
        .catch((error) => {
            rej(error);
        });
    });
}

function tableLoading() {
    const ciclosGridWrapper = document.getElementById('display-grid-wrapper');
    ciclosGridWrapper.innerHTML = "";

    const spinner = document.createElement('div');
    spinner.classList.add('spinner', 'spinner-border', 'text-primary');
    spinner.setAttribute('role', 'status');
    spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';
    ciclosGridWrapper.appendChild(spinner);
}

function tableFail() {
    const ciclosGridWrapper = document.getElementById('display-grid-wrapper');
    ciclosGridWrapper.innerHTML = "";

    const errorMessageSection = document.createElement('div');
    errorMessageSection.id = 'error-message-section';
    errorMessageSection.innerHTML = `
        <svg class="cross-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48" xml:space="preserve">
            <path d="M 40.9706 35.3137 L 29.6569 24 L 40.9706 12.6863 C 42.3848 11.2721 42.3848 8.4437 40.9706 7.0294 S 36.7279 5.6152 35.3137 7.0294 L 24 18.3431 L 12.6863 7.0294 C 11.2721 5.6152 8.4437 5.6152 7.0294 7.0294 S 5.6152 11.2721 7.0294 12.6863 L 18.3431 24 L 7.0294 35.3137 C 5.6152 36.7279 5.6152 39.5563 7.0294 40.9706 S 11.2721 42.3848 12.6863 40.9706 L 24 29.6569 L 35.3137 40.9706 C 36.7279 42.3848 39.5563 42.3848 40.9706 40.9706 S 42.3848 36.7279 40.9706 35.3137 Z"/>
        </svg>
    `;
    ciclosGridWrapper.appendChild(errorMessageSection);

    clearTimeout(TIMEOUT);
    TIMEOUT = setTimeout(() => {
        clearTimeout(TIMEOUT);
        
        tableLoading();
        TIMEOUT = setTimeout(() => {
            promise();
        }, 8000);
    }, 2000);
}

function drawTable(ciclos, ciclosLectivos, grupos) {
    const ciclosList = [];

    const ciclosGridWrapper = document.getElementById('display-grid-wrapper');
    ciclosGridWrapper.innerHTML = "";

    const gridData = document.createElement('div');
    gridData.id = 'grid-data';
    ciclosGridWrapper.appendChild(gridData);

    const numRows = ciclos.length + 2;

    gridData.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
    gridData.style.gridTemplateColumns = `250px repeat(${ciclosLectivos.length}, 1fr) 80px`;

    const topLeftCell = document.createElement('div');
    topLeftCell.classList.add('cell', 'sticky', 'cell-column-header', 'cell-row-header');

    const topLeftCellContent = document.createElement('div');
    topLeftCellContent.classList.add('cell-content', 'cell-column-header', 'cell-row-header');
    topLeftCellContent.textContent = "Ciclos";
    topLeftCell.appendChild(topLeftCellContent);
    gridData.appendChild(topLeftCell);
    ciclosList.push(topLeftCell);

    for (const cl of ciclosLectivos) {
        gridData.appendChild(createCicloLectivoCell(cl));
    }

    const lastColumn = document.createElement('div');
    lastColumn.classList.add('cell', 'hoverable', 'last-column', 'cell-column-header', 'add-element');

    const lastColumnContent = document.createElement('div');
    lastColumnContent.classList.add('cell-content', 'empty-cell', 'cell-column-header');
    lastColumnContent.innerHTML = getPlusSvg();
    lastColumnContent.title = "Añadir ciclo lectivo";
    lastColumn.onclick = () => {
        addCicloLectivo();
    };

    lastColumn.appendChild(lastColumnContent);
    gridData.appendChild(lastColumn);

    let rowIdx = 2; // Start after header row
    let totalRows = 1;

    ciclos.forEach((ciclo) => {
        const cicloDiv = createCicloCell(ciclo, rowIdx);
        gridData.appendChild(
            cicloDiv
        );
        ciclosList.push(cicloDiv);

        for (let year = 1; year <= ciclo.years; year++, rowIdx++) {
            for (let j = 0; j < ciclosLectivos.length; j++) {
                const cicloLectivo = ciclosLectivos[j];

                // Find grupo for this ciclo, year, cicloLectivo
                const grupo = grupos.find(g => g.cicloId === ciclo.id && g.cicloLectivoId === cicloLectivo.id && g.numero === year);

                const cell = document.createElement('div');
                cell.classList.add('cell', 'hoverable');
                cell.style.gridRow = rowIdx;
                cell.style.gridColumn = j + 2;
                gridData.appendChild(cell);

                const display = grupo ?
                                createFilledCell(year, ciclo, grupo) :
                                createEmptyCell(ciclo, cicloLectivo, year);
                cell.appendChild(display);
            }
            totalRows++;
        }
    });

    const lastRow = document.createElement('div');
    lastRow.classList.add('cell', 'hoverable', 'last-row', 'sticky', 'cell-row-header');
    lastRow.style.gridRow = `${rowIdx} / span ${totalRows}`;

    const lastRowContent = document.createElement('div');
    lastRowContent.classList.add('cell-content', 'empty-cell', 'cell-row-header', 'full');
    lastRowContent.innerHTML = getPlusSvg();
    lastRowContent.onclick = () => {
        addCiclo();
    };

    lastRow.appendChild(lastRowContent);
    ciclosGridWrapper.appendChild(lastRow);

    lastColumn.style.gridRow = `1 / span ${totalRows}`;

    gridData.addEventListener('scroll', function () {
        ciclosList.forEach(ciclo => {
            const child = ciclo.firstChild;

            if (gridData.scrollLeft === 0)  child.classList.add('full');
            else                            child.classList.remove('full');
        });
    });

    setTimeout(() => {
        gridData.scrollLeft = gridData.scrollWidth;
    }, 0);
}

function getPlusSvg() {
    return `
    <svg class="plus-svg" viewBox="0 0 48 48">
        <path d="M 44 20 L 28 20 L 28 4 C 28 2 26 0 24 0 S 20 2 20 4 L 20 20 L 4 20 C 2 20 0 22 0 24 S 2 28 4 28 L 20 28 L 20 44 C 20 46 22 48 24 48 S 28 46 28 44 L 28 28 L 44 28 C 46 28 48 26 48 24 S 46 20 44 20 Z"/>
    </svg>`;
}

function createCicloLectivoCell(cicloLectivo) {
    const cell = document.createElement('div');
    cell.classList.add('cell', 'hoverable', 'cell-column-header');

    const cellContent = document.createElement('div');
    cellContent.classList.add('cell-content', 'cell-column-header', 'filled-cell');
    cellContent.innerHTML = `
        <span class="cell-title">${cicloLectivo.nombre}</span>
        <span class="cell-subtitle">${cicloLectivo.fechaInicio}</span>
        <svg class="edit-svg" viewBox="0 -0.5 25 25" xmlns="http://www.w3.org/2000/svg">
            <path d="M 13.2942 7.9588 L 13.2942 7.9588 Z M 6.811 14.8488 L 7.379 15.3385 C 7.3849 15.3317 7.3906 15.3248 7.3962 15.3178 L 6.811 14.8488 Z M 6.64 15.2668 L 5.8915 15.2179 L 5.8908 15.2321 L 6.64 15.2668 Z M 6.5 18.2898 L 5.7508 18.2551 C 5.7491 18.2923 5.7501 18.3296 5.754 18.3667 L 6.5 18.2898 Z M 7.287 18.9768 L 7.3115 19.7264 C 7.3615 19.7247 7.4113 19.7181 7.46 19.7065 L 7.287 18.9768 Z M 10.287 18.2658 L 10.46 18.9956 L 10.4716 18.9927 L 10.287 18.2658 Z M 10.672 18.0218 L 11.2506 18.4991 L 11.2571 18.491 L 10.672 18.0218 Z M 17.2971 10.959 L 17.2971 10.959 Z M 12.1269 7.0205 L 12.1269 7.0205 Z M 14.3 5.5098 L 14.8851 5.979 C 14.8949 5.9667 14.9044 5.9541 14.9135 5.9412 L 14.3 5.5098 Z M 15.929 5.1898 L 16.4088 4.6133 C 16.3849 4.5934 16.3598 4.5751 16.3337 4.5583 L 15.929 5.1898 Z M 18.166 7.0518 L 18.6968 6.5219 C 18.6805 6.5056 18.6635 6.4901 18.6458 6.4753 L 18.166 7.0518 Z M 18.5029 7.8726 L 19.2529 7.8768 V 7.8768 L 18.5029 7.8726 Z M 18.157 8.6898 L 17.632 8.1541 C 17.6108 8.175 17.5908 8.197 17.5721 8.2203 Z M 16.1271 10.0203 L 16.1271 10.0203 Z M 13.4537 7.3786 L 13.4537 7.3786 Z M 16.813 11.2329 L 16.813 11.2329 Z M 12.1238 7.0207 L 6.2258 14.3797 L 7.3962 15.3178 L 13.2942 7.9588 Z M 6.243 14.359 C 6.0356 14.5995 5.9123 14.9011 5.8916 15.218 L 7.3884 15.3156 C 7.3879 15.324 7.3846 15.3321 7.379 15.3385 L 6.243 14.359 Z M 5.8908 15.2321 L 5.7508 18.2551 L 7.2492 18.3245 L 7.3892 15.3015 L 5.8908 15.2321 Z M 5.754 18.3667 C 5.8356 19.1586 6.5159 19.7524 7.3115 19.7264 L 7.2625 18.2272 C 7.2593 18.2273 7.2577 18.2268 7.2567 18.2264 C 7.2553 18.2259 7.2534 18.2249 7.2514 18.2232 C 7.2495 18.2215 7.2482 18.2198 7.2475 18.2185 C 7.247 18.2175 7.2464 18.216 7.246 18.2128 L 5.754 18.3667 Z M 7.46 19.7065 L 10.46 18.9955 L 10.114 17.536 L 7.114 18.247 L 7.46 19.7065 Z M 10.4716 18.9927 C 10.7771 18.9151 11.05 18.7422 11.2506 18.499 L 10.0934 17.5445 C 10.0958 17.5417 10.0989 17.5397 10.1024 17.5388 L 10.4716 18.9927 Z M 11.2571 18.491 L 17.2971 10.959 L 16.1269 10.0206 L 10.0869 17.5526 L 11.2571 18.491 Z M 13.2971 7.959 L 14.8851 5.979 L 13.7149 5.0405 L 12.1269 7.0205 Z M 14.9135 5.9412 C 15.0521 5.7441 15.3214 5.6912 15.5243 5.8212 L 16.3337 4.5583 C 15.4544 3.9948 14.2873 4.2241 13.6865 5.0783 L 14.9135 5.9412 Z M 15.4492 5.7662 L 17.6862 7.6282 L 18.6458 6.4753 L 16.4088 4.6133 L 15.4492 5.7662 Z M 17.6352 7.5816 C 17.7111 7.6577 17.7535 7.761 17.7529 7.8685 L 19.2529 7.8768 C 19.2557 7.369 19.0555 6.8813 18.6968 6.5219 L 17.6352 7.5816 Z M 17.7529 7.8685 C 17.7524 7.976 17.7088 8.0789 17.632 8.1541 L 18.682 9.2254 C 19.0446 8.87 19.2501 8.3845 19.2529 7.8768 L 17.7529 7.8685 Z M 17.5721 8.2203 L 16.1271 10.0203 L 17.2969 10.9593 L 18.7419 9.1593 L 17.5721 8.2203 Z M 11.9703 7.6009 C 12.3196 9.9322 14.4771 11.5503 16.813 11.2329 L 16.611 9.7466 C 15.0881 9.9535 13.6815 8.8986 13.4537 7.3786 Z"/>
        </svg>
        <svg class="delete-svg" viewBox="-6 -6 60 60" xmlns="http://www.w3.org/2000/svg">
            <path d="M 42 3 H 28 a 2 2 0 0 0 -2 -2 H 22 a 2 2 0 0 0 -2 2 H 6 A 2 2 0 0 0 6 7 H 42 a 2 2 0 0 0 0 -4 Z M 39 9 a 2 2 0 0 0 -2 2 V 43 H 11 V 11 a 2 2 0 0 0 -4 0 V 45 a 2 2 0 0 0 2 2 H 39 a 2 2 0 0 0 2 -2 V 11 A 2 2 0 0 0 39 9 Z M 21 37 V 19 a 2 2 0 0 0 -4 0 V 37 a 2 2 0 0 0 4 0 Z M 31 37 V 19 a 2 2 0 0 0 -4 0 V 37 a 2 2 0 0 0 4 0 Z"/>
        </svg>
    `;
    cell.appendChild(cellContent);

    return cell;
}

function createCicloCell(ciclo, rowIdx) {
    const cicloHeader = document.createElement('div');
    cicloHeader.classList.add('cell', 'hoverable', 'sticky', 'cell-row-header');
    cicloHeader.style.gridRow = `${rowIdx} / span ${ciclo.years}`;
    cicloHeader.style.gridColumn = '1';

    const cellContent = document.createElement('div');
    cellContent.classList.add('cell-content', 'cell-row-header');
    cellContent.innerHTML = `
        <span class="cell-title">${ciclo.nombre} <span class="cell-subtitle">(${ciclo.acronimo})</span></span>
        <span class="cell-actions">
            <svg class="edit-svg" viewBox="0 -0.5 25 25" xmlns="http://www.w3.org/2000/svg">
                <path d="M 13.2942 7.9588 L 13.2942 7.9588 Z M 6.811 14.8488 L 7.379 15.3385 C 7.3849 15.3317 7.3906 15.3248 7.3962 15.3178 L 6.811 14.8488 Z M 6.64 15.2668 L 5.8915 15.2179 L 5.8908 15.2321 L 6.64 15.2668 Z M 6.5 18.2898 L 5.7508 18.2551 C 5.7491 18.2923 5.7501 18.3296 5.754 18.3667 L 6.5 18.2898 Z M 7.287 18.9768 L 7.3115 19.7264 C 7.3615 19.7247 7.4113 19.7181 7.46 19.7065 L 7.287 18.9768 Z M 10.287 18.2658 L 10.46 18.9956 L 10.4716 18.9927 L 10.287 18.2658 Z M 10.672 18.0218 L 11.2506 18.4991 L 11.2571 18.491 L 10.672 18.0218 Z M 17.2971 10.959 L 17.2971 10.959 Z M 12.1269 7.0205 L 12.1269 7.0205 Z M 14.3 5.5098 L 14.8851 5.979 C 14.8949 5.9667 14.9044 5.9541 14.9135 5.9412 L 14.3 5.5098 Z M 15.929 5.1898 L 16.4088 4.6133 C 16.3849 4.5934 16.3598 4.5751 16.3337 4.5583 L 15.929 5.1898 Z M 18.166 7.0518 L 18.6968 6.5219 C 18.6805 6.5056 18.6635 6.4901 18.6458 6.4753 L 18.166 7.0518 Z M 18.5029 7.8726 L 19.2529 7.8768 V 7.8768 L 18.5029 7.8726 Z M 18.157 8.6898 L 17.632 8.1541 C 17.6108 8.175 17.5908 8.197 17.5721 8.2203 Z M 16.1271 10.0203 L 16.1271 10.0203 Z M 13.4537 7.3786 L 13.4537 7.3786 Z M 16.813 11.2329 L 16.813 11.2329 Z M 12.1238 7.0207 L 6.2258 14.3797 L 7.3962 15.3178 L 13.2942 7.9588 Z M 6.243 14.359 C 6.0356 14.5995 5.9123 14.9011 5.8916 15.218 L 7.3884 15.3156 C 7.3879 15.324 7.3846 15.3321 7.379 15.3385 L 6.243 14.359 Z M 5.8908 15.2321 L 5.7508 18.2551 L 7.2492 18.3245 L 7.3892 15.3015 L 5.8908 15.2321 Z M 5.754 18.3667 C 5.8356 19.1586 6.5159 19.7524 7.3115 19.7264 L 7.2625 18.2272 C 7.2593 18.2273 7.2577 18.2268 7.2567 18.2264 C 7.2553 18.2259 7.2534 18.2249 7.2514 18.2232 C 7.2495 18.2215 7.2482 18.2198 7.2475 18.2185 C 7.247 18.2175 7.2464 18.216 7.246 18.2128 L 5.754 18.3667 Z M 7.46 19.7065 L 10.46 18.9955 L 10.114 17.536 L 7.114 18.247 L 7.46 19.7065 Z M 10.4716 18.9927 C 10.7771 18.9151 11.05 18.7422 11.2506 18.499 L 10.0934 17.5445 C 10.0958 17.5417 10.0989 17.5397 10.1024 17.5388 L 10.4716 18.9927 Z M 11.2571 18.491 L 17.2971 10.959 L 16.1269 10.0206 L 10.0869 17.5526 L 11.2571 18.491 Z M 13.2971 7.959 L 14.8851 5.979 L 13.7149 5.0405 L 12.1269 7.0205 Z M 14.9135 5.9412 C 15.0521 5.7441 15.3214 5.6912 15.5243 5.8212 L 16.3337 4.5583 C 15.4544 3.9948 14.2873 4.2241 13.6865 5.0783 L 14.9135 5.9412 Z M 15.4492 5.7662 L 17.6862 7.6282 L 18.6458 6.4753 L 16.4088 4.6133 L 15.4492 5.7662 Z M 17.6352 7.5816 C 17.7111 7.6577 17.7535 7.761 17.7529 7.8685 L 19.2529 7.8768 C 19.2557 7.369 19.0555 6.8813 18.6968 6.5219 L 17.6352 7.5816 Z M 17.7529 7.8685 C 17.7524 7.976 17.7088 8.0789 17.632 8.1541 L 18.682 9.2254 C 19.0446 8.87 19.2501 8.3845 19.2529 7.8768 L 17.7529 7.8685 Z M 17.5721 8.2203 L 16.1271 10.0203 L 17.2969 10.9593 L 18.7419 9.1593 L 17.5721 8.2203 Z M 11.9703 7.6009 C 12.3196 9.9322 14.4771 11.5503 16.813 11.2329 L 16.611 9.7466 C 15.0881 9.9535 13.6815 8.8986 13.4537 7.3786 Z"/>
            </svg>
            <svg class="delete-svg" viewBox="-6 -6 60 60" xmlns="http://www.w3.org/2000/svg">
                <path d="M 42 3 H 28 a 2 2 0 0 0 -2 -2 H 22 a 2 2 0 0 0 -2 2 H 6 A 2 2 0 0 0 6 7 H 42 a 2 2 0 0 0 0 -4 Z M 39 9 a 2 2 0 0 0 -2 2 V 43 H 11 V 11 a 2 2 0 0 0 -4 0 V 45 a 2 2 0 0 0 2 2 H 39 a 2 2 0 0 0 2 -2 V 11 A 2 2 0 0 0 39 9 Z M 21 37 V 19 a 2 2 0 0 0 -4 0 V 37 a 2 2 0 0 0 4 0 Z M 31 37 V 19 a 2 2 0 0 0 -4 0 V 37 a 2 2 0 0 0 4 0 Z"/>
            </svg>
        </span>
    `;

    cicloHeader.appendChild(cellContent);
    return cicloHeader;
}

function createFilledCell(year, ciclo, grupo) {
    const cell = document.createElement('div');
    cell.className = 'cell-content filled-cell';
    cell.innerHTML = `
        <span class="cell-title">${year}º ${ciclo.acronimo}</span>
        <span class="cell-subtitle">${HORARIOS[grupo.horario]}</span>
        <svg class="edit-svg" onclick="editGrupo(${grupo})" viewBox="0 -0.5 25 25" xmlns="http://www.w3.org/2000/svg">
            <path d="M 13.2942 7.9588 L 13.2942 7.9588 Z M 6.811 14.8488 L 7.379 15.3385 C 7.3849 15.3317 7.3906 15.3248 7.3962 15.3178 L 6.811 14.8488 Z M 6.64 15.2668 L 5.8915 15.2179 L 5.8908 15.2321 L 6.64 15.2668 Z M 6.5 18.2898 L 5.7508 18.2551 C 5.7491 18.2923 5.7501 18.3296 5.754 18.3667 L 6.5 18.2898 Z M 7.287 18.9768 L 7.3115 19.7264 C 7.3615 19.7247 7.4113 19.7181 7.46 19.7065 L 7.287 18.9768 Z M 10.287 18.2658 L 10.46 18.9956 L 10.4716 18.9927 L 10.287 18.2658 Z M 10.672 18.0218 L 11.2506 18.4991 L 11.2571 18.491 L 10.672 18.0218 Z M 17.2971 10.959 L 17.2971 10.959 Z M 12.1269 7.0205 L 12.1269 7.0205 Z M 14.3 5.5098 L 14.8851 5.979 C 14.8949 5.9667 14.9044 5.9541 14.9135 5.9412 L 14.3 5.5098 Z M 15.929 5.1898 L 16.4088 4.6133 C 16.3849 4.5934 16.3598 4.5751 16.3337 4.5583 L 15.929 5.1898 Z M 18.166 7.0518 L 18.6968 6.5219 C 18.6805 6.5056 18.6635 6.4901 18.6458 6.4753 L 18.166 7.0518 Z M 18.5029 7.8726 L 19.2529 7.8768 V 7.8768 L 18.5029 7.8726 Z M 18.157 8.6898 L 17.632 8.1541 C 17.6108 8.175 17.5908 8.197 17.5721 8.2203 Z M 16.1271 10.0203 L 16.1271 10.0203 Z M 13.4537 7.3786 L 13.4537 7.3786 Z M 16.813 11.2329 L 16.813 11.2329 Z M 12.1238 7.0207 L 6.2258 14.3797 L 7.3962 15.3178 L 13.2942 7.9588 Z M 6.243 14.359 C 6.0356 14.5995 5.9123 14.9011 5.8916 15.218 L 7.3884 15.3156 C 7.3879 15.324 7.3846 15.3321 7.379 15.3385 L 6.243 14.359 Z M 5.8908 15.2321 L 5.7508 18.2551 L 7.2492 18.3245 L 7.3892 15.3015 L 5.8908 15.2321 Z M 5.754 18.3667 C 5.8356 19.1586 6.5159 19.7524 7.3115 19.7264 L 7.2625 18.2272 C 7.2593 18.2273 7.2577 18.2268 7.2567 18.2264 C 7.2553 18.2259 7.2534 18.2249 7.2514 18.2232 C 7.2495 18.2215 7.2482 18.2198 7.2475 18.2185 C 7.247 18.2175 7.2464 18.216 7.246 18.2128 L 5.754 18.3667 Z M 7.46 19.7065 L 10.46 18.9955 L 10.114 17.536 L 7.114 18.247 L 7.46 19.7065 Z M 10.4716 18.9927 C 10.7771 18.9151 11.05 18.7422 11.2506 18.499 L 10.0934 17.5445 C 10.0958 17.5417 10.0989 17.5397 10.1024 17.5388 L 10.4716 18.9927 Z M 11.2571 18.491 L 17.2971 10.959 L 16.1269 10.0206 L 10.0869 17.5526 L 11.2571 18.491 Z M 13.2971 7.959 L 14.8851 5.979 L 13.7149 5.0405 L 12.1269 7.0205 Z M 14.9135 5.9412 C 15.0521 5.7441 15.3214 5.6912 15.5243 5.8212 L 16.3337 4.5583 C 15.4544 3.9948 14.2873 4.2241 13.6865 5.0783 L 14.9135 5.9412 Z M 15.4492 5.7662 L 17.6862 7.6282 L 18.6458 6.4753 L 16.4088 4.6133 L 15.4492 5.7662 Z M 17.6352 7.5816 C 17.7111 7.6577 17.7535 7.761 17.7529 7.8685 L 19.2529 7.8768 C 19.2557 7.369 19.0555 6.8813 18.6968 6.5219 L 17.6352 7.5816 Z M 17.7529 7.8685 C 17.7524 7.976 17.7088 8.0789 17.632 8.1541 L 18.682 9.2254 C 19.0446 8.87 19.2501 8.3845 19.2529 7.8768 L 17.7529 7.8685 Z M 17.5721 8.2203 L 16.1271 10.0203 L 17.2969 10.9593 L 18.7419 9.1593 L 17.5721 8.2203 Z M 11.9703 7.6009 C 12.3196 9.9322 14.4771 11.5503 16.813 11.2329 L 16.611 9.7466 C 15.0881 9.9535 13.6815 8.8986 13.4537 7.3786 Z"/>
        </svg>
        <svg class="delete-svg" onclick="deleteGroup(${grupo})" viewBox="-6 -6 60 60" xmlns="http://www.w3.org/2000/svg">
            <path d="M 42 3 H 28 a 2 2 0 0 0 -2 -2 H 22 a 2 2 0 0 0 -2 2 H 6 A 2 2 0 0 0 6 7 H 42 a 2 2 0 0 0 0 -4 Z M 39 9 a 2 2 0 0 0 -2 2 V 43 H 11 V 11 a 2 2 0 0 0 -4 0 V 45 a 2 2 0 0 0 2 2 H 39 a 2 2 0 0 0 2 -2 V 11 A 2 2 0 0 0 39 9 Z M 21 37 V 19 a 2 2 0 0 0 -4 0 V 37 a 2 2 0 0 0 4 0 Z M 31 37 V 19 a 2 2 0 0 0 -4 0 V 37 a 2 2 0 0 0 4 0 Z"/>
        </svg>
    `;
    return cell;
}

function createEmptyCell(ciclo, cicloLectivo, numero) {
    const cell = document.createElement('div');
    cell.className = 'cell-content empty-cell add-element';
    cell.innerHTML = getPlusSvg();
    cell.onclick = addGrupo.bind(null, ciclo, cicloLectivo, numero);
    return cell;
}

function collapseAll() {
    const forms = [
        Form.getForm('ciclo-form'),
        Form.getForm('ciclo-lectivo-form'),
        Form.getForm('grupo-form')
    ];
    forms.forEach(form => {
        form.form.parentNode.classList.add('collapsed');
        //form.reset();
    });
}






function addGrupo(ciclo, cicloLectivo, numero) {
    collapseAll();

    const form = Form.getForm('grupo-form');
    form.form.parentNode.classList.remove('collapsed');

    form.onsubmit = (event) => {
        event.preventDefault();

        const cicloLectivoId = cicloLectivo.id;
        const cicloId = ciclo.id;
        const horario = form.getInput('grupo-horario').getValue();

        let grupo = {
            ciclo: cicloId,
            cicloLectivo: cicloLectivoId,
            numero: numero,
            horario: horario
        };

        fetch('/api/grupos/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(grupo)
        }).then(response => {
            if (response.ok || response.status === 201) {
                promise();
            } else {
                form.showError('Error al crear el grupo');
            }
        }).catch(error => {
            console.error('Error al crear el grupo:', error);
            form.showError('Error al crear el grupo');
        });
    }
}

function addCiclo() {
    collapseAll();

    const form = Form.getForm('ciclo-form');
    form.form.parentNode.classList.remove('collapsed');

    form.onsubmit = (event) => {
        const name = form.getInput('ciclo-nombre').getValue();
        const acronimo = form.getInput('ciclo-abreviacion').getValue();
        const familiaProfesional = form.getInput('ciclo-familia').getValue();
        const nivel = form.getInput('ciclo-nivel').getValue();
        const years = form.getInput('ciclo-years').getValue();
        const horasPracticas = form.getInput('ciclo-practicas').getValue();

        let ciclo = {
            nombre: name,
            acronimo: acronimo,
            familiaProfesional: familiaProfesional,
            nivel: nivel,
            years: years,
            horasPracticas: horasPracticas
        }

        fetch('/api/ciclos/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ciclo)
        }).then(response => {
            if (response.ok || response.status === 201) {
                promise();
            } else {
                form.showError('Error al crear el ciclo');
            }
        }).catch(error => {
            console.error('Error al crear el ciclo:', error);
            form.showError('Error al crear el ciclo');
        });
    }
}

function addCicloLectivo() {
    collapseAll();

    const form = Form.getForm('ciclo-lectivo-form');
    form.form.parentNode.classList.remove('collapsed');

    form.onsubmit = (event) => {
        const name = form.getInput('ciclo-lectivo-nombre').getValue();
        const fechaInicio = form.getInput('ciclo-lectivo-fecha-inicio').getValue();

        let cicloLectivo = {
            nombre: name,
            fechaInicio: fechaInicio
        };

        fetch('/api/ciclosLectivos/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cicloLectivo)
        }).then(response => {
            if (response.ok || response.status === 201) {
                promise();
            } else {
                form.showError('Error al crear el ciclo lectivo');
            }
        }).catch(error => {
            console.error('Error al crear el ciclo lectivo:', error);
            form.showError('Error al crear el ciclo lectivo');
        });
    }
}

function removeGrupo(grupo) {
    if (!confirm(`¿Estás seguro de que quieres eliminar el grupo ${grupo.numero} del ciclo ${grupo.ciclo.nombre} (${grupo.ciclo.acronimo})?`)) {
        return;
    }

    fetch(`/api/grupos/${grupo.id}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            promise();
        } else {
            alert('Error al eliminar el grupo');
        }
    }).catch(error => {
        console.error('Error al eliminar el grupo:', error);
        alert('Error al eliminar el grupo');
    });
}

function removeCiclo(ciclo) {
    if (!confirm(`¿Estás seguro de que quieres eliminar el ciclo ${ciclo.nombre} (${ciclo.acronimo})?`)) {
        return;
    }

    fetch(`/api/ciclos/${ciclo.id}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            promise();
        } else {
            alert('Error al eliminar el ciclo');
        }
    }).catch(error => {
        console.error('Error al eliminar el ciclo:', error);
        alert('Error al eliminar el ciclo');
    });
}

function removeCicloLectivo(cicloLectivo) {
    if (!confirm(`¿Estás seguro de que quieres eliminar el ciclo lectivo ${cicloLectivo.nombre}?`)) {
        return;
    }

    fetch(`/api/ciclosLectivos/${cicloLectivo.id}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            promise();
        } else {
            alert('Error al eliminar el ciclo lectivo');
        }
    }).catch(error => {
        console.error('Error al eliminar el ciclo lectivo:', error);
        alert('Error al eliminar el ciclo lectivo');
    });
}

function editGrupo(grupo) {
    collapseAll();

    const form = Form.getForm('grupo-form');
    form.form.parentNode.classList.remove('collapsed');

    form.getInput('grupo-id').setValue(grupo.id);
    form.getInput('grupo-numero').setValue(grupo.numero);
    form.getInput('grupo-ciclo').setValue(grupo.ciclo.id);
    form.getInput('grupo-ciclo-lectivo').setValue(grupo.cicloLectivo.id);
    form.getInput('grupo-horario').setValue(grupo.horario);

    form.onsubmit = (event) => {
        event.preventDefault();
        // Aquí se puede agregar la lógica para actualizar el grupo
    }
}

function editCiclo(ciclo) {
    collapseAll();

    const form = Form.getForm('ciclo-form');
    form.form.parentNode.classList.remove('collapsed');

    form.getInput('ciclo-id').setValue(ciclo.id);
    form.getInput('ciclo-nombre').setValue(ciclo.nombre);
    form.getInput('ciclo-acronimo').setValue(ciclo.acronimo);
    form.getInput('ciclo-nivel').setValue(ciclo.nivel);
    form.getInput('ciclo-anos').setValue(ciclo.years);

    form.onsubmit = (event) => {
        event.preventDefault();
        // Aquí se puede agregar la lógica para actualizar el ciclo
    }
}

function editCicloLectivo(cicloLectivo) {
    collapseAll();

    const form = Form.getForm('ciclo-lectivo-form');
    form.form.parentNode.classList.remove('collapsed');

    form.getInput('ciclo-lectivo-id').setValue(cicloLectivo.id);
    form.getInput('ciclo-lectivo-nombre').setValue(cicloLectivo.nombre);
    form.getInput('ciclo-lectivo-fecha-inicio').setValue(cicloLectivo.fechaInicio);

    form.onsubmit = (event) => {
        event.preventDefault();
        // Aquí se puede agregar la lógica para actualizar el ciclo lectivo
    }
}
