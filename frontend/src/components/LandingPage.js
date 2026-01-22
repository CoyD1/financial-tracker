import React from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wallet, ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#8B5CF6'];

const MOCK_CHART_DATA = [
    { name: 'Пн', income: 15000, expense: 2400 },
    { name: 'Вт', income: 0, expense: 1800 },
    { name: 'Ср', income: 15000, expense: 3200 },
    { name: 'Чт', income: 0, expense: 2100 },
    { name: 'Пт', income: 0, expense: 4500 },
    { name: 'Сб', income: 0, expense: 6800 },
    { name: 'Вс', income: 2000, expense: 1500 },
];

const MOCK_PIE_DATA = [
    { name: 'Жилье', value: 15000 },
    { name: 'Продукты', value: 12000 },
    { name: 'Транспорт', value: 4500 },
    { name: 'Развлечения', value: 3500 },
];

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-500/30">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Wallet size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">FinanceTracker</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                            Войти
                        </Link>
                        <Link to="/register" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20">
                            Начать бесплатно
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>

                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-blue-400 mb-4 animate-fade-in">
                        <Shield size={14} />
                        Ваши финансы под полным контролем
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                        Хотите следить за расходами и доходами?
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        Зарегистрируйтесь или войдите в систему, чтобы получить доступ к этой возможности и начать управлять своим капиталом эффективно.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group">
                            Зарегистрироваться
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all">
                            Войти в систему
                        </Link>
                    </div>
                </div>
            </section>

            {/* Demo Dashboard Section */}
            <section className="py-20 px-6 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Мощная аналитика в реальном времени</h2>
                        <p className="text-zinc-500">Посмотрите, как будет выглядеть ваш персональный дашборд</p>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-sm relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                            {/* Left Side: Chart */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex gap-4">
                                        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Баланс</p>
                                            <h3 className="text-2xl font-bold text-blue-500">128,450 ₽</h3>
                                        </div>
                                        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Доходы за неделю</p>
                                            <h3 className="text-2xl font-bold text-emerald-500">32,000 ₽</h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={MOCK_CHART_DATA}>
                                            <defs>
                                                <linearGradient id="landingIncome" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="landingExpense" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="name" stroke="#52525b" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '1rem' }}
                                                itemStyle={{ color: '#f4f4f5' }}
                                            />
                                            <Area type="monotone" dataKey="income" stroke="#3B82F6" strokeWidth={4} fill="url(#landingIncome)" name="Доход" />
                                            <Area type="monotone" dataKey="expense" stroke="#EC4899" strokeWidth={4} fill="url(#landingExpense)" name="Расход" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Right Side: Categories */}
                            <div className="bg-zinc-950/50 border border-zinc-800/50 p-6 rounded-3xl space-y-6">
                                <h4 className="font-bold text-center">Траты за месяц</h4>
                                <div className="h-[200px] relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={MOCK_PIE_DATA}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {MOCK_PIE_DATA.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase">Итого</span>
                                        <span className="font-bold">35,000 ₽</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {MOCK_PIE_DATA.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                                <span className="text-zinc-400">{item.name}</span>
                                            </div>
                                            <span className="font-medium">{item.value.toLocaleString()} ₽</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-blue-500/50 transition-colors group">
                        <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Мгновенный ввод данных</h3>
                        <p className="text-zinc-400">Добавляйте транзакции за секунды с любого устройства. Ваши данные всегда синхронизированы.</p>
                    </div>

                    <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-emerald-500/50 transition-colors group">
                        <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                            <BarChart3 size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Умная статистика</h3>
                        <p className="text-zinc-400">Наглядные графики и диаграммы помогут понять, куда уходят ваши деньги и как накопить больше.</p>
                    </div>

                    <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-purple-500/50 transition-colors group">
                        <div className="w-12 h-12 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Безопасность данных</h3>
                        <p className="text-zinc-400">Мы используем современные протоколы шифрования, чтобы ваши финансовые данные были под защитой.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-zinc-800 text-center">
                <p className="text-zinc-500 text-sm">© 2026 FinanceTracker. Сделано с любовью к вашим финансам.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
