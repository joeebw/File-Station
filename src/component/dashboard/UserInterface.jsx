import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavbarUser from './NavbarUser';
import ShowModal from './ShowModal';
import FileBrowser from './FileBrowser';
import NavigationToolbar from './NavigationToolbar';
import { fireStoreContext } from '../../context/FireStore';
import UploadProgressBar from './UploadProgressBar';

function UserInterface() {
  const [open, setOpen] =  useState(false);
  const {changeCurrentFolder,currentFolder, resetUserContent} = fireStoreContext();
  const location = useLocation();
  const {folderId} = useParams();
  const navigate = useNavigate()
  
  function handleOpenModal() {
    setOpen(!open);
  }

  useEffect(() => {
    if (location.pathname === '/userinterface') {
      return navigate('/userinterface/root') 
    } 

    if (currentFolder === folderId) return
    changeCurrentFolder(`${folderId}`)
  }, [folderId])


  return (
    <>
      <NavbarUser/>
      <NavigationToolbar handleOpenModal={handleOpenModal}/>
      <ShowModal open={open} handleOpenModal={handleOpenModal}/>
      <FileBrowser/>
      <UploadProgressBar/>
    </>
  )
}

export default UserInterface