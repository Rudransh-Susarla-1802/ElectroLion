import { BrowserRouter } from 'react-router-dom'
import React, { useEffect } from 'react'
import AppRouter from './AppRouter'
import { AuthProvider } from './context/AuthContext'
import { useDispatch } from 'react-redux';
import { setProfile } from './store/profile-slice';
import emailjs from '@emailjs/browser';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize EmailJS
    emailjs.init('otFgHWvKrR6KihWOs');
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        dispatch(setProfile(JSON.parse(storedUser)));
      } catch (e) {
        // handle error if needed
      }
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;