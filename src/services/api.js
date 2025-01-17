import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(function (config) {

    const token = localStorage.getItem('token');
    if (!token)  return config;
    config.headers.Authorization = 'Bearer ' + token;
    return config;
  }, function (error) {

    return Promise.reject(error);
  });


export default api;