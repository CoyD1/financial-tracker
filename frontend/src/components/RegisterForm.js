import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import api from "../services/api";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        re_password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.re_password) {
            setError("Пароли не совпадают");
            setLoading(false);
            return;
        }

        try {
            await api.post("/auth/users/", formData);
            // После успешной регистрации перенаправляем на логин
            navigate('/login', { state: { message: "Регистрация прошла успешно! Теперь вы можете войти." } });
        } catch (err) {
            console.error("Ошибка регистрации:", err);
            if (err.response?.data) {
                // Выводим первую ошибку из ответа Djoser
                const firstError = Object.values(err.response.data)[0];
                setError(Array.isArray(firstError) ? firstError[0] : "Ошибка регистрации");
            } else {
                setError("Ошибка соединения с сервером");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Имя пользователя</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        required
                        disabled={loading}
                        placeholder="Выберите имя"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        required
                        disabled={loading}
                        placeholder="Введите ваш email"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Пароль</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        required
                        disabled={loading}
                        placeholder="Придумайте пароль"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Подтвердите пароль</label>
                    <input
                        type="password"
                        name="re_password"
                        value={formData.re_password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        required
                        disabled={loading}
                        placeholder="Повторите пароль"
                    />
                </div>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-green-300"
                    disabled={loading}
                >
                    {loading ? "Регистрация..." : "Зарегистрироваться"}
                </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
                <p>
                    Уже есть аккаунт?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Войти
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;
