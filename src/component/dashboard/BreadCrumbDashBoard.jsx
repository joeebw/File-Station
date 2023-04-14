import {Breadcrumb} from 'flowbite-react'
import { useEffect, useState } from 'react'
import { Link} from 'react-router-dom'
import { fireStoreContext } from '../../context/FireStore';

function BreadCrumbDashBoard() {
  const [navigationHistory, setNavigationHistory] = useState( () => {
    const routesBreadCrumb = JSON.parse(localStorage.getItem('breadCrumb'));
    return routesBreadCrumb ? routesBreadCrumb : []
  });
  const {childFolder, currentFolder} = fireStoreContext();
  
  useEffect(() => {
    if (Object.keys(childFolder).length > 0) {
      setNavigationHistory(prev => [...prev, childFolder]);
    }
  }, [childFolder])


  function handleRestructureBreadcrumb(route) {
    const index = navigationHistory.findIndex(element => {
      return element.dateAdded.nanoseconds === route
    })
    setNavigationHistory(prev => prev.slice(0, index + 1))
  }

  useEffect(() => {
    if (currentFolder === 'root') {
      setNavigationHistory([]);
    }
  },[currentFolder])

  useEffect(() => {
    localStorage.setItem('breadCrumb', JSON.stringify(navigationHistory))
  }, [navigationHistory])

  useEffect(() => {
    window.onpopstate = () => {
      setNavigationHistory(prev => {
        if (prev.length <= 0) return prev;
        return prev.slice(0, -1);
      });
    }
  }, [])

  return (
    <Breadcrumb aria-label="Default breadcrumb example">
      <Breadcrumb.Item
      >
        <Link 
          to={'/userinterface/root'}
          className='text-lg'
        >
          Home
        </Link>
      </Breadcrumb.Item>

      {navigationHistory.length > 0 && navigationHistory.map((element) => {
        return( 
        <Breadcrumb.Item
          key={element.dateAdded.nanoseconds}
        >
          <Link 
            to={`/userinterface/${element.dateAdded.nanoseconds}`}
            onClick={() => handleRestructureBreadcrumb(element.dateAdded.nanoseconds)}
            className='text-lg'
          >
            {element.nameFolder.length > 20 ? 
            `${element.nameFolder.slice(0,20)}...` :  element.nameFolder}
          </Link>
        </Breadcrumb.Item>)
      })}

    </Breadcrumb>
  )
}

export default BreadCrumbDashBoard
