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
  const itemHash = itemData.itemHash; // <- use hash as doc ID

  const itemDocRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    ITEMS_SUBCOLLECTION,
    itemHash
  );

  await setDoc(itemDocRef, {
    itemName: itemData.itemName,
    itemPhoto: itemData.itemPhoto,
    itemDescription: itemData.itemDescription,
    itemWinOrLose: itemData.itemWinOrLose,
    recyclingLocations: itemData.recyclingLocations,
    createdAt: itemData.createdAt,
    confidenceRating: itemData.confidenceRating,
  });
}

export async function getUserItems(userId) {
  const itemsCollectionRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    ITEMS_SUBCOLLECTION
  );
  const itemsSnapshot = await getDocs(itemsCollectionRef);

  const itemsObj = {};

  itemsSnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const itemHash = docSnap.id; // doc id is the hash
    itemsObj[itemHash] = {
      itemName: data.itemName,
      itemPhoto: data.itemPhoto,
      itemDescription: data.itemDescription,
      itemWinOrLose: data.itemWinOrLose,
      recyclingLocations: data.recyclingLocations,
      createdAt: data.createdAt,
      confidenceRating: data.confidenceRating,
    };
  });

  return {
    items: itemsObj,
  };
}

export async function getItemByHash(userId, itemHash) {
  const itemDocRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    ITEMS_SUBCOLLECTION,
    itemHash
  );
  const snap = await getDoc(itemDocRef);

  if (!snap.exists()) return null;

  const data = snap.data();

  return {
    [itemHash]: {
      itemName: data.itemName,
      itemPhoto: data.itemPhoto,
      itemDescription: data.itemDescription,
      itemWinOrLose: data.itemWinOrLose,
      recyclingLocations: data.recyclingLocations,
      createdAt: data.createdAt,
      confidenceRating: data.confidenceRating,
    },
  };
}

export async function deleteItemFromUser(userId, itemHash) {
  const itemDocRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    ITEMS_SUBCOLLECTION,
    itemHash
  );
  await deleteDoc(itemDocRef);
}
