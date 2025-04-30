import { db } from "./firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

// Collection reference for "locator"
const itemsCollection = collection(db, "locator");

// Function to log location
const logLocation = async (item) => {
  const docRef = await addDoc(itemsCollection, item);
  return docRef.id;
};

// Function to check if locatorID exists
export async function checkLocatorExists(locatorID) {
  const q = query(itemsCollection, where('locatorID', '==', locatorID));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

export default logLocation;
  