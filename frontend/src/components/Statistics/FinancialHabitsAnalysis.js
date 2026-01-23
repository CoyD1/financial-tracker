import React from "react";

const FinancialHabitsAnalysis = ({ expensePieData }) => {
  if (!expensePieData || expensePieData.length === 0) {
    return (
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 text-zinc-500">
        Недостаточно данных для анализа финансовых привычек
      </div>
    );
  }

  const total = expensePieData.reduce((sum, item) => sum + item.value, 0);
  const topCategory = expensePieData[0];
  const percent = Math.round((topCategory.value / total) * 100);

  let verdict = {
    text: "Финансовые привычки выглядят сбалансированными",
    color: "text-emerald-400",
  };

  if (percent > 50) {
    verdict = {
      text: "Слишком большая доля расходов в одной категории",
      color: "text-red-400",
    };
  } else if (percent > 30) {
    verdict = {
      text: "Есть категория, которая требует внимания",
      color: "text-yellow-400",
    };
  }

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
      <h3 className="text-lg font-bold text-white">
        Анализ финансовых привычек
      </h3>

      <div className="text-sm text-zinc-400">Основная категория расходов:</div>

      <div className="flex justify-between items-center">
        <span className="text-white font-medium">{topCategory.name}</span>
        <span className="text-zinc-300">{percent}%</span>
      </div>

      <div className={`text-sm font-semibold ${verdict.color}`}>
        {verdict.text}
      </div>
    </div>
  );
};

export default FinancialHabitsAnalysis;
