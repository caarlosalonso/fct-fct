window.addEventListener('FormsCreated', (event) => {
    const form = Form.getForm('login-form');
    if (! form) {
        console.error("Form with ID 'login-form' not found.");
        return;
    }

    form.onsubmit = () => {
        console.log("Form sent");

        const email = form.getInput("email").value.trim().toLowerCase();
        const password = form.getInput("password").value.trim();

        // Information to be sent
        const data = {
            email: email,
            password: password,
        };

        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (response.ok) {
                window.location.href = "/alumnado";
            }
            form.showErrorMessage("Login fallido: Email o contraseña incorrectos.");
        })
        .catch(error => {
            console.error("Error during login:", error);
            form.showErrorMessage("Internal Server Error");
        });
    }
});
