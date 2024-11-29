'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerUser } from '../services/api'
import { validatePassword, validateName, validateEmail } from '../utils/validations'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [error, setError] = useState('')
  const [ disabled, setDisabled ] = useState(false)
  const router = useRouter()
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDisabled(true)

    // Validaciones
    const passwordError = validatePassword(password)
    const firstnameError = validateName(firstname)
    const lastnameError = validateName(lastname)
    const emailError = validateEmail(email)

    if (passwordError || firstnameError || lastnameError || emailError) {
      setError(passwordError || firstnameError || lastnameError || emailError)
      setDisabled(false)
      return
    }

    try {
      await registerUser({ email, password, firstname, lastname });
      router.push('/login');
    } catch (err) {
      setDisabled(false)
      if (err.status === 400) {
        setError('El usuario ya existe');
      } else if (err.status === 422) {
        setError('Los datos no cumplen con las reglas de validación');
      } else {
        setError(err.message || 'Error en el registro');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Registro</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 "
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 "
            />
          </div>
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 "
            />
          </div>
          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Apellido</label>
            <input
              id="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 "
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button disabled={disabled}  type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            { !disabled ? 'Registrarse' : 'Registrando...' }
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta? <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}