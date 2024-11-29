'use client'

import { useState,useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loginUser} from '../services/api'
import { validatePassword, validateEmail } from '../utils/validations'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLogin, setIsLogin] = useState(false)
  const router = useRouter()
 

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLogin(true)

    const passwordError = validatePassword(password)
    const emailError = validateEmail(email)

    if (passwordError || emailError) {
        setError(passwordError || emailError)
        setIsLogin(false)
        return
    }

    try {
   
      const data = await loginUser({ email, password })
     
  
      localStorage.setItem('token', data.idToken)
      setIsLogin(true)
      
      router.push('/')
    } catch (err) {
     
      setError(err.message || 'Error en el inicio de sesión')
      setIsLogin(false)
    }
  }

  return (
    <div className="bg-sky-100 flex justify-center items-center h-screen">
      <div className="w-1/2 h-screen hidden lg:block">
        <img
          src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826"
          alt="Placeholder Image"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 bg-sky-100">
            <label htmlFor="email" className="block text-black">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 text-black"
              required
              autoComplete="off"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-800">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 text-black"
              required
              autoComplete="off"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="mb-4 flex items-center">
            <input type="checkbox" id="remember" name="remember" className="text-red-500" />
            <label htmlFor="remember" className="text-green-900 ml-2">Remember Me</label>
          </div>

          <div className="mb-6 text-blue-500">
            <a href="#" className="hover:underline">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={isLogin}
            className="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
          >
            {isLogin ? 'Logging in...' : 'Login'}
            
          </button>
        </form>

        <div className="mt-6 text-green-500 text-center">
          <Link href="/register" className="hover:underline">Sign up Here</Link>
        </div>
      </div>
    </div>
  )
}
