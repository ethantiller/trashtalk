import { getAdminAuth } from "@/app/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserDashboardClient from "@/app/components/UserDashboardClient";
import { getUserItems } from "@/app/lib/firebaseFunctions/firebaseDB/firebaseDBHelpers";

export default async function UserDashboardPage({ params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseToken")?.value;

  if (!token) {
    redirect("/login");
  }

  let decodedToken;
  try {
  decodedToken = await getAdminAuth().verifyIdToken(token);
  } catch (err) {
    console.error("Invalid Firebase token", err);
    redirect("/login");
  }

  const loggedInUid = decodedToken.uid;
  const { uid: requestedUid } = await params;

  if (requestedUid && loggedInUid && requestedUid !== loggedInUid) {
    redirect(`/dashboard/${loggedInUid}`);
  }

  return (
    <UserDashboardClient
      userId={loggedInUid}
      initialItems={await getUserItems(loggedInUid)}
    />
  );
}
