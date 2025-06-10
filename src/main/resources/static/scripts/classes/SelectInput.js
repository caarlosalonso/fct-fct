import { TextInput } from './TextInput.js';

export class SelectInput extends TextInput {
    constructor(input) {
        super(input);
        this.options = [];
        this.dropdown = null;
        this.input.value = '';
        this.hiddenValue = '';
        this.validate = () => {
            if (this.isEmpty()) return true;
            return this.options.some(option => option.value === this.hiddenValue);
        };

        this.getValue = () => {
            return this.hiddenValue;
        }
    }

    init() {
        super.init();
        this.buildSelect();
        this.createDropdown();
        this.createOptions();
    }

    buildSelect() {
        const givenOptions = this.input.getAttribute('data-options');
        if (!givenOptions) {
            this.options = [];
            return;
        }

        this.options = [];
        givenOptions.split(';').forEach(option => {
            const [value, label] = option.split(':');
            this.options.push({ value, label });
        });
    }

    createDropdown() {
        this.dropdown = document.createElement('div');
        this.dropdown.classList.add('dropdown');
        this.parent.appendChild(this.dropdown);

        // Show dropdown on focus
        this.input.addEventListener('focus', () => {
            this.showDropdown();
        });

        // Hide dropdown on blur
        this.input.addEventListener('blur', () => {
            this.hideDropdown();
        });
    }

    createOptions() {
        this.options.forEach(({ value, label }) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('dropdown-option');
            optionElement.textContent = label;

            optionElement.addEventListener('click', () => {
                this.input.value = label;
                this.hiddenValue = value;
                this.states.active = true;
                this.states.focus = false;
                this.updateState();
                this.hideDropdown();
            });

            this.dropdown.appendChild(optionElement);
        });

        this.input.addEventListener('input', () => {
            const searchValue = this.input.value.trim().toLowerCase();
            this.options.forEach(option => {
                if (option.label.toLowerCase().includes(searchValue)) {
                    this.hiddenValue = option.value;
                }
            });
        });
    }

    showDropdown() {
        this.input.style.borderBottomLeftRadius = '0px';
        this.input.style.borderBottomRightRadius = '0px';
        this.dropdown.style.display = "block";
        this.dropdown.style.height = `${Math.min(this.dropdown.scrollHeight, 200)}px`;
        this.dropdown.style.overflowY = "auto";
    }

    hideDropdown() {
        this.dropdown.style.height = '0';
        this.dropdown.style.overflowY = 'hidden';
        setTimeout(() => {
            this.input.style.borderBottomLeftRadius = this.input.style.borderTopRightRadius;
            this.input.style.borderBottomRightRadius = this.input.style.borderTopRightRadius;
            this.dropdown.style.display = "none";
        }, 200);
    }

    updateDropdown(array, interacting = false) {
        while(this.dropdown && this.dropdown.firstChild) this.dropdown.removeChild(this.dropdown.firstChild);
        this.options = (!array || !Array.isArray(array)) ? [] : array;
        this.createOptions();
        this.dropdown.style.height = "auto";
        this.dropdown.style.overflowY = 'hidden';
        this.dropdown.style.display = "none";
        this.dropdown.style.height = '0px';

        if (interacting) {
            this.showDropdown();
        }
    }
}
