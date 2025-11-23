import React, {useState, useEffect} from 'react';
import api from "../services/api";

//создаем компонент Dashboard
const Dashboard = () => {
    // Используем useState для хранения данных компонента
    //State хранится внутри экземпляра компонента в оперативной памяти браузера
    //
    const [userData,setUserData] = useState({
        balance: 0,
        recentTransactions: [],
        loading: true
    });

    //useEffect выполняется при загрузке компонента
    useEffect(() => {
        fetchDashboardData();
    }, []);

    //функция для получения данных с сервера
    const fetchDashboardData = async () => {
        try {
            const response = await api.get("transactions/");

          if (response.status === 200){
            const transactions = response.data.results;

            //вычисляем общий баланс
            const balance = transactions.reduce((total,transaction) =>{
                return transaction.type === "income"
                    ? total + parseFloat(transaction.amount)
                    : total - parseFloat(transaction.amount);
            },0);

            //берем последние 5 транзакций
            const recentTransactions = transactions.slice(0,5);

            //обновляем состояние компонента
            setUserData({
                balance:balance,
                recentTransactions:recentTransactions,
                loading: false
            });
        }

        } catch (error){
            console.error('Ошибка при загрузке данных', error);
            setUserData(prev => ({...prev,loading: false}));
        }
    };

    //функция для форматирования суммы
    const formatAmount = (amount,type) => {
        const formatted = new Intl.NumberFormat('ru-RU',{
            style: 'currency',
            currency: 'RUB'
        }).format(amount);

        return type === 'income'
            ? `+${formatted}`
            : `-${formatted}`;
    };

    //если данные еще не загружаются,показываем индикатор
    if (userData.loading){
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Загрузка данных...</div>
            </div>
        );
    }

    //основной компонент Dashboard
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Заголовок сраницы */}
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                Финансовый обзор
            </h1>

            {/* Карточка с балансом */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Текущий баланс
                </h2>
                <div className={`text-4xl font-bold ${
                    userData.balance >= 0 ? 'text-green-600' : 'text-red-400'
                }`}>
                    {formatAmount(Math.abs(userData.balance), userData.balance >= 0 ? 'income' : 'expense')}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Последние операции
              </h2>
              {userData.recentTransactions.length === 0 ? (
                <p className="text-gray-500">Нет операций</p>
              ) : (
                <div className="space-y-3">
                  {userData.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{transaction.category_name || 'Без категории'}</p>
                        <p className="text-sm text-gray-500">{transaction.description}</p>
                      </div>
                      <span className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatAmount(transaction.amount, transaction.type)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>
    )

};

export default Dashboard;