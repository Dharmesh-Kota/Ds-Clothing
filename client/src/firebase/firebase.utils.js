import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, writeBatch } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBumcaIm0QqsYOmVhjnWSu2J5oI3du8U8U",
    authDomain: "ds-clothing-db.firebaseapp.com",
    projectId: "ds-clothing-db",
    storageBucket: "ds-clothing-db.appspot.com",
    messagingSenderId: "108274685997",
    appId: "1:108274685997:web:ffd624509f351bbec8c0a4",
    measurementId: "G-6FWCTQZ5C4"
};

// Creating new collection in Firestore
export const addCollectionAndDocuments = async (collectionKey, documentsToAdd) => {
    const collectionRef = collection(firestore, collectionKey);
    const batch = writeBatch(firestore);

    documentsToAdd.forEach(obj => {
        const newDocRef = doc(collectionRef);
        batch.set(newDocRef, obj);
    });
    
    return await batch.commit();
}

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
                ...additionalData
            });
        } catch (error) {
            console.log('Error creating user: ', error.message)
        }
    }
    return userRef;
}

// Converting the collections array obtained from Firestore into Maps so that it can be  
// pushed into our redux store
export const convertCollectionsSnapshotToMap = (collections) => {
    const transformedCollections = collections.docs.map(doc => {
        const { title, items } = doc.data();
        return {
            routeName: encodeURI(title.toLowerCase()),
            id: doc.id,
            title,
            items
        }
    });
    
    return transformedCollections.reduce((accumulator, collection) => {
        accumulator[collection.title.toLowerCase()] = collection;
        return accumulator;
    }, {});
}

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Set up Firebase Authentication and Firestore
export const auth = getAuth(app);
export const firestore = getFirestore(app);

// Set up Google Auth Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => signInWithPopup(auth, provider);

export default app;