import { Input } from './Input.js';

export class FileInput extends Input {
    constructor(input) {
        super(input);
        this.validate = () => {
            const file = this.input.files[0];
            if (!file) return true; // No file selected, considered valid
            const allowedExtensions = this.input.getAttribute('accept')?.split(',') || [];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            return allowedExtensions.includes(`.${fileExtension}`);
        };
    }

    init() {
        this.buildFileInput();
        this.createValidityElements();
    }

    buildFileInput() {
        this.input.classList.add('vanished');

        this.fakeInput = document.createElement('div');
        this.fakeInput.classList.add('fake-input');
        this.fakeInput.innerText = 'Ningún archivo seleccionado';
        this.fakeInput.addEventListener('click', (event) => {
            this.input.click();
        });

        this.parent.appendChild(this.fakeInput);

        this.buildLabel();
        this.states.active = true;
        this.updateState();

        this.label.addEventListener('click', (event) => {
            this.input.click();
        });

        this.input.addEventListener('change', (event) => {
            this.setText();
            this.checkChange();
        });
        this.input.addEventListener('focus', (event) => {
            this.states.focus = true;
            this.fakeInput.classList.add('focus');
            this.updateState();
        });

        //  When focus is lost, moves the label back
        this.input.addEventListener('blur', (event) => {
            this.states.focus = false;
            this.fakeInput.classList.remove('focus');
            this.updateState();
        });

        window.addEventListener('resize', () => this.setText());
    }

    setText() {
        const file = this.input.files[0];
        this.fakeInput.innerText = '';
        if (file) {
            const computedText = this.computeText(file.name);
            this.fakeInput.innerText = computedText;
            return;
        }
        this.fakeInput.innerText = 'Ningún archivo seleccionado';
    }

    computeText(value) {
        let left = 0, right = 0;
        const style = window.getComputedStyle(this.fakeInput);
        const paddingLeft = parseFloat(style.getPropertyValue("padding-left"));
        const paddingRight = parseFloat(style.getPropertyValue("padding-right"));
        const canvasContext = document.createElement("canvas").getContext("2d");
        canvasContext.font = style.getPropertyValue("font");
        while (true) {
            let truncated = value;
            if (left + right > 0) {
                const middle = (value.length - left - right) / 2;
                truncated = value.slice(0, Math.ceil(middle)) +
                            '...' +
                            value.slice(value.length - Math.floor(middle));
            }
            const inputWidth = canvasContext.measureText(truncated).width;
            const totalWidth = paddingLeft + paddingRight + inputWidth;
            if (totalWidth <= this.fakeInput.clientWidth) return truncated;

            // Remove one more letter from either side (alternate sides)
            if ((left + right) % 2 === 0) left++;
            else right++;

            if (left + right >= value.length) return '...';
        }
    }

    checkChange() {
        this.parent.classList.remove('invalid');
        this.showValidity();
    }
}
