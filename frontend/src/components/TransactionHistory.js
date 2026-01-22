import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get current date for defaults
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // JS months are 0-indexed
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());

    // Lists for dropdowns
    const months = [
        { id: 1, name: 'Январь' },
        { id: 2, name: 'Февраль' },
        { id: 3, name: 'Март' },
        { id: 4, name: 'Апрель' },
        { id: 5, name: 'Май' },
        { id: 6, name: 'Июнь' },
        { id: 7, name: 'Июль' },
        { id: 8, name: 'Август' },
        { id: 9, name: 'Сентябрь' },
        { id: 10, name: 'Октябрь' },
        { id: 11, name: 'Ноябрь' },
        { id: 12, name: 'Декабрь' },
    ];

    // Generate last 5 years
    const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                // Отправляем параметры фильтрации на бэкенд
                // api/transactions/?month=5&year=2024
                const response = await api.get(`transactions/`, {
                    params: {
                        month: selectedMonth,
                        year: selectedYear
                    }
                });
                setTransactions(response.data.results || response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch history", err);
                setError("Не удалось загрузить историю");
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [selectedMonth, selectedYear]);

    const handleDelete = async (id) => {
        if (window.confirm("Вы уверены, что хотите удалить эту операцию?")) {
            try {
                await api.delete(`transactions/${id}/`);
                // Remove from state without reloading
                setTransactions(prev => prev.filter(t => t.id !== id));
            } catch (err) {
                console.error("Failed to delete", err);
                alert("Ошибка при удалении");
            }
        }
    };

    const formatAmount = (amount, type) => {
        const formatted = new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB'
        }).format(amount);
        return type === 'IN' ? `+${formatted}` : `-${formatted}`;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <Link to="/dashboard" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                    &larr; Назад на главную
                </Link>
                <Link
                    to="/add-transaction"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-sm py-2.5 px-6 rounded-xl shadow-lg shadow-blue-600/20 transition-all font-medium"
                >
                    + Добавить
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">История операций</h1>
                <p className="text-zinc-400 mt-1">Просматривайте и управляйте своими финансами</p>
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl relative mb-6" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {/* Filters */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl mb-6 flex space-x-6">
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Месяц</label>
                    <div className="relative">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="block w-40 pl-4 pr-10 py-2.5 bg-zinc-800 border-zinc-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none shadow-sm transition-all sm:text-sm"
                        >
                            {months.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Год</label>
                    <div className="relative">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="block w-32 pl-4 pr-10 py-2.5 bg-zinc-800 border-zinc-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none shadow-sm transition-all sm:text-sm"
                        >
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-zinc-900 shadow-xl overflow-hidden rounded-2xl border border-zinc-800">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-zinc-500">Загрузка данных...</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="p-16 text-center text-zinc-500 flex flex-col items-center">
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-zinc-600">
                            <span className="text-2xl">?</span>
                        </div>
                        <p className="font-medium text-zinc-400">Операций не найдено</p>
                        <p className="text-sm mt-1">Попробуйте изменить фильтры или добавьте новую операцию.</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-zinc-800/50">
                        <thead>
                            <tr className="bg-zinc-950/30">
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                    Дата
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                    Категория
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                    Описание
                                </th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                    Сумма
                                </th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                    Действия
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {transactions.map((t) => (
                                <tr key={t.id} className="group hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400 font-medium">
                                        {new Date(t.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-200">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.type === 'IN' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                            {t.category_name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-400 max-w-xs truncate group-hover:text-zinc-300">
                                        {t.description || '-'}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${t.type === 'IN' ? 'text-emerald-400' : 'text-zinc-200'
                                        }`}>
                                        {formatAmount(t.amount, t.type)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/edit-transaction/${t.id}`} className="text-blue-400 hover:text-blue-300 mr-4 transition-colors">
                                            Изменить
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TransactionHistory;
