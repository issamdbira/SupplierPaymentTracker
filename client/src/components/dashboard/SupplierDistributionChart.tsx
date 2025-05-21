import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const SupplierDistributionChart: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/dashboard/supplier-distribution"],
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

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

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
          Répartition par fournisseur
        </h3>
        <div className="mt-2">
          <p className="text-sm text-gray-medium">
            Top 5 des fournisseurs en montant total
          </p>
        </div>
        <div className="chart-container mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                nameKey="name"
                dataKey="amount"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={(entry) => entry.name}
                labelLine={{ stroke: "hsl(var(--foreground))", strokeWidth: 1 }}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ fontSize: 12 }}
              />
              <Legend formatter={(value) => <span style={{ fontSize: 12 }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierDistributionChart;
