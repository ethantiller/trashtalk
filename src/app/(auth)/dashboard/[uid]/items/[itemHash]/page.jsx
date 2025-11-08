import { redirect } from "next/navigation";
import ItemClientPage from "@/app/components/ItemClientPage";
import { getItemByHash } from "@/app/lib/firebaseFunctions/firebaseDB/firebaseDBHelpers";

export default async function ItemServerPage({ params }) {
  const { uid, itemHash } = await params;

  if (!uid) {
    redirect("/login");
  }
  if (!itemHash) {
    redirect(`/dashboard/${uid}`);
  }

  const item = await getItemByHash(uid, itemHash);

  if (!item) {
    redirect(`/dashboard/${uid}`);
  }

  return <ItemClientPage item={item} />;
}
