"use client";

import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";
import { setCookie } from "cookies-next";

export default function AuthLayout({ children }) {
//   useEffect(() => {
//     const auth = getAuth(app);
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         // Refresh token occasionally so middleware sees new claims
//         const token = await user.getIdToken(true);
//         setCookie("firebaseToken", token, {
//           path: "/",
//           maxAge: 60 * 60 * 24 * 7, // 7 days
//           secure: process.env.NODE_ENV === "production",
//           sameSite: "strict",
//         });
//       }
//     });

//     return () => unsubscribe();
//   }, []);

  return <>{children}</>;
}
