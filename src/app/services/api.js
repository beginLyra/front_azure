
import { API_URL,GRAPHQL_URL } from '@/app/utils/settings'

import { GraphQLClient, gql } from 'graphql-request'

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
  const response = await fetch(`${API_URL}/user/activationcode/${email}`, {
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
//-----------------------------------------Para activar el codigo y si no esta envia otro
export const activateCode = async (email, code) => {
  const response = await fetch(`${API_URL}/user/${email}/${code}/code2`, {
    method: 'POST',  // Cambiar de GET a POST
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    body: JSON.stringify({ email, code }) 
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

//----------------------para obtener el tiempo del codigo ---------------


export const gettimecode = async (email) => {
 
  const response = await fetch(`${API_URL}/timecode/${email}`)

  if (!response.ok) {
   
    throw new Error('Error al obtener datos del usuario');
  }
  return response.json();
};


// Función para crear un nuevo cliente GraphQL con el token
const createGraphQLClient = (token) => {
  return new GraphQLClient(GRAPHQL_URL, {
    headers: token ? {
      Authorization: `Bearer ${token}`,
    } : {},
  });
};

export const getClases = async (clasename, token) => {
  const graphQLClient = createGraphQLClient(token);

  const query = gql`
  query Query($idpe: Int) {
  pedidos(id:$idpe) {
    PedidoID
    productos {
      ProductoID
      Cantidad
      Producto {
      
        NombreProducto
        
      }
    }
  }
}

  `;

  const variables = {
    idpe: clasename
  };

  try {
    const data = await graphQLClient.request(query, variables);
    return data.pedidos[0];
  } catch (error) {
    console.error('Error fetching clases:', error);
    throw new Error('Error al obtener las clases');
  }
};