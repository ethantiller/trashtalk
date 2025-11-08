import { db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function createUserProfile(userId, email) {
  // Created at time, items,
  // Time needs to be in ISO format for consistency
  const createdAt = new Date().toISOString();

  const userProfile = {
    email,
    createdAt,
    lastLogin: createdAt,
    items: []
  }

  const userDocRef = doc(db, "users", userId); // Pulls the reference users/{uid}/

  await setDoc(userDocRef, userProfile);
}

export async function getUserProfile(userId) {
  //
  const userDocRef = doc(db, "users", userId);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    return userDocSnap.data();
  } else {
    return null;
  }
}

export async function updateUserLastLogin(userId) {
  const userDocRef = doc(db, "users", userId);
  const lastLogin = new Date().toISOString();

  await setDoc(userDocRef, { lastLogin }, { merge: true });
}
