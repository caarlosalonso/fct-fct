window.addEventListener('DOMContentLoaded', (event) => {
    const countdownElement = document.getElementById('countdown');
    let countdown = 5;
    setInterval(() => {
        countdown--;
        countdownElement.textContent = `${countdown} segundo${countdown > 1 ? 's' : ''}.`;
        if (countdown === 0) {
            const countdownContainer = document.getElementById('countdown-container');
            countdownContainer.style.textAlign = 'center';
            countdownContainer.textContent = '¡Adios!';
        }
    }, 1000);
});
