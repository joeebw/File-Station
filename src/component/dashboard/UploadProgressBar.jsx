import {Toast, Progress} from 'flowbite-react'
import { storageContext } from '../../context/StorageContext'

function UploadProgressBar() {
  const {progresspercent,uploadingFile} = storageContext();

  return (
    <>
      {progresspercent > 0  &&
      <div className="w-[250px] absolute bottom-7 right-4 sm:bottom-16 sm:right-8">
        <Toast className='flex flex-col items-center'>
          <div className="ml-3 text-sm font-normal">
            {uploadingFile}
          </div>
          <div className='h-5 w-full mt-7'>
            <Progress
              color="green"
              progress={progresspercent}
            />
          </div>
        </Toast>
      </div>}
    </>
  )
}

export default UploadProgressBar
