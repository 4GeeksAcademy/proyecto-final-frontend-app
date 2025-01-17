import api from './api';

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/user/create', userData);
        return response.data;
    } catch (error) {
        console.error('Error al registrar el usuario:', error.response?.data || error.message);
        throw error;
    }
};


export const getUserProfile = async () => {
    const response = await api.get('/user/profile', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

export const loginUser = async (email, password) => {
    try {
      const response = await api.post('/user/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Error en loginUser:', error);
      throw error;
    }
  };
