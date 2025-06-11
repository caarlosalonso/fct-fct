// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAd4xYzRu3vJEmUCkod0FkcMLQA90eNeTU",
    authDomain: "tfc-fct-3b0fa.firebaseapp.com",
    projectId: "tfc-fct-3b0fa",
    storageBucket: "tfc-fct-3b0fa.appsot.app",
    messagingSenderId: "1090078079288",
    appId: "1:1090078079288:web:3f7df9b5e75370efb0a9cd",
    measurementId: "G-52M3VYWPJZ"
};
console.log("1");

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);
console.log("1.2");

const form = document.getElementById('alumno-form');
const fileInput = document.getElementById('file');
console.log("1.4");

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el envío del formulario por defecto
    console.log("2");

    const file = fileInput.files[0];
    if (!file) {
        alert("Selecciona un archivo");
        return;
    }
    console.log("3");

    try {
        // 1. Pedir al backend un custom token para el usuario de la sesión
        const tokenRes = await fetch('/auth/firebaseToken');
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
        console.log('Archivo disponible en:', url);

        alert('Archivo subido correctamente');
    } catch (err) {
        alert('Error: ' + err.message);
    }
});