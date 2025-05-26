import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-1/2 mb-1" />
          {description && <Skeleton className="h-4 w-3/4" />}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

interface DashboardStats {
  invoiceCount: number;
  upcomingPayments: number;
  pendingAmount: number;
  dueInvoices: number;
  customerCount: number;
  receivableCount: number;
  pendingReceivableAmount: number;
}

const StatCards: React.FC = () => {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Factures"
        value={stats?.invoiceCount || 0}
        description="Nombre total de factures"
        loading={isLoading}
      />
      <StatsCard
        title="Paiements à venir"
        value={stats?.upcomingPayments || 0}
        description="Échéances en attente"
        loading={isLoading}
      />
      <StatsCard
        title="Montant en attente"
        value={formatCurrency(stats?.pendingAmount || 0)}
        description="Total des factures non payées"
        loading={isLoading}
      />
      <StatsCard
        title="Factures à échéance"
        value={stats?.dueInvoices || 0}
        description="Échéances dans les 7 jours"
        loading={isLoading}
      />
      <StatsCard
        title="Clients"
        value={stats?.customerCount || 0}
        description="Nombre total de clients"
        loading={isLoading}
      />
      <StatsCard
        title="Factures clients"
        value={stats?.receivableCount || 0}
        description="Nombre total de factures clients"
        loading={isLoading}
      />
      <StatsCard
        title="Montant à recevoir"
        value={formatCurrency(stats?.pendingReceivableAmount || 0)}
        description="Total des factures clients non payées"
        loading={isLoading}
      />
    </div>
  );
};

export default StatCards;
