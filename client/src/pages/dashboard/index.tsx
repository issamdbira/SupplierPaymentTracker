import React from "react";
import { Helmet } from "react-helmet";
import StatCards from "@/components/dashboard/StatCards";
import PaymentsByMonthChart from "@/components/dashboard/PaymentsByMonthChart";
import SupplierDistributionChart from "@/components/dashboard/SupplierDistributionChart";
import PendingInvoicesTable from "@/components/dashboard/PendingInvoicesTable";
import RecentActivities from "@/components/dashboard/RecentActivities";

const Dashboard: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Tableau de Bord | Gesto</title>
        <meta name="description" content="Tableau de bord financier - gérez vos décaissements fournisseurs, factures et paiements à venir." />
      </Helmet>
      
      <div className="py-6">
        {/* Page Header */}
        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-dark">Tableau de Bord</h1>
        </div>

        <div className="px-4 mx-auto mt-6 max-w-7xl sm:px-6 md:px-8">
          {/* Stats Cards */}
          <StatCards />

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-5 mt-8 lg:grid-cols-2">
            <PaymentsByMonthChart />
            <SupplierDistributionChart />
          </div>

          {/* Pending Invoices Table */}
          <PendingInvoicesTable />

          {/* Recent Activities */}
          <RecentActivities />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
