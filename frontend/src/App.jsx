import { Route, Routes, Navigate } from "react-router-dom"
import HomePage from "./pages/home/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import WatchPage from "./pages/WatchPage.jsx"
import SignUp from "./pages/SignUp.jsx"
import Footer from "./components/Footer.jsx"

import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./store/authUser.js"
import { useEffect } from "react"
import { Loader } from "lucide-react";
import SearchPage from "./pages/SearchPage.jsx"
import HistoryPage from "./pages/HistoryPage.jsx"
import NotFoundPage from "./pages/404.jsx"




function App() {

  const { user, isCheckingAuth, authCheck } = useAuthStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if(isCheckingAuth) {
    return(
      <div 
      className="h-screen">
        <div className="flex justify-center items-center bg-black h-full">
          <Loader className='animate-spin text-red-600 size-10' />
        </div>
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={!user ? <LoginPage /> : <Navigate to={'/'} />} />
        <Route path='/signup' element={!user ? <SignUp /> : <Navigate to={'/'} />} />
        <Route path='/watch/:id' element={user ? <WatchPage /> : <Navigate to={'/login'} /> }/>
        <Route path='/search' element={user ? <SearchPage /> : <Navigate to={'/login'} /> } />
        <Route path='/history' element={user ? <HistoryPage /> : <Navigate to={'/login'} /> } />
        <Route path='/*' element={<NotFoundPage />}/>

      </Routes>
      <Footer />
      <Toaster />
    </>
    
    
  )
}

export default App
