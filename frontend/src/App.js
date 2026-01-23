import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";
import AddTransactionForm from "./components/AddTransactionForm";
import TransactionHistory from "./components/TransactionHistory";
import MainLayout from "./components/Layout/MainLayout";
import LandingPage from "./components/LandingPage";
import "./App.css";
import StatisticsPage from "./components/Statistics/StatisticsPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  //проверяем авторизацию при загрузке приложения
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  //функция для обновления статуса авторизации
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  //функция для выхода
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>

        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/40 animate-pulse">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-widest uppercase">
              FinanceTracker
            </h1>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Главная лендинг страница */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LandingPage />
              )
            }
          />

          {/* Страница входа */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginForm onLogin={handleLogin} />
              )
            }
          />

          {/* Страница регистрации */}
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <RegisterForm />
              )
            }
          />

          {/* Дашборд */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <MainLayout onLogout={handleLogout}>
                  <Dashboard />
                </MainLayout>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Страница добавления операции */}
          <Route
            path="/add-transaction"
            element={
              isAuthenticated ? (
                <MainLayout onLogout={handleLogout}>
                  <AddTransactionForm />
                </MainLayout>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Страница истории */}
          <Route
            path="/history"
            element={
              isAuthenticated ? (
                <MainLayout onLogout={handleLogout}>
                  <TransactionHistory />
                </MainLayout>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Страница редактирования */}
          <Route
            path="/edit-transaction/:id"
            element={
              isAuthenticated ? (
                <MainLayout onLogout={handleLogout}>
                  <AddTransactionForm />
                </MainLayout>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          {/* Страница статистики */}
          <Route
            path="/statistics"
            element={
              isAuthenticated ? (
                <MainLayout onLogout={handleLogout}>
                  <StatisticsPage />
                </MainLayout>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
