import { useEffect, useState } from 'react'
import './App.css'
import { collection, getDocs } from 'firebase/firestore'
import {db} from './config/firestore'
import Login from './components/Login'
import SignUp from './components/Signup'
import User from './components/User'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom'
import Admin from './components/Admin'
import AddEventForm from './components/AddEventForm'

function App() {

  const [isAdmin, setIsAdmin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userId, setUserId] = useState({id: "l3BuU7ZVufPZveQNVH9o", email: "admin@sportsBuddy.com"});
  const usersRef = collection(db, "users");
  const sportsRef = collection(db, "sportNames");
  const citiesRef = collection(db, "cities");
  const sportsEventsRef = collection(db, "sportEvents");
  const areasRef = collection(db, "areas");

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path='/' element={isLoggedIn ? isAdmin ? <Admin setIsAdmin={setIsAdmin} setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} sportsRef={sportsRef} citiesRef={citiesRef} areasRef={areasRef} sportsEventsRef={sportsEventsRef}/> :<User areasRef={areasRef} citiesRef={citiesRef} sportsRef={sportsRef} sportsEventsRef={sportsEventsRef} userId={userId} setIsAdmin={setIsAdmin} setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} /> : <Navigate replace to={'/login'} />} />
      <Route path='/login' element={<Login usersRef={usersRef} setIsAdmin={setIsAdmin} setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />} />
      <Route path='/signup' element={<SignUp usersRef={usersRef} />} />
      <Route path='/user' element={isLoggedIn ? <User areasRef={areasRef} citiesRef={citiesRef} sportsRef={sportsRef} userId={userId} sportsEventsRef={sportsEventsRef} setIsAdmin={setIsAdmin} setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} /> : <Navigate replace to={'/login'} />} />
      <Route path='/admin' element={isLoggedIn ? isAdmin ? <Admin setIsAdmin={setIsAdmin} setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} sportsEventsRef={sportsEventsRef} sportsRef={sportsRef} citiesRef={citiesRef} areasRef={areasRef} /> : <Navigate replace to='/404' /> : <User areasRef={areasRef} citiesRef={citiesRef} sportsRef={sportsRef} userId={userId} sportsEventsRef={sportsEventsRef} setIsAdmin={setIsAdmin} setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />} />
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
      {/* <User /> */}
      {/* <AddEventForm sportsEventsRef={sportsEventsRef} sportsRef={sportsRef} citiesRef={citiesRef} areasRef={areasRef} userId={userId}/> */}
    </>
  )
}

export default App
