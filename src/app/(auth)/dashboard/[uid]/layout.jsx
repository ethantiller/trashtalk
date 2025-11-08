import { adminAuth } from "@/app/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserLayout({ children, params }) {
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

    const { uid: requestedUid } = await params;
    const loggedInUid = decodedToken.uid;

    if (requestedUid && loggedInUid && requestedUid !== loggedInUid) {
        redirect(`/dashboard/${loggedInUid}`);
    }

    return <>{children}</>;
}
