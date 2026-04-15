import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

export function initAuthMonitor(userElId, loginBtnId, logoutBtnId) {
    onAuthStateChanged(auth, (user) => {
        const userEl = document.getElementById(userElId);
        const loginBtn = document.getElementById(loginBtnId);
        const logoutBtn = document.getElementById(logoutBtnId);

        if (user) {
            if(userEl) userEl.innerText = `Logged in: ${user.email}`;
            if(loginBtn) loginBtn.classList.add('hidden');
            if(logoutBtn) logoutBtn.classList.remove('hidden');
        } else {
            if(userEl) userEl.innerText = 'Not logged in';
            if(loginBtn) loginBtn.classList.remove('hidden');
            if(logoutBtn) logoutBtn.classList.add('hidden');
        }
    });
}

export async function login(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function logout() {
    await signOut(auth);
    window.location.reload();
}