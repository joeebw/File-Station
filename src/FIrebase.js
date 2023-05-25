// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import {
  getFirestore, 
  Timestamp, 
  doc, 
  setDoc,
  collection,
  deleteDoc, 
  query,
  where,
  getDocs
} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDERID,
  appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export async function createUserWithFirebase(email, password, errorAlert) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    switch(error.code) {
      case 'auth/weak-password':
        errorAlert('Password should be at least 6 characters')
        break;
      case 'auth/email-already-in-use':
        errorAlert('You are already registered')
        break;
      default:
        console.log(error.code);
    }
  }
}

export async function signInUserWithFirebase(email, password, errorAlert) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    switch (error.code) {
      case 'auth/wrong-password':
        errorAlert('Somenthing is wrong')
        break;
      case 'auth/user-not-found':
        errorAlert('Unregistered user, Sign up')
        break;  
      default:
        console.log(error.code)
    }
  }
}

export function signOutUser() {
  try {
    signOut(auth)
  } catch (error) {
    console.log(error.message);
  }
}

export async function addFolderInFirestore(infoFolder) {
  const {nameFolder, user, currentFolder} = infoFolder;

  try {
    const timestamp = Timestamp.now();
    const docRef = doc(collection(db, 'Folders'))
    const documentData = {
      nameFolder: nameFolder,
      createdBy: user.uid,
      dateAdded: timestamp,
      parentFolder: currentFolder,
      id: docRef.id
    }
    await setDoc(docRef, documentData);
    return documentData;
  } catch (error) {
    console.log('Error adding folder in firebase utils', error);
  }
}

export async function addFileInFirestore(infoFile) {
  const {nameFile, url, user, currentFolder} = infoFile;

  try {
    const docRef = doc(collection(db, 'Files'))
    const documentData = {
      nameFile,
      createdBy: user.uid,
      parentFolder: currentFolder,
      url,
      id: docRef.id
    }
    await setDoc(docRef, documentData)
    return documentData;
    
  } catch (error) {
    console.log('Error adding file in firebase utils', error);
  }
}

export async function removeDocFromFirestore(collectionName, docId) {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return true;
  } catch (error) {
    console.log('error when try to remove doc in firebase utils', error);
  }
}

export async function getDocsFromFirestore(infoDocs, navigate) {
  const {user, currentFolder, collectionName} = infoDocs;

  try {
    const q = query(collection(db, collectionName), where("createdBy", "==", user.uid), 
    where("parentFolder", "==", currentFolder));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  } catch (error) {
    switch (error.message) {
      case 'Missing or insufficient permissions.':
        return navigate('/');
      default:
        return console.log('error in getting docs from firestore in firebase utils' ,error.message);
    }
  }
}

export function authStateChanged(callback) {
  onAuthStateChanged(auth, callback);
}