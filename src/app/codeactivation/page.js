'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { getUserData, getActivationCode, activateCode } from '@/app/services/api'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [code, setCode] = useState("")  // Estado para manejar el código ingresado
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        // Aquí estamos obteniendo el correo del token (decodificando el JWT)
        const userData = await getUserData(token)
        setUser(userData) 
        
        const existCode = await getActivationCode(userData.email)
        console.log("Miremos si el man esta registrado", existCode[0].active)
        if (Number(existCode[0].active) === 1 ) {
        router.push('/login')
      }

      } catch (err) {
        console.error('Error fetching user data:', err)
      
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  // Función para manejar el envío del código
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!code) {
      setError("Por favor ingresa el código de activación")
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const userData = await getUserData(token)  // Obtener nuevamente los datos del usuario
      const result = await activateCode(userData.email, code) 
      console.log(result.serverResponse.Message) // Llamar a la API para activar el código
      
      if (result.serverResponse.Message === 'Código expirado') {
        alert(result.serverResponse.Message+" ENVIAMOS UN NUEVO CORREO CON UN NUEVO CODIGO")
        router.push("/login")
      }else{
        alert("Registrado exitosamente")
        router.push("/")
      }

    } catch (err) {
      console.error('Error al activar el código:', err)
      alert("Error al activar codigo")
    }
  }

  // Si está cargando, muestra un mensaje de carga
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  // Si hay error, muestra el mensaje de error
  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>
  }

  return (
    <section className="grid h-screen place-content-center bg-slate-900 text-slate-300">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="mb-10 text-center text-indigo-400">
          <h1 className="text-3xl font-bold tracking-widest">Bienvenido {user.email}</h1>
          <p><span className="font-bold">Ingresa tu</span> código <span className="font-bold">para</span> navegar de manera segura.</p>
        </div>
        <div className="flex flex-col items-center justify-center space-y-6">
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Código" 
            value={code}  // Vincular el valor del input con el estado
            onChange={(e) => setCode(e.target.value)}  // Actualizar el estado cuando el input cambia
            className="w-80 appearance-none rounded-full border-0 bg-slate-800/50 p-2 px-4 focus:bg-slate-800 focus:ring-2 focus:ring-orange-500" 
            required 
          />
          
          <p id="validation" className="text-center text-orange-500 italic text-sm"></p>
          <button 
            id="showPw" 
            type="button" 
            className="rounded-full bg-indigo-500 p-2 px-4 text-white hover:bg-orange-500"
          >
           Cerrar Sesion
          </button>
          <button 
            type="submit" 
            className="rounded-full bg-green-500 p-2 px-4 text-white hover:bg-green-600"
          >
            Enviar Código
          </button>
        </div>
      </form>
    </section>
  );
}
