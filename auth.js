// auth.js
import { 
    signInWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase-config.js";

const authElements = {
    form: document.getElementById('auth-form'),
    title: document.getElementById('auth-title'),
    submit: document.getElementById('auth-submit'),
    container: document.getElementById('auth-container'),
    toast: document.getElementById('toast')
};

function showAuthToast(msg, type = 'success') {
    let prefix = type === 'error' ? '[ERROR]' : '[INFO]';
    authElements.toast.innerText = `${prefix} ${msg}`;
    authElements.toast.className = `toast show ${type}`;
    setTimeout(() => authElements.toast.className = 'toast', 3500);
}

// Enviar Formulario (Solo Login)
authElements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;

    authElements.submit.disabled = true;
    authElements.submit.innerText = 'Verificando...';

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        showAuthToast('Acceso Concedido');
    } catch (err) {
        let errorMsg = "Error de Autenticación";
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
            errorMsg = "Credenciales Inválidas";
        }
        showAuthToast(errorMsg, 'error');
    } finally {
        authElements.submit.disabled = false;
        authElements.submit.innerText = 'Iniciar Sesión';
    }
});

// Vigilar estado de la sesión
onAuthStateChanged(auth, (user) => {
    if (user) authElements.container.classList.add('hidden');
    else {
        authElements.container.classList.remove('hidden');
        authElements.form.reset();
    }
});