import { createContext, useContext, useEffect, useState } from "react"
import { authStateChanged } from "../FIrebase";
import { auth, createUserWithFirebase} from "../FIrebase";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function userAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = authStateChanged((user) => {
      if(!user) {
        setUser(user);
        navigate('/');
        setError(null);
        return;
      }
      setUser(user);
    });
    return unsubscribe;
  }, []);


  const value = {
    error: [error, setError],
    user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

