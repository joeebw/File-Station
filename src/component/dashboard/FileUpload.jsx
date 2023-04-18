import {Button} from 'flowbite-react'
import { storageContext } from '../../context/StorageContext';


function FileUpload() {
  const {handleFileUploadToStorage} = storageContext();


  function handleSubmit(e) {
    e.preventDefault();
    handleFileUploadToStorage(e);
  }

  return (
      <Button 
        color='success' 
        className='relative bg-green-700 w-14 h-[48.9px] rounded-md cursor-pointer'
      >
        <i className="text-xl fa-solid fa-file-arrow-up text-white"></i>
        <input 
          type="file" 
          onChange={handleSubmit}
          className='absolute right-0 top-1 bottom-0 left-0 opacity-0' 
        />
      </Button>
  )
}

export default FileUpload
