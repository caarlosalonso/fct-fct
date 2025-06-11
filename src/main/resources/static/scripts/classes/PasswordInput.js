import { TextInput } from "./TextInput.js";

export class PasswordInput extends TextInput {
    constructor(input) {
        super(input);
        this.validate = () => {
            return true;
        }
    }

    init(form) {
        super.init(form);
        this.buildPassword();
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
        img.src = '/images/eye.svg';
        img.alt = 'Toggle password visibility';
        this.icon.appendChild(img);

        /*  Click on the div instead of the image, so that the transparent parts
        of the image are not missable.                                          */
        this.icon.addEventListener('click', () => {
            if (this.input.type === 'password') {
                this.input.type = 'text';
                img.src = '/images/eye-crossed.svg';
            } else {
                this.input.type = 'password';
                img.src = '/images/eye.svg';
            }
        });
    }
}
