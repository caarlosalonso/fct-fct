window.addEventListener('DOMContentLoaded', (event) => {
    const countdownElement = document.getElementById('countdown');
    let countdown = 5;
    setInterval(() => {
        countdown--;
        countdownElement.textContent = `${countdown} segundo${countdown > 1 ? 's' : ''}.`;
        if (countdown === 0) {
            document.getElementById('countdown-container').textContent = '¡Adios!';
        }
    }, 1000);
});
