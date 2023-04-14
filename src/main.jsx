import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FireStoreProvider } from './context/FireStore'
import { StorageProvider } from './context/StorageContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <AuthProvider>
        <FireStoreProvider>
          <StorageProvider>
            <App />
          </StorageProvider>
        </FireStoreProvider>
      </AuthProvider>
    </BrowserRouter>,
)
