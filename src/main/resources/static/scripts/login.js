// Constant variables
// These variables are used to select elements from the DOM
const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");
const loginButton = document.getElementById("submit");

// Global variables
let errorShown = false; // false means hidden, true means shown.

// Event listeners
form.addEventListener("submit", (event) => {
    event.preventDefault();                 // Prevents the form from being sent.
    const email = emailInput.value;         // Gets the email's value
    const password = passwordInput.value;   // Gets the password's value

    // Validates the email
    if (! validateEmail(email)) {
        return;
    }

    // Information to be sent
    const data = {
        email: email.toLowerCase(),
        password: password,
    };

    fetch("login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then((response) => {
        switch (response.status) {
            case 200:
                // Redirect to the home page
                window.location.href = "/home";
                break;
            case 401:
                failManagement(true, 'Login fallido: Email o contraseña incorrectos.', [emailInput, passwordInput]); // Fails login
                break;
            case 500:
                failManagement(true, 'Internal Server Error', []);
                break;
            default:
                // Handle other status codes if necessary
                console.error("Unexpected response status:", response.status);
                break;
        }
    })
});

passwordInput.addEventListener("input", (event) => {
    if (errorShown) {
        failManagement(false, '', [passwordInput]); // Hides the error message
    }
});

emailInput.addEventListener("input", (event) => {
    if (errorShown) {
        failManagement(false, '', [emailInput]); // Hides the error message
    }
});

// Functions
/**
 * Manages the failure of the login's inputs.
 *
 * @param {boolean} fail Determines if it should fail or not.
 * @param {string} message Message that appears when it fails.
 * @param {Array} inputs List of inputs that fail the criteria.
 * @returns {void}
 */
function failManagement(fail, message, inputs) {
    if (fail) {
        showErrorMessage(message);              // Shows the error message
        inputs.forEach((input) => {
            input.classList.add("error");       // Adds the error class to the input
        });
        loginButton.disabled = true;            // Disables the login button
    } else {
        hideErrorMessage();                     // Hides the error message
        inputs.forEach((input) => {
            input.classList.remove("error");    // Removes the error class from the input
        });
        loginButton.disabled = false;           // Enables the login button
    }
}

/**
 * Shows an error message and disables the login button.
 *
 * @param {string} message Message that will be shown.
 * @returns {void}
 */
function showErrorMessage(message) {
    errorMessage.style.display = "block"; // Shows the error message
    errorMessage.innerText = message; // Sets the error message
    errorShown = true; // Sets the error shown to true
    loginButton.disabled = true; // Disables the login button
}

/**
 * Hides the error message and enables the login button.
 *
 * @returns {void}
 */
function hideErrorMessage() {
    errorMessage.style.display = "none"; // Hides the error message
    errorMessage.innerText = ""; // Clears the error message
    errorShown = false; // Sets the error shown to false
    loginButton.disabled = false; // Enables the login button
}

// Function to validate email format
function validateEmail(email) {
    if (email.length === 0) {
        failManagement(true, 'Login fallido: Email vacío', [emailInput]);       // Fails email
        return false;                               // Returns false if the email is invalid
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;     // Regular expression to validate email format
    if (! regex.test(String(email).toLowerCase())) {
        failManagement(true, 'Login fallido: Email inválido', [emailInput]);    // Fails email
        return false;                               // Returns false if the email is invalid
    }
    return true;                                    // Returns true if the email is valid
}
