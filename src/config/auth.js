import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth"
import { auth } from "./firebase"


export const doSignInUserWithEmailAndPassword = async(email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const doSignInWithGoogle = async () =>{
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result
}

export const doSignOut = () => {
    return auth.signOut()
}

/**
 * Sends a password reset email to the specified email address
 * @param {string} email - The email address to send the reset link to
 * @returns {Promise<void>} - A promise that resolves when the reset email is sent
 */
export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
  };