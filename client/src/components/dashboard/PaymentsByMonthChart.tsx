import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const PaymentsByMonthChart: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/dashboard/forecast"],
  });

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="animate-pulse">
            <div className="h-6 w-2/3 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mt-2"></div>
            <div className="h-[250px] bg-gray-100 rounded mt-4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <h3 className="text-lg font-medium leading-6 text-gray-dark">
          Décaissements par mois
        </h3>
        <div className="mt-2">
          <p className="text-sm text-gray-medium">
            Prévision des paiements pour les 6 prochains mois
          </p>
        </div>
        <div className="chart-container mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), "Montant"]}
                labelFormatter={(label) => `Mois: ${label}`}
                contentStyle={{ fontSize: 12 }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="amount"
                name="Décaissements"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentsByMonthChart;
