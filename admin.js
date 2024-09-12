// Configuración de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

// Nueva configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDnKcHS41_TH5jzmT2gIEU6-h4C_dnIML8",
    authDomain: "fablab2-88ab1.firebaseapp.com",
    projectId: "fablab2-88ab1",
    storageBucket: "fablab2-88ab1.appspot.com",
    messagingSenderId: "30169496903",
    appId: "1:30169496903:web:a7060677c0513fe1ea6062",
    measurementId: "G-TL1F53C259"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// Manejo del botón "Enviar"
document.getElementById("Enviar").addEventListener("click", async () => {
    var nombre = document.getElementById("inputNombre").value;
    var correo = document.getElementById("inputCorreo").value;
    var contraseña = document.getElementById("inputContraseña").value;

    if (nombre === '' || correo === '' || contraseña === '') {
        alert("Todos los campos son obligatorios");
        return;
    }

    try {
        // Crear un nuevo usuario en Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, correo, contraseña);
        const user = userCredential.user;

        // Guardar información adicional en Firestore
        const newUserRef = doc(db, "Administracion", user.uid); // Usa el UID del usuario para el documento
        await setDoc(newUserRef, {
            nombre: nombre,
            correo: correo,
            contraseña: contraseña
        });

        alert(`Bienvenido ${nombre}`);

        // Limpiar los campos del formulario
        document.getElementById("inputNombre").value = "";
        document.getElementById("inputCorreo").value = "";
        document.getElementById("inputContraseña").value = "";

    } catch (error) {
        console.error("Error al registrar el usuario: ", error);
        alert("Hubo un error al registrar el usuario.");
    }
});
