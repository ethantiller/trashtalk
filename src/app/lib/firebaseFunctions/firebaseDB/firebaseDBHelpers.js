import { db } from "../../firebase";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";


const USERS_COLLECTION = "users";
const ITEMS_SUBCOLLECTION = "items";

// itemData should be an object with the following structure:
// {
//   id: string, // unique identifier for the item
//   itemName: string,
//   itemHash: string,
//   itemPhoto: string, // URL or path to the photo
//   itemDescription: string,
//   itemWinOrLose: string, // e.g., "win" or "lose"
//   recyclingLocations: [
//     {
//       name: string,
//       lat: number,
//       long: number,
//       address: string,
//       distanceFromAddress: number
//     }
//   ],
//   createdAt: Timestamp or Date,
//   confidenceRating: number
// }


export async function addItemToUser(userId, itemData) {
  const itemId = itemData.id;
  const itemDocRef = doc(db, USERS_COLLECTION, userId, ITEMS_SUBCOLLECTION, itemId);
  await setDoc(itemDocRef, itemData);
}

export async function getUserItems(userId) {
  const itemsCollectionRef = collection(db, USERS_COLLECTION, userId, ITEMS_SUBCOLLECTION);
  const itemsSnapshot = await getDocs(itemsCollectionRef);

  const items = itemsSnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));

  return items;
}

export async function getItemByHash(userId, itemHash) {
  const itemsCollectionRef = collection(db, USERS_COLLECTION, userId, ITEMS_SUBCOLLECTION);
  const itemsSnapshot = await getDocs(itemsCollectionRef);

  for (const docSnap of itemsSnapshot.docs) {
    const data = docSnap.data();
    if (data.itemHash === itemHash) {
      return {
        id: docSnap.id,
        ...data,
      };
    }
  }

  return null; // Item not found
}

export async function deleteItemFromUser(userId, itemId) {
  const itemDocRef = doc(db, USERS_COLLECTION, userId, ITEMS_SUBCOLLECTION, itemId);
  await deleteDoc(itemDocRef);
}
