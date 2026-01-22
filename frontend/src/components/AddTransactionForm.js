import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    AlignLeft,
    X,
    Check,
    AlertCircle,
    ChevronDown
} from 'lucide-react';
import api from '../services/api';

const AddTransactionForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        type: 'EX',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('categories/');
                setCategories(response.data.results || response.data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
                setError("Не удалось загрузить категории");
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (isEditMode) {
            const fetchTransaction = async () => {
                try {
                    const response = await api.get(`transactions/${id}/`);
                    const data = response.data;
                    setFormData({
                        type: data.type,
                        amount: data.amount,
                        category: data.category,
                        date: data.date,
                        description: data.description || ''
                    });
                } catch (err) {
                    console.error("Failed to fetch transaction", err);
                    setError("Не удалось загрузить данные транзакции");
                }
            };
            fetchTransaction();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditMode) {
                await api.put(`transactions/${id}/`, formData);
            } else {
                await api.post('transactions/', formData);
            }
            navigate('/dashboard');
        } catch (err) {
            console.error("Failed to save transaction", err);
            setError("Ошибка при сохранении. Проверьте правильность введенных данных.");
            setLoading(false);
        }
    };

    const filteredCategories = categories.filter(
        cat => cat.type === formData.type
    );

    return (
        <div className="min-h-[85vh] flex items-center justify-center p-6">
            <div className="w-full max-w-xl transition-all duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-10 px-2 text-white">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEditMode ? 'Редактировать операцию' : 'Новая запись'}
                    </h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors border border-zinc-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3">
                        <AlertCircle size={18} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Amount Input */}
                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-xl hover:border-zinc-700 transition-all">
                        <div className="flex flex-col items-center gap-6">
                            {/* Type Toggle */}
                            <div className="flex gap-2 p-1.5 bg-zinc-950 border border-zinc-800 rounded-2xl w-full">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'IN', category: '' })}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${formData.type === 'IN'
                                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
                                >
                                    <ArrowUpRight size={16} /> Доход
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'EX', category: '' })}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${formData.type === 'EX'
                                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
                                >
                                    <ArrowDownRight size={16} /> Расход
                                </button>
                            </div>

                            <div className="w-full text-center space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Сумма к зачислению</label>
                                <div className="flex items-center justify-center relative">
                                    <input
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.amount}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full bg-transparent border-none text-white text-6xl font-bold focus:ring-0 text-center placeholder-zinc-800 transition-all font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        autoFocus
                                    />
                                    <span className="text-3xl font-light text-zinc-600 absolute right-4">₽</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Category */}
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus-within:border-zinc-500 transition-all">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Wallet size={12} className="text-zinc-600" /> Категория
                            </label>
                            <div className="relative">
                                <select
                                    id="category"
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-none text-white focus:ring-0 appearance-none py-1 h-8 text-sm font-medium"
                                >
                                    <option value="" disabled className="bg-zinc-900">Выберите категорию</option>
                                    {filteredCategories.map(cat => (
                                        <option key={cat.id} value={cat.id} className="bg-zinc-900">{cat.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                            </div>
                        </div>

                        {/* Date */}
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus-within:border-zinc-500 transition-all">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Calendar size={12} className="text-zinc-600" /> Дата операции
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full bg-transparent border-none text-white focus:ring-0 py-1 h-8 text-sm font-medium"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus-within:border-zinc-500 transition-all">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <AlignLeft size={12} className="text-zinc-600" /> Описание
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="На что потрачено или откуда доход?"
                            className="w-full bg-transparent border-none text-white focus:ring-0 py-1 h-8 text-sm font-medium placeholder-zinc-700"
                        />
                    </div>

                    {/* Final Action */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-all bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:bg-zinc-800 active:scale-95"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-[2] py-4 px-12 text-xs font-bold uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${loading
                                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                : 'bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/5 active:bg-zinc-300'
                                }`}
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-600 rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Check size={16} />
                                    {isEditMode ? 'Обновить данные' : 'Сохранить запись'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionForm;
