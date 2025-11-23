import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    //проверяем авторизацию при загрузке приложения
    useEffect (() =>{
        const token = localStorage.getItem('auth_token');
        setIsAuthenticated(!!token);
        setLoading(false);
    }, []);

    //функция для обновления статуса авторизации
    const handleLogin = () => {
        setIsAuthenticated(true);
    }

    //функция для выхода
    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
    };
    if (loading){
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg">Загрузка...</div>
            </div>
        );
    }
    return (
        <Router>
            <div className="App">
                {/* Показываем Header только для авторизованных пользователей */}
                {isAuthenticated && <Header onLogout={handleLogout} />}

                <main className={isAuthenticated ? "container max-auto p-4" : ""}>
                    <Routes>
                        {/*Автоматическое перенаправление с корневого пути*/}
                        <Route
                            path="/"
                            element={
                            isAuthenticated ?
                                <Navigate to="/dashboard" replace />:
                                <Navigate to="/login" replace />
                            }
                        />

                        {/* Страница входа */}
                        <Route
                            path="/login"
                            element={
                                isAuthenticated ?
                                    <Navigate to="/dashboard" replace /> :
                                    <LoginForm onLogin={handleLogin} />
                            }
                        />
                        {/* Главная страница */}
                        <Route
                            path="/dashboard"
                            element={
                                isAuthenticated ?
                                    <Dashboard /> :
                                    <Navigate to="/login" replace />
                            }
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App;
