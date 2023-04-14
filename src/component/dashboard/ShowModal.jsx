import { useRef, useEffect } from 'react';
import  {Modal, Label, TextInput, Button} from 'flowbite-react';
import { fireStoreContext } from '../../context/FireStore';

function ShowModal({open, handleOpenModal}) {
  const addFolder = useRef();
  const {handleAddFolder} = fireStoreContext();

  useEffect(() => {
    if (open) {
      addFolder.current.focus();
    }
  }, [open]);

  function handleSubmit() {
    if (!addFolder.current.value) return;
    handleAddFolder(addFolder.current.value);
    addFolder.current.value = '';
  }

  return (
    <Modal
      show={open}
      size="lg"
      popup={true}
      onClose={handleOpenModal}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="Folder"
                  value="Folder Name"
                />
              </div>
              <TextInput
                id="Folder"
                placeholder="name of your folder"
                required={true}
                ref={addFolder}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <div className="w-full">
              <Button color='success' 
                onClick={handleSubmit}
              >
                Add Folder
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
  )
}

export default ShowModal
