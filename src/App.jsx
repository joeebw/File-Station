import './App.css'
import SignIn from './component/authenticator/SignIn'
import SignUp from './component/authenticator/SignUp'
import UserInterface from './component/dashboard/UserInterface'
import { Routes, Route } from 'react-router-dom'


function App() {
  
  return (
    <>
    <Routes>
        <Route path='/' element={<SignIn/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/userInterface' element={<UserInterface/>}/>
        <Route path='/userInterface/:folderId' element={<UserInterface/>}/>
    </Routes>
    </>
  )
}

export default App