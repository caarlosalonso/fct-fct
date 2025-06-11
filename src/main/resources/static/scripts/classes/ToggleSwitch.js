import { Input } from './Input.js';

export class ToggleSwitch extends Input {
    constructor(input) {
        super(input);
        this.checked = this.input.getAttribute('data-checked') === 'true';
        this.id = this.input.getAttribute('id');
    }

    init(form) {
        super.init(form);
        this.buildLabel();
        this.buildToggle();
        this.toggleElements();
        console.log('form: ', this.form);
    }

    buildLabel() {
        this.label = document.createElement('p');
        this.label.classList.add('label', 'toggle-label');
        this.label.textContent = this.input.getAttribute('label') || '';
        this.parent.appendChild(this.label);
    }

    buildToggle() {
        this.input.style.display = 'none';
        this.input.checked = this.checked;

        this.toggleWrapper = document.createElement('div');
        this.toggleWrapper.classList.add('toggle-wrapper');

        this.toggleContainer = document.createElement('div');
        this.toggleContainer.classList.add('toggle-container');

        this.toggleTrack = document.createElement('div');
        this.toggleTrack.classList.add('toggle-track');

        this.toggleThumb = document.createElement('div');
        this.toggleThumb.classList.add('toggle-thumb');

        this.toggleTrack.appendChild(this.toggleThumb);
        this.toggleContainer.appendChild(this.toggleTrack);
        this.parent.appendChild(this.toggleContainer);
        
        this.toggleWrapper.appendChild(this.label);
        this.toggleWrapper.appendChild(this.toggleContainer);
        this.parent.appendChild(this.toggleWrapper);

        this.updateToggleState();

        this.toggleContainer.addEventListener('click', () => {
            if (!this.states.frozen) {
                this.input.checked = !this.input.checked;
                this.updateToggleState();
                this.toggleElements();
                this.updateState();

                const event = new Event('change', { bubbles: true });
                this.input.dispatchEvent(event);
            }
        });

        this.label.addEventListener('click', (event) => {
            event.preventDefault();
            if (!this.states.frozen) {
                this.input.checked = !this.input.checked;
                this.updateToggleState();
                this.toggleElements();
                this.updateState();

                const changeEvent = new Event('change', { bubbles: true });
                this.input.dispatchEvent(changeEvent);
            }
        });

        this.toggleContainer.setAttribute('tabindex', '0');
        this.toggleContainer.addEventListener('keydown', (event) => {
            if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                if (!this.states.frozen) {
                    this.input.checked = !this.input.checked;
                    this.updateToggleState();
                    this.toggleElements();
                    this.updateState();

                    const changeEvent = new Event('change', { bubbles: true });
                    this.input.dispatchEvent(changeEvent);
                }
            }
        });
    }

    updateToggleState() {
        if (this.input.checked) {
            this.toggleTrack.classList.add('active');
            this.toggleThumb.classList.add('active');
        } else {
            this.toggleTrack.classList.remove('active');
            this.toggleThumb.classList.remove('active');
        }

        this.toggleContainer.classList.toggle('frozen', this.states.frozen);
        this.toggleContainer.classList.toggle('required', this.states.required);
        this.toggleContainer.classList.toggle('changed', this.states.changed);

        if (this.states.frozen) {
            this.toggleContainer.setAttribute('tabindex', '-1');
        } else {
            this.toggleContainer.setAttribute('tabindex', '0');
        }
    }

    toggleElements() {
        const elementFalse = document.getElementById(`${this.id}-false`);
        const elementTrue = document.getElementById(`${this.id}-true`);
        
        if (elementFalse && elementTrue) {
            elementFalse.querySelectorAll('input').forEach((input) => {
                const element = this.form.getInput(input.id);
                element.states.required = element.states.trueRequired;
                element.updateState();
            });

            elementTrue.querySelectorAll('input').forEach((input) => {
                const element = this.form.getInput(input.id);
                element.states.required = element.states.falseRequired;
                element.updateState();
            });

            if (this.input.checked) {
                elementFalse.classList.add('hidden');
                elementTrue.classList.remove('hidden');
                elementFalse.querySelectorAll('input').forEach((input) => {
                    const element = this.form.getInput(input.id);
                    element.states.required = false;
                    element.updateState();
                });
            } else {
                elementFalse.classList.remove('hidden');
                elementTrue.classList.add('hidden');
                elementTrue.querySelectorAll('input').forEach((input) => {
                    const element = this.form.getInput(input.id);
                    element.states.required = false;
                    element.updateState();
                });
            }
        }
    }

    setChecked(checked) {
        this.input.checked = checked;
        this.updateToggleState();
        this.toggleElements();
        this.updateState();
    }

    isChecked() {
        return this.input.checked;
    }

    updateState() {
        super.updateState();
        this.updateToggleState();
    }
}