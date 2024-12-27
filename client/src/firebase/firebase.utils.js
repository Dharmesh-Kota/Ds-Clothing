import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  updateDoc,
  increment,
  deleteField
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBumcaIm0QqsYOmVhjnWSu2J5oI3du8U8U",
  authDomain: "ds-clothing-db.firebaseapp.com",
  projectId: "ds-clothing-db",
  storageBucket: "ds-clothing-db.appspot.com",
  messagingSenderId: "108274685997",
  appId: "1:108274685997:web:ffd624509f351bbec8c0a4",
  measurementId: "G-6FWCTQZ5C4",
};

// Creating new collections in Firestore
export const addCollectionAndDocuments = async (
  collectionKey,
  documentsToAdd
) => {
  const collectionRef = collection(firestore, collectionKey);
  const batch = writeBatch(firestore);

  documentsToAdd.forEach((obj) => {
    const newDocRef = doc(collectionRef);
    batch.set(newDocRef, obj);
  });

  return await batch.commit();
};

// Create user profile document in Firestore
export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = doc(firestore, `users/${userAuth.uid}`);

  const snapShot = await getDoc(userRef);

  if (!snapShot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log("Error creating user: ", error.message);
    }
  }
  return userRef;
};

// Converting the collections array obtained from Firestore into Maps so that it can be
// pushed into our redux store
export const convertCollectionsSnapshotToMap = (collections) => {
  const transformedCollections = collections.docs.map((doc) => {
    const { title, items } = doc.data();
    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items,
    };
  });

  return transformedCollections.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  }, {});
};

export const addItemToFirestore = async (userId, item) => {
  try {
    const userRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.data()?.cartItems?.[`item${item.id}`]) {
      await updateDoc(userRef, {
        [`cartItems.item${item.id}.quantity`]: increment(1)
      });
    } else {
      await updateDoc(userRef, {
        [`cartItems.item${item.id}`]: { ...item, quantity: 1 }
      });
    }
  } catch (error) {
    console.error("Error adding item to Firestore:", error);
  }
};

export const clearItemFromFirestore = async (userId, itemId) => {
  try {
    const userRef = doc(firestore, "users", userId);
    const itemPath = `cartItems.item${itemId}`;

    await updateDoc(userRef, {
      [itemPath]: deleteField(),
    });
  } catch (error) {
    console.error("Error clearing item from Firestore:", error);
  }
};

export const removeItemFromFirestore = async (userId, itemId) => {
  try {
    const userRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userRef);

    const cartItems = userDoc.data().cartItems || {};
    const existingItem = cartItems[`item${itemId}`];

    if (existingItem) {
      if (existingItem.quantity === 1) {
        await updateDoc(userRef, {
          [`cartItems.item${itemId}`]: deleteField(),
        });
      } else {
        await updateDoc(userRef, {
          [`cartItems.item${itemId}.quantity`]: increment(-1),
        });
      }
    }
  } catch (error) {
    console.error("Error removing item from Firestore:", error);
  }
};

export const updateCartInFirestore = async (userId, cartItems) => {
  try {
    const userRef = doc(firestore, "users", userId);

    await updateDoc(userRef, { cartItems });
  } catch (error) {
    console.error("Error updating user's cartItems in Firestore:", error);
  }
}

export const mergeCarts = (firebaseCart, localCart) => {
  const mergedCart = { ...localCart };
  if (!firebaseCart) firebaseCart = {};

  Object.keys(firebaseCart).forEach((id) => {
    if (!mergedCart[id]) {
      mergedCart[id] = { ...firebaseCart[id] };
    }
  });

  return mergedCart;
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Set up Firebase Authentication and Firestore
export const auth = getAuth(app);
export const firestore = getFirestore(app);

// Set up Google Auth Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => signInWithPopup(auth, provider);

export default app;
