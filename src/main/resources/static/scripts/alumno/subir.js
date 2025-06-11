import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAd4xYzRu3vJEmUCkod0FkcMLQA90eNeTU",
    authDomain: "tfc-fct-3b0fa.firebaseapp.com",
    projectId: "tfc-fct-3b0fa",
    storageBucket: "tfc-fct-3b0fa.appspot.com",
    messagingSenderId: "1090078079288",
    appId: "1:1090078079288:web:3f7df9b5e75370efb0a9cd",
    measurementId: "G-52M3VYWPJZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

const form = document.getElementById('alumno-form');
const fileInput = document.getElementById('file');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
        alert("Selecciona un archivo");
        return;
    }

    try {
        // 1. Pedir el custom token al backend usando la sesión
        const tokenRes = await fetch('/auth/firebaseToken', {
            credentials: 'same-origin'
        });
        if (!tokenRes.ok) {
            throw new Error('No se pudo obtener el token Firebase');
        }
        const { firebaseToken } = await tokenRes.json();

        // 2. Autenticación en Firebase con el custom token
        await signInWithCustomToken(auth, firebaseToken);

        // 3. Subir el archivo a Firebase Storage
        const storageRef = ref(storage, 'uploads/' + file.name);
        await uploadBytes(storageRef, file);

        // 4. Obtener URL de descarga
        const url = await getDownloadURL(storageRef);
        alert('Archivo subido correctamente: ' + url);
    } catch (err) {
        alert('Error: ' + err.message);
    }
});