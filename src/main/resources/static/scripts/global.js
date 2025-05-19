document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('.input').forEach(input => {
        switch (input.getAttribute('type')) {
            case 'email':
                new EmailInput(input);
                break;
            case 'password':
                new PasswordInput(input);
                break;
            default:
                new Input(input);
        }
    });
    createLegend();
});

function createLegend() {
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

    document.getElementById('inputs').appendChild(legend);
}

class Input {
    static entries = [];

    constructor(input) {
        // Variable definition
        this.input = input;
        this.parent = input.parentNode;

        // Put here so it's not twice.
        let isBeingTracked = input.getAttribute('data-track-changes') === 'true';
        this.states = {
            'active':       false,
            'focus':        false,
            'required':     input.getAttribute('data-required') === 'true',
            'frozen':       input.getAttribute('data-freeze') === 'true',
            'tracked':      isBeingTracked,
            'changed':      false,
            'trackedValue': isBeingTracked ? input.value : null
        }

        // Function calling
        this.buildInput();
        this.updateState();

        // Storage
        Input.entries.push(this);
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
        let verticalPosition = this.parent.offsetHeight / 2 - 12                  - 1;
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
        if (this.states.active)     this.label.classList.add('active');
        else                        this.label.classList.remove('active');

        if (this.states.focus)      this.label.classList.add('focus');
        else                        this.label.classList.remove('focus');

        if (this.states.required)   this.label.classList.add('required');
        else                        this.label.classList.remove('required');

        if (this.states.frozen) {
            this.label.classList.add('frozen');
            this.input.setAttribute('disabled', 'disabled');
            this.input.setAttribute('frozen', 'frozen');
        } else {
            this.label.classList.remove('frozen');
            this.input.removeAttribute('disabled');
            this.input.removeAttribute('frozen');
        }

        if (this.states.tracked)    this.label.classList.add('tracked');
        else                        this.label.classList.remove('tracked');

        if (this.states.changed)    this.label.classList.add('changed');
        else                        this.label.classList.remove('changed');
    
        console.log(this.states);
    }

    checkChange() {
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
     * Changes the value that is beign tracked.
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
        this.input.value = this.states.trackedValue;
        this.checkChange();
        this.updateState();
    }

    equals(id) {
        return this.input.id === id;
    }

    isDifferent() {
        return this.tracked && this.input.value !== this.states.trackedValue;
    }

    /* --------------------------- STATIC FUNCTIONS --------------------------- */
    static anyChanged() {
        return Input.entries.some((input) => {return input.isDifferent();});
    }

}

class PasswordInput extends Input {

    constructor(input) {
        super(input);
        this.buildPassword();
    }

    buildPassword() {
        if (this.input.type !== 'password') return;

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

class EmailInput extends Input {

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

        this.buildEmail();
    }

    buildEmail() {
        this.autocomplete = document.createElement('p');
        this.autocomplete.classList.add('autocomplete', 'hidden');
        this.autocomplete.addEventListener('click', (event) => {this.input.focus();});
        this.autocomplete.style.font = window.getComputedStyle(this.input).font;

        this.parent.appendChild(this.autocomplete);

        this.input.addEventListener('input', (event) => {
            const index = this.input.value.indexOf('@');

            if (index === -1) {
                if (this.input.value.length === 0) {
                    this.hide();
                    return;
                }
                // Muestra el primer dominio por defecto
                this.autocomplete.innerText = EmailInput.COMMON_DOMAINS[0];
                this.show();
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

            if (bestMatch !== null) {
                this.autocomplete.innerText = bestMatch.substring(domainMatchLength);
                this.show();
            } else {
                this.hide();
            }
        });

        this.input.addEventListener('keydown', (event) => {
            if (! this.shown) return;
            if (event.key === 'Tab')
                this.input.value += this.autocomplete.innerText;
            
            if (event.key === 'Tab' || event.key === 'Escape')
                this.hide();
        });
    }

    show() {
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
