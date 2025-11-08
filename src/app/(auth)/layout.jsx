import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseToken")?.value;

  if (!token) {
    redirect("/login");
  }
  return <>{children}</>;
}
