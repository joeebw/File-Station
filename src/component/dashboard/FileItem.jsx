import { fireStoreContext } from '../../context/FireStore';
import ButtonDashBoard from '../buttons/Button';

function FileItem() {
  const {files} = fireStoreContext();


  return (
    <div className='flex flex-wrap gap-8'>
      {files.map(file => {
        return(
          <ButtonDashBoard
            isDirectory={false}
            url={file.url}
            key= {file.url}
            > 
            {file.nameFile}
          </ButtonDashBoard>
        )
      })}
    </div>
  )
}

export default FileItem
