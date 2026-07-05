"use client";

import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PurchasedProductsProps {
  purchacedProd: {
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
  };
}

function PurchasedProductsChart({
  purchacedProd,
}: PurchasedProductsProps) {
  const[ t] = useTranslation("dashboard");
  const data = [
    { month: t("purchasedProducts.months.jan"), purchased: purchacedProd.jan },
    { month: t("purchasedProducts.months.feb"), purchased: purchacedProd.feb },
    { month: t("purchasedProducts.months.mar"), purchased: purchacedProd.mar },
    { month: t("purchasedProducts.months.apr"), purchased: purchacedProd.apr },
    { month: t("purchasedProducts.months.may"), purchased: purchacedProd.may },
    { month: t("purchasedProducts.months.jun"), purchased: purchacedProd.jun },
    { month: t("purchasedProducts.months.jul"), purchased: purchacedProd.jul },
    { month: t("purchasedProducts.months.aug"), purchased: purchacedProd.aug },
    { month: t("purchasedProducts.months.sep"), purchased: purchacedProd.sep },
    { month: t("purchasedProducts.months.oct"), purchased: purchacedProd.oct },
    { month: t("purchasedProducts.months.nov"), purchased: purchacedProd.nov },
    { month: t("purchasedProducts.months.dec"), purchased: purchacedProd.dec },
  ];

  const totalPurchased = data.reduce(
    (sum, item) => sum + item.purchased,
    0
  );

  const bestMonth = data.reduce((max, item) =>
    item.purchased > max.purchased ? item : max
  );

  const averagePerMonth = Math.round(
    totalPurchased / 12
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {t("purchasedProducts.title")}
          </h2>

          <p className="text-sm text-gray-500">
            {t("purchasedProducts.description")}
          </p>
        </div>

        <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm">
         <option>{t("purchasedProducts.thisYear")}</option>
  <option>{t("purchasedProducts.lastYear")}</option>
        </select>
      </div>

      {/* CHART */}
      <div className="h-[350px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Bar
              dataKey="purchased"
              radius={[10, 10, 0, 0]}
              fill="#6C4DFF"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-[#F4F3FF] rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-500">
          {t("purchasedProducts.totalPurchased")}
          </p>

          <p className="font-bold text-xl text-[#6C4DFF]">
            {totalPurchased}
          </p>
        </div>

        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-500">
            {t("purchasedProducts.bestMonth")}
          </p>

          <p className="font-bold text-xl text-green-600">
            {bestMonth.month}
          </p>
        </div>

        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-500">
{t("purchasedProducts.averagePerMonth")}
          </p>

          <p className="font-bold text-xl text-blue-600">
            {averagePerMonth}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PurchasedProductsChart;