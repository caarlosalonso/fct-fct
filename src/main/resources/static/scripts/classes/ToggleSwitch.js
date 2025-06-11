import { Input } from './Input.js';

export class ToggleSwitch extends Input {
    constructor(input) {
        super(input);
        this.checked = this.input.getAttribute('data-checked') === 'true';
        this.id = this.input.getAttribute('id');
    }

    init() {
        super.init();
        this.buildLabel();
        this.buildToggle();
        this.toggleElements();
    }

    buildLabel() {
        this.label = document.createElement('p');
        this.label.classList.add('label', 'active');
        this.label.textContent = this.input.getAttribute('label') || '';
        this.parent.appendChild(this.label);
    }

    buildToggle() {
        this.input.style.display = 'none';
        this.input.checked = this.checked;

        this.toggleContainer = document.createElement('div');
        this.toggleContainer.classList.add('toggle-container');

        this.toggleTrack = document.createElement('div');
        this.toggleTrack.classList.add('toggle-track');

        this.toggleThumb = document.createElement('div');
        this.toggleThumb.classList.add('toggle-thumb');

        this.toggleTrack.appendChild(this.toggleThumb);
        this.toggleContainer.appendChild(this.toggleTrack);
        this.parent.appendChild(this.toggleContainer);

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
            if (this.input.checked) {
                elementFalse.classList.add('hidden');
                elementTrue.classList.remove('hidden');
            } else {
                elementFalse.classList.remove('hidden');
                elementTrue.classList.add('hidden');
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