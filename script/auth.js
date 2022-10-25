import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";
export { auth } from "./firebase";

export async function signInUser() {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

export async function signOutUser() {
  signOut(auth);
}

export function isAuth() {
  return !!auth.currentUser;
}
