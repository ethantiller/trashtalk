import { getAdminAuth } from "@/app/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ImageUploadPage from "@/app/components/NewItemClient";

export default async function ImageUploadPageServer({ params }) {
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
  const { uid: requestedUid } = await params || {};

  if (requestedUid && loggedInUid && requestedUid !== loggedInUid) {
    redirect(`/dashboard/${loggedInUid}`);
  }

  return <ImageUploadPage userId={loggedInUid} />;
}
