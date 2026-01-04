import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../services/api"; //Импортируем настройку axios

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ИСПОЛЬЗУЕМ JWT ЭНДПОИНТ
      const response = await api.post("/auth/jwt/create/", {
        email: email,
        password: password,
      });

      // сохраняем токены
      const { access, refresh } = response.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      console.log("Успешный вход, JWT токены сохранены");

      //теперь все будущие запросы через `api` будут содержать токен в заголовках
      if (onLogin) {
        onLogin();
      }

      navigate('/dashboard');

    } catch (err) {
      console.error("Ошибка входа:", err);

      if (err.response?.status === 400) {
        setError("Неверный email или пароль");
      } else {
        setError("Ошибка соединения с сервером");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Вход в систему</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
            disabled={loading}
            placeholder="Введите ваш email"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
            disabled={loading}
            placeholder="Введите ваш пароль"
          />
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Выполняется вход..." : "Войти"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        <p>
          Нет аккаунта?{" "}
          <span className="text-blue-600 cursor-pointer">
            Зарегистрироваться
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;