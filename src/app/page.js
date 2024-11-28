'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { getUserData, getClases, getActivationCode } from '@/app/services/api'
export default function Home() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null)
  const [clases, setClases] = useState([])
  const [statecode, setstatecode] = useState(0)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {

        const userData = await getUserData(token)
        setUser(userData)

        const existCode = await getActivationCode(userData.email)
        console.log("Miremos si el man esta registrado", existCode[0].active)
        if (Number(existCode[0].active) === 0 ) {
        router.push('/codeactivation')
      }
      
        setstatecode(Number(existCode[0].active))
        console.log(userData.email)

        // const clasesData = await getClases("MM", token)
        // setClases(clasesData)

      } catch (err) {
        console.error('Error fetching user data:', err)

        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])




  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-gray-800">Cargando...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>
  }
  return (
    <div >


      <div className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1623600989906-6aae5aa131d4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1582&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh"
      }} id="modal-id">
        <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
        <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">

          <div className={statecode === 0 ? 'hidden' : 'block'}>

            <div className="text-center p-5 flex-auto justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 -m-1 flex items-center text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 flex items-center text-red-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h2 className="text-xl font-bold py-4 text-blue-500">Registro Exitoso</h2>
              <h2 className="text-xl font-bold py-4 text-blue-500">2 minutos desde la activación de la cuenta</h2>
              <p className="text-sm text-gray-500 px-8">Bienvenido {user.email}</p>
            </div>

            <div className="p-3  mt-2 text-center space-x-4 md:block">
              <button onClick={handleLogout} className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">
                Cerrar Sesion
              </button>
              <button className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600">Delete</button>
            </div>
          </div>

          {/* ---------------  ACTIVATION CODE-+----- */}
          <div className={statecode === 1 ? 'hidden' : 'block'}>

            <div className="text-center p-5 flex-auto justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 -m-1 flex items-center text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 flex items-center text-red-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h2 className="text-xl font-bold py-4 ">Activacion de cuenta</h2>
              <p className="text-sm text-gray-500 px-8">Bienvenido {user.email}</p>
            </div>

            <div className="p-3  mt-2 text-center space-x-4 md:block">
              <button onClick={handleLogout} className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">
                Cerrar Sesion
              </button>
              <button className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
