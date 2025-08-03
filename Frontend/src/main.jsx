import App from './App.jsx'
import React from 'react'
import ReactDom from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = 894280440314-e4l314gjnrl6i8gls37g0bnrauevvck9.apps.googleusercontent.com

ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
)
