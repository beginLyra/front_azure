

import { API_URL } from '@/app/utils/settings'


export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error('Error en creacion de cuenta');
    }
    return response.json();
  };

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error('Error en el inicio de sesión');
  }
  return response.json();
};
//-----------------------------------------Para ver si la cuenta esta activa
export const getActivationCode = async (email) => {
  const response = await fetch(`${API_URL}/${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener el código de activación');
  }
  
  return response.json(); // Esto asume que el backend retorna el resultado en formato JSON
};
//-----------------------------------------Para activar el codigo
export const activateCode = async (email, code) => {
  const response = await fetch(`${API_URL}/${email}/${code}/code2`, {
    method: 'POST',  // Cambiar de GET a POST
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    body: JSON.stringify({ email, code })  // Enviar los datos en el cuerpo (opcional, según lo que necesite el backend)
  });

  if (!response.ok) {
    throw new Error('Error al obtener el código de activación');
  }

  return response.json(); // Esto asume que el backend retorna el resultado en formato JSON
};





export const getUserData = async (token) => {
 
  const response = await fetch(`${API_URL}/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
   
    throw new Error('Error al obtener datos del usuario');
  }
  return response.json();
};
