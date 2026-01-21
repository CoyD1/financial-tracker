import axios from "axios";

//БАЗОВЫЙ URL - "адрес нашего бэкенда"
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

//СОЗДАЕМ НАСТРОЕННЫЙ AXIOS - это JavaScript-библиотека для выполнения HTTP-запросов. Это "почтальон" между фронтендом и бэкендом.

const api = axios.create({
  baseURL: API_BASE_URL, //теперь все запросы будут к http://localhost:8000/api
  timeout: 10000, //максимум 10 секунд ждем ответ
});

//ПЕРЕХВАТЧИК ЗАПРОСОВ
api.interceptors.request.use(
  (config) => {
    //перед КАЖДЫМ запросом автоматически проверяем есть ли токен
    const token = localStorage.getItem("access_token");
    if (token) {
      //если токен есть - добавляем его в заголовки с префиксом Bearer
      config.headers.Authorization = `Bearer ${token}`;
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
  async (error) => {
    const originalRequest = error.config;

    // Если сервер возвращает 401 и это не повторный запрос
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          // Пытаемся обновить токен
          const response = await axios.post(
            `${API_BASE_URL}/auth/jwt/refresh/`,
            {
              refresh: refreshToken,
            }
          );

          const { access } = response.data;
          localStorage.setItem("access_token", access);

          // Повторяем изначальный запрос с новым токеном
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Если обновление не удалось - разлогиниваем
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
