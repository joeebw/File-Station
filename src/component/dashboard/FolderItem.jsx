import ButtonDashBoard from "../buttons/Button"

function FolderItem({folders, navigate, selectChildFolder}) {
  return (
    <div className='flex flex-wrap gap-8'>
      {folders.map((folder) => {
        return (
        <ButtonDashBoard 
          key={folder.nameFolder}
          isDirectory={true}
          folderId={folder.id}
          onClick={() => {
            navigate(`/userInterface/${folder.dateAdded.nanoseconds}`)
            selectChildFolder(folder)
          }}
        >
          {folder.nameFolder}
        </ButtonDashBoard>
        )
      })}
    </div>
  )
}

export default FolderItem
