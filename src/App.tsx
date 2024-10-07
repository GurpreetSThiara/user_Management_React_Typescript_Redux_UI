import { Outlet } from "react-router-dom"
import useLogin from "./hooks/auth/useLogin"
import LayoutLoader from "./components/LayoutLoader/LayoutLoader";
import { useEffect } from "react";
import './App.css'

const App = () => {
  // // const { handleLogin, isLoading, isError, error }= useLogin();
  
  // useEffect(()=>{
  //   // handleLogin();
  // },[])

  // if(isLoading){
  //   return <LayoutLoader/>
  // }

  return (
    <div className="bg-transparent">
     
             <main className="bg-transparent">
   
        <Outlet />
      </main>
    </div>
  )
}

export default App