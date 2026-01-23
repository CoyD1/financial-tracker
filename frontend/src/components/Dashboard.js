import React, { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Wallet, TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react";
import api from "../services/api";

// Константы и вспомогательные функции вынесены за пределы компонента
const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
];
const parseNum = (val) => parseFloat(val) || 0;
const formatCurrency = (val) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB" }).format(
    val
  );

const getFontSizeClass = (val) => {
  const length = formatCurrency(val).length;
  if (length > 18) return "text-lg xl:text-xl";
  if (length > 14) return "text-xl xl:text-2xl";
  return "text-2xl xl:text-3xl";
};

const Dashboard = () => {
  const [userData, setUserData] = useState({
    balance: 0,
    income: 0,
    expense: 0,
    recentTransactions: [],
    chartData: [],
    incomePieData: [],
    expensePieData: [],
    pieType: "EX", // 'EX' или 'IN'
    loading: true,
    goals: [],
    showGoalModal: false,
    showCreateGoalModal: false,
    contributionAmount: "",
    newGoalTitle: "",
    newGoalTarget: "",
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsResponse, transactionsResponse, goalsResponse] =
        await Promise.all([
          api.get("stats/"),
          api.get("transactions/"),
          api.get("saving-goals/"),
        ]);

      const stats = statsResponse.data;
      const habitsAnalysis = stats.habits_analysis || null;
      const transactions =
        transactionsResponse.data.results || transactionsResponse.data;
      const goals = goalsResponse.data.results || goalsResponse.data;

      const chartData = (stats.chart_data || []).map((item) => ({
        ...item,
        income: parseNum(item.income),
        expense: parseNum(item.expense),
      }));

      const incomePieData = (stats.income_pie_data || []).map((item) => ({
        ...item,
        value: parseNum(item.value),
      }));

      const expensePieData = (stats.expense_pie_data || []).map((item) => ({
        ...item,
        value: parseNum(item.value),
      }));

      const summary = stats.summary || {
        total_income: 0,
        total_expense: 0,
        balance: 0,
      };

      setUserData((prev) => ({
        ...prev,
        balance: parseNum(summary.balance),
        income: parseNum(summary.total_income),
        expense: parseNum(summary.total_expense),
        recentTransactions: transactions.slice(0, 5),
        chartData: chartData,
        incomePieData: incomePieData,
        expensePieData: expensePieData,
        goals: goals,
        habitsAnalysis: habitsAnalysis,
        loading: false,
      }));
    } catch (error) {
      console.error("Ошибка загрузки дашборда:", error);
      setUserData((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCreateGoal = async () => {
    const target = parseNum(userData.newGoalTarget);
    if (!userData.newGoalTitle || target <= 0) return;

    try {
      await api.post("saving-goals/", {
        title: userData.newGoalTitle,
        target_amount: target,
        current_saved: 0,
        is_active: true,
      });

      setUserData((prev) => ({
        ...prev,
        showCreateGoalModal: false,
        newGoalTitle: "",
        newGoalTarget: "",
      }));
      fetchDashboardData();
    } catch (error) {
      console.error("Ошибка при создании цели:", error);
      alert("Не удалось создать цель");
    }
  };

  const handleAddContribution = async (goalId) => {
    const amount = parseNum(userData.contributionAmount);
    if (amount <= 0) return;

    try {
      const goal = userData.goals.find((g) => g.id === goalId);
      const newSaved = parseNum(goal.current_saved) + amount;

      await api.patch(`saving-goals/${goalId}/`, {
        current_saved: newSaved,
      });

      // Обновляем данные после взноса
      setUserData((prev) => ({
        ...prev,
        contributionAmount: "",
        showGoalModal: false,
      }));
      fetchDashboardData();
    } catch (error) {
      console.error("Ошибка при добавлении взноса:", error);
      alert("Не удалось добавить взнос");
    }
  };

  const activePieData =
    userData.pieType === "EX"
      ? userData.expensePieData
      : userData.incomePieData;

  if (userData.loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
      {/* Левая колонка (2/3 ширины) */}
      <div className="lg:col-span-2 space-y-8">
        {/* Карточки статистики */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 relative overflow-hidden group hover:border-blue-500/50 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">
                Баланс
              </p>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 border border-blue-500/20">
                <Wallet size={18} />
              </div>
            </div>
            <div className="relative z-10 mb-6 h-8 flex items-end">
              <h3
                className={`font-bold text-white tracking-tight transition-all duration-300 ${getFontSizeClass(
                  userData.balance
                )}`}
              >
                {formatCurrency(userData.balance)}
              </h3>
            </div>
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 group hover:border-emerald-500/50 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">
                Доходы
              </p>
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 border border-emerald-500/20">
                <TrendingUp size={18} />
              </div>
            </div>
            <div className="relative z-10 h-8 flex items-end">
              <h3
                className={`font-bold text-white tracking-tight transition-all duration-300 ${getFontSizeClass(
                  userData.income
                )}`}
              >
                {formatCurrency(userData.income)}
              </h3>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 group hover:border-red-500/50 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">
                Расходы
              </p>
              <div className="p-2 bg-red-500/10 rounded-lg text-red-500 border border-red-500/20">
                <TrendingDown size={18} />
              </div>
            </div>
            <div className="relative z-10 h-8 flex items-end">
              <h3
                className={`font-bold text-white tracking-tight transition-all duration-300 ${getFontSizeClass(
                  userData.expense
                )}`}
              >
                {formatCurrency(userData.expense)}
              </h3>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-colors"></div>
          </div>
        </div>

        {/* Линейный график статистики */}
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Статистика</h3>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></span>{" "}
                Доход
              </span>
              <span className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(147,51,234,0.5)]"></span>{" "}
                Расход
              </span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userData.chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333EA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#9333EA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#52525b"
                  tick={{ fill: "#71717a", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#52525b"
                  tick={{ fill: "#71717a", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    borderColor: "#27272a",
                    borderRadius: "0.75rem",
                    color: "#f4f4f5",
                  }}
                  itemStyle={{ color: "#f4f4f5" }}
                />
                <Area
                  name="Доход"
                  type="monotone"
                  dataKey="income"
                  stroke="#2563EB"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                />
                <Area
                  name="Расход"
                  type="monotone"
                  dataKey="expense"
                  stroke="#9333EA"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorExpense)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Таблица последних транзакций */}
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Последние операции</h3>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Все
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
                  <th className="pb-4 font-medium">Описание</th>
                  <th className="pb-4 font-medium">Категория</th>
                  <th className="pb-4 font-medium">Дата</th>
                  <th className="pb-4 font-medium text-right">Сумма</th>
                  <th className="pb-4 font-medium text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {userData.recentTransactions.map((t) => (
                  <tr
                    key={t.id}
                    className="group hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                            t.type === "IN"
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                              : "bg-red-500/10 border-red-500/20 text-red-500"
                          }`}
                        >
                          {t.type === "IN" ? (
                            <TrendingUp size={18} />
                          ) : (
                            <TrendingDown size={18} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-200 group-hover:text-white transition-colors">
                            {t.description || "Без описания"}
                          </p>
                          <p className="text-xs text-zinc-500">Завершено</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-zinc-400 text-sm">
                      {t.category_name}
                    </td>
                    <td className="py-4 text-zinc-400 text-sm">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td
                      className={`py-4 text-right font-medium ${
                        t.type === "IN" ? "text-emerald-400" : "text-zinc-100"
                      }`}
                    >
                      {t.type === "IN" ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-zinc-600 hover:text-white transition-colors">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {userData.recentTransactions.length === 0 && (
              <div className="text-center py-8 text-zinc-500">
                Операций не найдено
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Правая колонка (1/3 ширины) */}
      <div className="space-y-8">
        {/* Круговая диаграмма со вкладками */}
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <div className="flex flex-col gap-6 mb-6">
            <h3 className="text-lg font-bold text-white">Категории</h3>

            {/* Переключатель Типа (Вкладки) */}
            <div className="flex p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
              <button
                onClick={() =>
                  setUserData((prev) => ({ ...prev, pieType: "EX" }))
                }
                className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  userData.pieType === "EX"
                    ? "bg-zinc-800 text-white shadow-lg"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Расходы
              </button>
              <button
                onClick={() =>
                  setUserData((prev) => ({ ...prev, pieType: "IN" }))
                }
                className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  userData.pieType === "IN"
                    ? "bg-zinc-800 text-white shadow-lg"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Доходы
              </button>
            </div>
          </div>

          <div className="h-[250px] w-full relative">
            {activePieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart
                  data={activePieData}
                  key={`pie-${userData.pieType}-${activePieData.length}`}
                >
                  <Pie
                    data={activePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={activePieData.length > 1 ? 5 : 0}
                    dataKey="value"
                    nameKey="name"
                    stroke="none"
                  >
                    {activePieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#09090b",
                      borderColor: "#27272a",
                      borderRadius: "0.75rem",
                      color: "#f4f4f5",
                    }}
                    itemStyle={{ color: "#f4f4f5" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-2 border-2 border-dashed border-zinc-800 rounded-3xl">
                <TrendingDown size={32} className="opacity-20" />
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Данных пока нет
                </span>
              </div>
            )}

            {/* Центральный текст */}
            {activePieData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">
                  {userData.pieType === "EX" ? "Итого" : "Доход"}
                </span>
                <span className="text-white font-bold text-xl">
                  {formatCurrency(
                    userData.pieType === "EX"
                      ? userData.expense
                      : userData.income
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="mt-8 px-2 space-y-4">
            {activePieData.slice(0, 6).map((entry, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full ring-4 ring-zinc-900"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors font-medium">
                    {entry.name}
                  </span>
                </div>
                <span className="text-zinc-100 font-bold">
                  {formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Цель сбережений */}
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>

          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="text-lg font-bold text-white">Цель сбережений</h3>
            {userData.goals.length > 0 && (
              <span
                className={`px-2.5 py-1 border text-xs font-medium rounded-lg transition-colors ${
                  parseNum(userData.goals[0].current_saved) >=
                  parseNum(userData.goals[0].target_amount)
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                }`}
              >
                {parseNum(userData.goals[0].current_saved) >=
                parseNum(userData.goals[0].target_amount)
                  ? "Выполнено"
                  : "В процессе"}
              </span>
            )}
          </div>

          {userData.goals.length > 0 ? (
            <>
              {userData.goals
                .filter((g) => g.is_active)
                .slice(0, 1)
                .map((goal) => {
                  const progress = Math.min(
                    Math.round(
                      (parseNum(goal.current_saved) /
                        parseNum(goal.target_amount)) *
                        100
                    ),
                    100
                  );
                  return (
                    <div key={goal.id}>
                      <div className="mb-2 flex justify-between text-sm relative z-10">
                        <span className="text-zinc-400">
                          Цель: {goal.title}
                        </span>
                        <span className="text-white font-bold">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-3 mb-6 relative z-10 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-cyan-500 h-3 rounded-full relative transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-500 relative z-10">
                        <span>
                          {formatCurrency(goal.current_saved)} накоплено
                        </span>
                        <span>{formatCurrency(goal.target_amount)} цель</span>
                      </div>

                      {userData.showGoalModal ? (
                        <div className="mt-6 p-4 bg-zinc-950 rounded-xl border border-zinc-800 animate-in fade-in slide-in-from-top-2">
                          <input
                            type="number"
                            placeholder="Сумма взноса"
                            value={userData.contributionAmount}
                            onChange={(e) =>
                              setUserData((prev) => ({
                                ...prev,
                                contributionAmount: e.target.value,
                              }))
                            }
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white mb-3 focus:outline-none focus:border-blue-500"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddContribution(goal.id)}
                              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 rounded-lg transition-all"
                            >
                              Подтвердить
                            </button>
                            <button
                              onClick={() =>
                                setUserData((prev) => ({
                                  ...prev,
                                  showGoalModal: false,
                                }))
                              }
                              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 px-4 py-2 rounded-lg text-sm transition-all"
                            >
                              Отмена
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setUserData((prev) => ({
                              ...prev,
                              showGoalModal: true,
                            }))
                          }
                          className="w-full mt-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm font-medium transition-all border border-zinc-700"
                        >
                          + Добавить взнос
                        </button>
                      )}
                    </div>
                  );
                })}
            </>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-600">
                  <Wallet size={24} />
                </div>
              </div>
              <p className="text-zinc-500 text-sm">
                У вас пока нет активных целей
              </p>

              {userData.showCreateGoalModal ? (
                <div className="mt-4 p-4 bg-zinc-950 rounded-xl border border-zinc-800 animate-in fade-in slide-in-from-top-2 text-left">
                  <input
                    type="text"
                    placeholder="Название цели (напр. Машина)"
                    value={userData.newGoalTitle}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        newGoalTitle: e.target.value,
                      }))
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white mb-2 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Целевая сумма"
                    value={userData.newGoalTarget}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        newGoalTarget: e.target.value,
                      }))
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white mb-3 focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateGoal}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 rounded-lg transition-all"
                    >
                      Создать
                    </button>
                    <button
                      onClick={() =>
                        setUserData((prev) => ({
                          ...prev,
                          showCreateGoalModal: false,
                        }))
                      }
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 px-4 py-2 rounded-lg text-sm transition-all"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() =>
                    setUserData((prev) => ({
                      ...prev,
                      showCreateGoalModal: true,
                    }))
                  }
                  className="text-blue-500 text-sm font-bold hover:underline"
                >
                  Создать новую цель
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
