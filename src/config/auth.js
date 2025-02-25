import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
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