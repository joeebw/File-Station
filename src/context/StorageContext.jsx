import { createContext, useContext, useState } from "react"
import { storage } from "../FIrebase";
import {ref, getDownloadURL, uploadBytesResumable, deleteObject} from 'firebase/storage'
import { userAuth } from "./AuthContext";
import { fireStoreContext } from "./FireStore";

const STContext = createContext();

export function storageContext() {
  return useContext(STContext);
}



export function StorageProvider({children}) {
  const {user} = userAuth();
  const {handleAddFile, files} = fireStoreContext();
  const [progresspercent, setProgresspercent] = useState(0);
  const [uploadingFile, setUploadingFile] = useState('');

  function restartProgressBar() {
    setProgresspercent(0);
  }

  function handleFileUploadToStorage(e) {
    const file = e.target.files[0];
    
    if (!file) return;

    const isRepeatedFile = files.find(fileItem => fileItem.nameFile === file.name);

    if (isRepeatedFile) {
      alert('You alredy have this file name');
      return;
    }
    
    setUploadingFile(file.name);

    const storageRef = ref(storage, `files/${user.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on("state_changed",
      (snapshot) => {
        const progress =
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgresspercent(progress);
      },
      (error) => {
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          handleAddFile(file.name, downloadURL);
          restartProgressBar();
          setUploadingFile('');
        })
      }
    )
  }

  const value = {
    handleFileUploadToStorage,
    progresspercent,
    uploadingFile
  }

  return(
    <STContext.Provider value={value}>
      {children}
    </STContext.Provider>
  )
}