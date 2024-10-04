
import { useState } from 'react'
import RegisterForm from '../components/form/Register/form'
import LoginFormComponent from '../components/form/Login/Login'

export default function Auth() {
    const [login , setIsLogin] = useState(true);
  return (
    <div className='center-col'>
        {login && <h2>Login to Your Account</h2>}
          {login?<LoginFormComponent/>:<RegisterForm/>}

    </div>
  )
}