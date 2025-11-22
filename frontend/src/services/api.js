import axios from 'axios';

//БАЗОВЫЙ URL - "адрес нашего бэкенда"
const API_BASE_URL = 'http://localhost:8000/api';

//СОЗДАЕМ НАСТРОЕННЫЙ AXIOS - это JavaScript-библиотека для выполнения HTTP-запросов. Это "почтальон" между фронтендом и бэкендом.

const api = axios.create({
  baseURL: API_BASE_URL, //теперь все запросы будут к http://localhost:8000/api
  timeout: 10000, //максимум 10 секунд ждем ответ
});

//ПЕРЕХВАТЧИК ЗАПРОСОВ
api.interceptors.request.use(
  (config) => {
    //перед КАЖДЫМ запросом автоматически проверяем есть ли токен
    const token = localStorage.getItem('auth_token');
    if (token) {
      //если токен есть - добавляем его в заголовки
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//ПЕРЕХВАТЧИК ОТВЕТОВ - "обработчик ошибок"
api.interceptors.response.use(
  (response) => response, //если все ок - просто возвращаем ответ
  (error) => {
    if (error.response?.status === 401) {
      // Если сервер ловит ошибку с авторизацией
      localStorage.removeItem('auth_token'); //удаляем старый токен
      window.location.href = '/login'; //отправляем на страницу входа
    }
    return Promise.reject(error);
  }
);

export default api;