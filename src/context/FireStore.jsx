import { createContext, useContext, useEffect, useReducer, useState } from "react"
import { 
  doc,
  collection,
  deleteDoc,
  Timestamp,
  getDocs,
  query,
  where,
  setDoc
} from "firebase/firestore"; 
import { db } from "../FIrebase";
import { userAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";


const DbContext = createContext();

export function fireStoreContext() {
  return useContext(DbContext);
}

const ACTIONS = {
  ADD_FOLDER: 'get all folders',
  ADD_FILE: 'get all files',
  RESET_ELEMENTS: 'reset elements',
  CHANGE_CURRENT_FOLDER: 'change current',
  DELETE_FOLDERS: 'delete folders',
  SELECT_CHILD_FOLDER: 'select child folder',
  DELETE_FILE: 'delete a file',
  DELETE_FOLDER: 'delete a folder'
}

// Reducer
function reducer(state, actions) {
  switch (actions.type) {
    case ACTIONS.ADD_FOLDER:
      return {...state ,folders: [...state.folders, actions.payload]}
    case ACTIONS.ADD_FILE:
      return {...state, files:[...state.files, actions.payload]} 
    case ACTIONS.DELETE_FILE:
      return {...state, files:[...actions.payload]}  
    case ACTIONS.DELETE_FOLDER:
      return {...state, folders: [...actions.payload]}
    case ACTIONS.DELETE_FOLDERS:
      return {...state, folders:[]}
    case ACTIONS.RESET_ELEMENTS:
      return {...state ,folders: [], currentFolder:''}
    case ACTIONS.CHANGE_CURRENT_FOLDER:
      return {...state ,folders:[], files:[] ,currentFolder: actions.payload, updateTrrigger:!state.updateTrrigger}
    case ACTIONS.SELECT_CHILD_FOLDER:
      return {...state, childFolder: actions.payload}
    default:
      return state;
  }
}


// Firestore context
export function FireStoreProvider({children}) {
  const [state, dispatch] = useReducer(reducer, {
    folders: [],
    files: [],
    currentFolder: '',
    updateTrrigger: true,
    childFolder: {}
  })
  const {user} =  userAuth();
  const navigate = useNavigate();


  async function handleAddFolder(nameFolder) {
    try {
      const timestamp = Timestamp.now();
      const docRef = doc(collection(db, 'Folders'))
      const documentData = {
        nameFolder: nameFolder,
        createdBy: user.uid,
        dateAdded: timestamp,
        parentFolder: state.currentFolder,
        id: docRef.id
      }
      await setDoc(docRef, documentData);
      dispatch({type: ACTIONS.ADD_FOLDER, payload: documentData})

    } catch (error) {
      console.log('Error adding document', error);
    }
  }

  async function handleAddFile(nameFile, url) {
    try {
      const docRef = doc(collection(db, 'Files'))
      const documentData = {
        nameFile,
        createdBy: user.uid,
        parentFolder: state.currentFolder,
        url,
        id: docRef.id
      }
      await setDoc(docRef, documentData)
      dispatch({type: ACTIONS.ADD_FILE, payload: documentData})
    } catch (error) {
      console.log('Error adding document', error);
    }
  }

  // Remove folder from firestore
  async function handleRemoveFolder(folderId) {
    await deleteDoc(doc(db, "Folders", folderId));
    const newFolders = state.folders.filter(folder => folder.id !== folderId)
    dispatch({type:ACTIONS.DELETE_FOLDER, payload:newFolders})
  }

  // Remove file from Firestore
  async function handleRemoveFile(fileId) {
    await deleteDoc(doc(db, 'Files', fileId))
    const newFiles = state.files.filter(file => file.id !== fileId)
    dispatch({type:ACTIONS.DELETE_FILE, payload:newFiles})
  }

  useEffect(() => {
    async function handleGetFoldersData(user) {
      if(!user) return;
      try {
        const q = query(collection(db, "Folders"), where("createdBy", "==", user.uid), 
        where("parentFolder", "==", state.currentFolder));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          dispatch({type: ACTIONS.ADD_FOLDER, payload:doc.data()})
        });
      } catch (error) {
        switch (error.message) {
          case 'Missing or insufficient permissions.':
            return navigate('/');
          default:
            return console.log(error.message);
        }
      }
    }
    handleGetFoldersData(user);
  }, [user, state.currentFolder])


  useEffect(() => {
    async function handleGetFilesData(user) {
      if(!user) return;
      try {
        const q = query(collection(db, "Files"), where("createdBy", "==", user.uid), 
        where("parentFolder", "==", state.currentFolder));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          dispatch({type: ACTIONS.ADD_FILE, payload:doc.data()})
        });
      } catch (error) {
        switch (error.message) {
          case 'Missing or insufficient permissions.':
            return navigate('/');
          default:
            return console.log(error.message);
        }
      }
    }
    handleGetFilesData(user);
  }, [user, state.currentFolder])


  const value = {
    handleAddFolder,
    handleAddFile,
    handleRemoveFile,
    handleRemoveFolder,
    folders: state.folders,
    files: state.files,
    childFolder: state.childFolder,
    currentFolder: state.currentFolder,
    resetUserContent: () => dispatch({type: ACTIONS.RESET_ELEMENTS}),
    changeCurrentFolder: (setFolder) => {
      dispatch({type: ACTIONS.CHANGE_CURRENT_FOLDER, payload: setFolder})
      },
    selectChildFolder: (setChildFolder) => {
      dispatch({type: ACTIONS.SELECT_CHILD_FOLDER, payload: setChildFolder})
    }
  }

  return(
    <DbContext.Provider value={value}>
      {children}
    </DbContext.Provider>
  )
}