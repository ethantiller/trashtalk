import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/app/lib/firebaseAdmin";

export default async function DashboardRootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseToken")?.value;

  if (!token) {
    redirect("/login");
  }

  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(token);
  } catch (err) {
    console.error("Invalid Firebase token", err);
    redirect("/login");
  }

  const loggedInUid = decodedToken.uid;
  redirect(`/dashboard/${loggedInUid}`);
}
