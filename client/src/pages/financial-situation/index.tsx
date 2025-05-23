import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const FinancialSituation: React.FC = () => {
  const { data: forecast, isLoading: isLoadingForecast } = useQuery({
    queryKey: ["/api/dashboard/forecast"],
  });

  const { data: supplierDistribution, isLoading: isLoadingDistribution } = useQuery({
    queryKey: ["/api/dashboard/supplier-distribution"],
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  // Mock data for cash flow chart - in a real app, this would come from the API
  const cashFlowData = [
    { name: "Jan", entrees: 80000, sorties: 65000 },
    { name: "Fév", entrees: 75000, sorties: 68000 },
    { name: "Mar", entrees: 90000, sorties: 72000 },
    { name: "Avr", entrees: 86000, sorties: 80000 },
    { name: "Mai", entrees: 92000, sorties: 78000 },
    { name: "Jun", entrees: 88000, sorties: 82000 },
  ];

  return (
    <>
      <Helmet>
        <title>Situation Financière | Gesto</title>
        <meta name="description" content="Analysez votre situation financière complète, incluant les flux de trésorerie et les prévisions de décaissement." />
      </Helmet>
      
      <div className="py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-dark">Situation Financière</h1>
        </div>

        <div className="px-4 mx-auto mt-6 max-w-7xl sm:px-6 md:px-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Montant en attente</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(stats?.pendingAmount || 0)}
                  </div>
                )}
                <p className="text-sm text-gray-medium mt-1">Total des factures à payer</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Paiements prévus ce mois</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingForecast ? (
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <div className="text-3xl font-bold text-secondary">
                    {formatCurrency(forecast?.[0]?.amount || 0)}
                  </div>
                )}
                <p className="text-sm text-gray-medium mt-1">Total des échéances du mois</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Factures à échéance</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <div className="text-3xl font-bold text-destructive">
                    {stats?.dueInvoices || 0}
                  </div>
                )}
                <p className="text-sm text-gray-medium mt-1">Nécessitant une action urgente</p>
              </CardContent>
            </Card>
          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-1 gap-5 mt-8 lg:grid-cols-2">
            {/* Decaissements Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Prévision des Décaissements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {isLoadingForecast ? (
                    <div className="w-full h-full bg-gray-100 rounded animate-pulse"></div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={forecast}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={formatCurrency} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Bar
                          dataKey="amount"
                          name="Montant"
                          fill="hsl(var(--chart-2))"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Flux de Trésorerie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={cashFlowData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="entrees"
                        name="Entrées"
                        stroke="hsl(var(--chart-3))"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sorties"
                        name="Sorties"
                        stroke="hsl(var(--chart-4))"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Supplier Distribution Pie Chart */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Répartition des Décaissements par Fournisseur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {isLoadingDistribution ? (
                  <div className="w-full h-full bg-gray-100 rounded animate-pulse"></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={supplierDistribution}
                        nameKey="name"
                        dataKey="amount"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {supplierDistribution?.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default FinancialSituation;
