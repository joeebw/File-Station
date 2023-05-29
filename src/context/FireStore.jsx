import { createContext, useContext, useEffect, useReducer, useState } from "react"
import {
  addFolderInFirestore, 
  addFileInFirestore, 
  removeDocFromFirestore, 
  getDocsFromFirestore 
} from "../FIrebase";
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
    if (!nameFolder) return;

    const infoFolder = {
      nameFolder,
      user,
      currentFolder: state.currentFolder
    }

    const documentData = await addFolderInFirestore(infoFolder);
    if(documentData) {
      dispatch({type: ACTIONS.ADD_FOLDER, payload: documentData})
    }
  }

  async function handleAddFile(nameFile, url) {
    const infoFile = {
      nameFile,
      url,
      user,
      currentFolder: state.currentFolder
    }

    const documentData = await addFileInFirestore(infoFile);
    if(documentData) {
      dispatch({type: ACTIONS.ADD_FILE, payload: documentData})
    }
  }

  // Remove folder from firestore
  async function handleRemoveFolder(folderId) {
    const result = await removeDocFromFirestore('Folders', folderId);
    if(result) {
      const newFolders = state.folders.filter(folder => folder.id !== folderId);
      dispatch({type:ACTIONS.DELETE_FOLDER, payload:newFolders});
    }
  }

  // Remove file from Firestore
  async function handleRemoveFile(fileId) {
    const result = await removeDocFromFirestore('Files', fileId);
    if (result) {
      const newFiles = state.files.filter(file => file.id !== fileId);
      dispatch({type:ACTIONS.DELETE_FILE, payload:newFiles});
    }
  }

  useEffect(() => {
    async function handleGetFoldersData(user) {
      if(!user) return;

      const infoFoldersData = {
        user,
        currentFolder: state.currentFolder,
        collectionName: 'Folders'
      }
      const querySnapshot = await getDocsFromFirestore(infoFoldersData, navigate);
      if (querySnapshot) {
        querySnapshot.forEach((doc) => {
          dispatch({type: ACTIONS.ADD_FOLDER, payload:doc.data()})
        });
      }
    }
    handleGetFoldersData(user);
  }, [user, state.currentFolder])


  useEffect(() => {
    async function handleGetFilesData(user) {
      if(!user) return;

      const infoFilesData = {
        user,
        currentFolder: state.currentFolder,
        collectionName: 'Files'
      }

      const querySnapshot = await getDocsFromFirestore(infoFilesData, navigate);

      if (querySnapshot) {
        querySnapshot.forEach((doc) => {
          dispatch({type: ACTIONS.ADD_FILE, payload:doc.data()})
        });
      }
    }
    handleGetFilesData(user);
  }, [user, state.currentFolder])

  function resetUserContent() {
    dispatch({type: ACTIONS.RESET_ELEMENTS})
  }

  function changeCurrentFolder(setFolder) {
    dispatch({type: ACTIONS.CHANGE_CURRENT_FOLDER, payload: setFolder})
  }

  function selectChildFolder(setChildFolder) {
    dispatch({type: ACTIONS.SELECT_CHILD_FOLDER, payload: setChildFolder})
  }

  const value = {
    handleAddFolder,
    handleAddFile,
    handleRemoveFile,
    handleRemoveFolder,
    folders: state.folders,
    files: state.files,
    childFolder: state.childFolder,
    currentFolder: state.currentFolder,
    resetUserContent,
    changeCurrentFolder,
    selectChildFolder
  }

  return(
    <DbContext.Provider value={value}>
      {children}
    </DbContext.Provider>
  )
}