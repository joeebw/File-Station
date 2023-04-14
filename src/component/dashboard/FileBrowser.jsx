import FolderItem from './FolderItem';
import FileItem from './FileItem';
import { fireStoreContext } from '../../context/FireStore';
import { useNavigate } from 'react-router-dom';

function FileBrowser() {
  const {folders, selectChildFolder} = fireStoreContext();
  const navigate = useNavigate(); 

  return (
    <div className='px-10 my-8'>
      <h3 className='font-semibold my-5'>Folders</h3>
      <FolderItem 
        folders={folders} 
        navigate={navigate} 
        selectChildFolder={selectChildFolder}
      />
      <h3 className='font-semibold mt-9 mb-5'>Files</h3>
      <FileItem/>
    </div>
  )
}

export default FileBrowser
