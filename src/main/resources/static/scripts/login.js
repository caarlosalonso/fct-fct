const form = document.getElementById('alumno-form');
const archivoInput = document.getElementById('archivo');
const idInput = document.getElementById('id');
const resultado = document.getElementById('resultado');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const archivo = archivoInput.files[0];
    const id = idInput.value;

    if (!archivo || !id) {
        resultado.innerText = "Falta seleccionar archivo o ID.";
        return;
    }

    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    try {
        const response = await fetch('/api/archivo/subir', {
            method: 'POST',
            body: formData
        });

        const text = await response.text();
        resultado.innerText = text;
    } catch (error) {
        resultado.innerText = 'Error al subir el archivo.';
    }
});
