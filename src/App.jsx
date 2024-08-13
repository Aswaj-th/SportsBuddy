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

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path='/' element={<Layout />}>
//       <Route path='' element={<Home />} />
//       <Route path='about' element={<About />} />
//       <Route path='contact' element={<Contact />} />
//       <Route path='user/:userid' element={<User />} />
//       <Route 
//       loader={githubInfoLoader}
//       path='github' 
//       element={<Github />}
//        />
//     </Route>
//   )
// )

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const usersRef = collection(db, "users");
  const sportsRef = collection(db, "sportNames");
  const citiesRef = collection(db, "cities");

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path='/' element={isLoggedIn ? <User /> : <Navigate replace to={'/login'} />} />
      <Route path='/login' element={<Login usersRef={usersRef}/>} />
      <Route path='/signup' element={<SignUp usersRef={usersRef}/>} />
      <Route path='/user' element={<User />} />
      <Route path='/admin' element={<Admin />} />
      </>
    )
  )

  let sports;

  const getSports = async () => {
    const sportsRef = collection(db, "sportNames")
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
