import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar, DollarSign, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

const StatCards: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="animate-pulse flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-md bg-gray-200"></div>
                <div className="flex-1 ml-5 w-0">
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-6 w-1/2 bg-gray-200 rounded mt-2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: "Total Factures",
      value: stats?.invoiceCount || 0,
      icon: <FileText className="w-6 h-6 text-primary-dark" />,
      bg: "bg-primary-light",
      link: "/invoices",
      linkText: "Voir toutes",
    },
    {
      title: "Paiements à venir",
      value: stats?.upcomingPayments || 0,
      icon: <Calendar className="w-6 h-6 text-secondary" />,
      bg: "bg-secondary bg-opacity-20",
      link: "/suppliers/payments",
      linkText: "Voir le calendrier",
    },
    {
      title: "Montant en attente",
      value: formatCurrency(stats?.pendingAmount || 0),
      icon: <DollarSign className="w-6 h-6 text-warning" />,
      bg: "bg-warning bg-opacity-20",
      link: "/financial-situation",
      linkText: "Voir détails",
    },
    {
      title: "Factures à échéance",
      value: stats?.dueInvoices || 0,
      icon: <AlertTriangle className="w-6 h-6 text-danger" />,
      bg: "bg-danger bg-opacity-20",
      link: "/invoices",
      linkText: "Action urgente",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-md ${card.bg}`}>
                {card.icon}
              </div>
              <div className="flex-1 ml-5 w-0">
                <dl>
                  <dt className="text-sm font-medium text-gray-medium truncate">{card.title}</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-dark">{card.value}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
          <div className="px-5 py-3 bg-gray-50">
            <div className="text-sm">
              <Link href={card.link} className="font-medium text-primary hover:text-primary-dark">
                {card.linkText}
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatCards;
