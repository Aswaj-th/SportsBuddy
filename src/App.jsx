import { useEffect, useState } from 'react'
import './App.css'
import { collection, getDocs } from 'firebase/firestore'
import {db} from './config/firestore'
import Login from './components/Login'
import SignUp from './components/Signup'
import User from './components/User'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom'
import Admin from './components/Admin'

function App() {

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const usersRef = collection(db, "users");
  const sportsRef = collection(db, "sportNames");
  const citiesRef = collection(db, "cities");
  const sportsEventsRef = collection(db, "sportEvents");

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path='/' element={isLoggedIn ? <User /> : <Navigate replace to={'/login'} />} />
      <Route path='/login' element={<Login usersRef={usersRef} setIsAdmin={setIsAdmin} setIsLoggedIn={setIsLoggedIn} />} />
      <Route path='/signup' element={<SignUp usersRef={usersRef} />} />
      <Route path='/user' element={isLoggedIn ? <User sportsEventsRef={sportsEventsRef}/> : <Navigate replace to={'/login'} />} />
      <Route path='/admin' element={isLoggedIn ? isAdmin ? <Admin /> : <Navigate replace to='/404' /> : <User />} />
      </>
    )
  )

  let sports;

  const getSports = async () => {
    const querySnapshot = await getDocs(sportsRef);
    const sports = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
    return sports;
  }

  useEffect(() => {
    sports = getSports();
  }, [])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
