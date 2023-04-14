import { createContext, useContext, useEffect, useState } from "react"
import {
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signOut
} from 'firebase/auth'
import { auth} from "../FIrebase";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function userAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  async function  handleCreateUser(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setError(null)
      navigate('/userInterface/root')
    } catch (error) {
      switch (error.code) {
        case 'auth/weak-password':
          setError('Password should be at least 6 characters')
          break;
        case 'auth/email-already-in-use':
          setError('You are already registered')
          break;
        default:
          setError(error.code)
      }
      
    }
  }

  async function handleSignInUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setError(null);
      navigate('/userInterface/root')
    } catch (error) {
      switch (error.code) {
        case 'auth/wrong-password':
          setError('Somenthing is wrong')
          break;
        case 'auth/user-not-found':
          setError('Unregistered user, Sign up')
          break;  
        default:
          setError(error.code)
      }
      
    }
  }

  async function handleLogout() {
    try {
      signOut(auth)
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth ,(user) => {
      if (user) {
        setUser(user);
      } else {
        navigate('/')
        setUser('')
      }
    });

    return unsubscribe;
  }, []);


  const value = {
    handleCreateUser,
    handleSignInUser,
    handleLogout,
    error: [error, setError],
    user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

