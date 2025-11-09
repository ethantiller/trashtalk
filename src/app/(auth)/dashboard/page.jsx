import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminAuth } from "@/app/lib/firebaseAdmin";

export default async function DashboardRootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseToken")?.value;

  if (!token) {
    redirect("/login");
  }

  let decodedToken;
  try {
  decodedToken = await getAdminAuth().verifyIdToken(token);
  } catch (err) {
    redirect("/login");
  }

  const loggedInUid = decodedToken.uid;
  redirect(`/dashboard/${loggedInUid}`);
}
