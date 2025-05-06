document.addEventListener('DOMContentLoaded', (event) => {
    addVisibilityIconPasswords();
});

function addVisibilityIconPasswords() {
    document.querySelectorAll('input[type="password"]')
    .forEach(input => {
        const wrapper = input.parentNode;
        if (! wrapper.classList.contains('wrapper-password')) {
            wrapper.classList.add('wrapper-password');
        }

        const icon = document.createElement('img');
        icon.classList.add('password-icon');
        icon.src = '../static/images/eye.svg';
        icon.alt = 'Toggle password visibility';
        wrapper.appendChild(icon);

        icon.addEventListener('click', () => {
            if (input.type === 'password') {
                input.type = 'text';
                icon.src = '../static/images/eye-crossed.svg';
            } else {
                input.type = 'password';
                icon.src = '../static/images/eye.svg';
            }
        });
    });
}
