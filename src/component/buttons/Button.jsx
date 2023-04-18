
function ButtonDashBoard(props) {
  const {children, onClick, isDirectory, url} = props;
  const truncatedText = children.slice(0, 27);

  return (
    <>
      {isDirectory ?
        <button className= 'min-w-[110px] max-w-xs bg-white text-green-500 border-2 border-green-500 hover:bg-green-500 hover:text-white active:bg-green-700 active:border-green-700 p-3 rounded'
          onClick={onClick}
          title={children}
        >
          <i className={`fa-regular fa-folder mr-2`}></i>
          {children.length <= 27 ? children : `${truncatedText}...` }
        </button>
        :
          
        <a href={`${url}`} target='_blank' className= 'relative min-w-[110px] max-w-xs bg-white text-green-500 border-2 border-green-500 hover:bg-green-500 hover:text-white active:bg-green-700 active:border-green-700 p-3 rounded'
          onClick={onClick}
          title={children}
        >
          <i class="absolute top-0 right-1 fa-solid fa-xmark"></i>
          <i className={`fa-regular fa-file mr-2`}></i>
          {children.length <= 27 ? children : `${truncatedText}...` }
        </a>
      }
    </>
  )
}

export default ButtonDashBoard
