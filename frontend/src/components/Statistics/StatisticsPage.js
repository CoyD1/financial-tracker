import React, { useEffect, useState } from "react";
import api from "../../services/api";

import FinancialHabitsAnalysis from "./FinancialHabitsAnalysis";
import FinancialRecommendations from "./FinancialRecommendations";
import MaxCategorySaving from "./MaxCategorySaving";

const StatisticsPage = () => {
  const [expensePieData, setExpensePieData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("stats/");
        setExpensePieData(response.data.expense_pie_data || []);
      } catch (err) {
        console.error("Ошибка загрузки статистики", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-zinc-500">Загрузка аналитики...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Аналитика</h1>

      <FinancialHabitsAnalysis expensePieData={expensePieData} />

      <FinancialRecommendations expensePieData={expensePieData} />

      <MaxCategorySaving expensePieData={expensePieData} />
    </div>
  );
};

export default StatisticsPage;
