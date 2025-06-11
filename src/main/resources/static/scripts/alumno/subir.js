const form = document.getElementById('alumno-form');
const archivoInput = document.getElementById('archivo');
const resultado = document.getElementById('resultado');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const archivo = archivoInput.files[0];
    if (!archivo) {
        resultado.innerText = "Selecciona un archivo.";
        return;
    }

    const formData = new FormData();
    formData.append('archivo', archivo);

    try {
        const response = await fetch('/api/archivo/subir', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
        });

        const text = await response.text();
        resultado.innerText = text;
    } catch (error) {
        resultado.innerText = 'Error al subir el archivo.';
    }
});
