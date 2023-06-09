import BreadCrumbDashBoard from './BreadCrumbDashBoard';
import FileUpload from './FileUpload';
import {Button} from 'flowbite-react'
import { signOutUser } from '../../FIrebase';
import { userAuth } from '../../context/AuthContext'
import { fireStoreContext } from '../../context/FireStore';

function NavigationToolbar({handleOpenModal}) {
  const { resetUserContent} = fireStoreContext();

  function handleSingOut() {
    signOutUser();
    resetUserContent();
  }

  return (
    <div className='flex flex-col gap-5 sm:flex-row sm:justify-between sm:gap-0 mt-4 px-12'>
        <BreadCrumbDashBoard/>
        <div className='flex gap-5'>
          <FileUpload/>
          <Button color="success" className='h-[53px]' onClick={handleOpenModal}>
            <i className="fa-solid fa-folder-plus text-xl"></i>
          </Button>
          <Button color="success" onClick={handleSingOut}>
            <span>Logout</span>
          </Button>
        </div>
    </div>
  )
}

export default NavigationToolbar
