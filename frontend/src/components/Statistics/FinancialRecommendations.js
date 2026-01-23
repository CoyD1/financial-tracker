import React from "react";

const FinancialRecommendations = ({ expensePieData }) => {
  if (!expensePieData || expensePieData.length === 0) {
    return null;
  }

  const total = expensePieData.reduce((sum, item) => sum + item.value, 0);
  const topCategory = expensePieData[0];
  const percent = Math.round((topCategory.value / total) * 100);

  const recommendations = [];

  if (percent > 50) {
    recommendations.push(
      `Расходы на категорию «${topCategory.name}» составляют более половины всех трат.`,
      "Попробуйте установить месячный лимит на эту категорию.",
      "Рассмотрите альтернативы, которые помогут сократить расходы."
    );
  } else if (percent > 30) {
    recommendations.push(
      `Категория «${topCategory.name}» заметно выделяется среди расходов.`,
      "Имеет смысл проанализировать отдельные операции в этой категории.",
      "Даже небольшое сокращение может дать ощутимый эффект."
    );
  } else {
    recommendations.push(
      "Ваши расходы распределены достаточно равномерно.",
      "Продолжайте придерживаться текущей финансовой модели.",
      "Вы можете сосредоточиться на накоплениях или инвестициях."
    );
  }

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
      <h3 className="text-lg font-bold text-white">Рекомендации</h3>

      <ul className="space-y-2 text-sm text-zinc-400 list-disc list-inside">
        {recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  );
};

export default FinancialRecommendations;
