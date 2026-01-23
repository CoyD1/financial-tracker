import React from "react";

const MaxCategorySaving = ({ expensePieData }) => {
  if (!expensePieData || expensePieData.length === 0) {
    return (
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 text-zinc-500">
        Недостаточно данных для оценки экономии
      </div>
    );
  }

  const topCategory = expensePieData[0];
  const totalExpenses = expensePieData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  const percent = Math.round((topCategory.value / totalExpenses) * 100);
  const targetPercent = 20;
  const possibleSaving = Math.round(topCategory.value * (targetPercent / 100));

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
      <h3 className="text-lg font-bold text-white">Потенциальная экономия</h3>

      <div className="text-sm text-zinc-400">Основная категория расходов:</div>

      <div className="flex justify-between items-center">
        <span className="text-white font-medium">{topCategory.name}</span>
        <span className="text-zinc-300">{percent}%</span>
      </div>

      <div className="text-sm text-zinc-400">
        Если сократить расходы на <b>{targetPercent}%</b>, можно сэкономить:
      </div>

      <div className="text-xl font-bold text-emerald-400">
        {possibleSaving.toLocaleString()} ₽
      </div>
    </div>
  );
};

export default MaxCategorySaving;
