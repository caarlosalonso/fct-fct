document.addEventListener('DOMContentLoaded', (event) => {
    updateInputs();
    addVisibilityIconPasswords();
});

function updateInputs() {
    document.querySelectorAll('input').forEach(input => {
        const parent = input.parentNode;
        
        const label = document.createElement('p');
        label.classList.add('label');
        label.innerText = input.getAttribute('label');
        label.style.left = "7px";

        if (input.required) {
            label.classList.add('required');
            label.style.left = '5px';
        }

        /*  The label's height isn't computed until it is added to the DOM, but
            it can't be added to DOM until it's position is computed, because,
            if it's added later, it would slide into position which would look
            bad. To fix this, the height is assumed to be 24px.
                               parent's half height      label's half height   ?*/
        let verticalPosition = parent.offsetHeight / 2 - 12                  - 1;
        label.style.top = verticalPosition + "px";
        parent.appendChild(label);
        
        if (input.value.length > 0) {
            label.classList.add('active');
        }

        //  On focus, moves the label up
        input.addEventListener('focus', (event) => {
            label.classList.add('focus');
            if (input.value.length === 0) label.classList.add('active');
        });

        //  When focus is lost, moves the label back
        input.addEventListener('blur', (event) => {
            label.classList.remove('focus');
            if (input.value.length === 0) label.classList.remove('active');
        });

        /*  Makes it so, if the label is clicked, the input is focused          */
        label.addEventListener('click', (event) => {
            input.focus();
        });
    });
}

function addVisibilityIconPasswords() {
    document.querySelectorAll('input[type="password"]')
    .forEach(input => {
        const wrapper = input.parentNode;
        if (! wrapper.classList.contains('wrapper-password')) {
            wrapper.classList.add('wrapper-password');
        }

        const icon = document.createElement('div');
        icon.classList.add('password-icon');
        wrapper.appendChild(icon);

        const img = document.createElement('img');
        img.classList.add('password-icon-img');
        img.src = '../static/images/eye.svg';
        img.alt = 'Toggle password visibility';
        icon.appendChild(img);

        /*  Click on the div instead of the image, so that the transparent parts
        of the image are not missable.                                          */
        icon.addEventListener('click', () => {
            if (input.type === 'password') {
                input.type = 'text';
                img.src = '../static/images/eye-crossed.svg';
            } else {
                input.type = 'password';
                img.src = '../static/images/eye.svg';
            }
        });
    });
}
