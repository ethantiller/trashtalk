export async function generateMetadata({ params }) {
  const { uid, itemHash } = params;
  let itemName = "Item";
  let itemDescription = "View recycling information for this item on TrashTalkers.tech.";
  let imageUrl = "/trashtalk-og.png";
  try {
    const itemObj = await getItemByHash(uid, itemHash);
    const item = itemObj ? itemObj[itemHash] : null;
    if (item) {
      if (item.itemName) itemName = item.itemName;
      if (item.itemDescription) itemDescription = item.itemDescription;
      if (item.itemPhoto) imageUrl = item.itemPhoto;
    }
  } catch {}
  return {
    title: `${itemName} | TrashTalkers.tech`,
    description: itemDescription,
    openGraph: {
      title: `${itemName} | TrashTalkers.tech`,
      description: itemDescription,
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: `${itemName} | TrashTalkers.tech`,
      description: itemDescription,
      images: [imageUrl],
    },
  };
}

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

  const itemObj = await getItemByHash(uid, itemHash);
  const item = itemObj ? itemObj[itemHash] : null;

  if (!item) {
    redirect(`/dashboard/${uid}`);
  }

  return <ItemClientPage item={item} uid={uid} itemName={item?.itemName || "Item"}/>;
}
