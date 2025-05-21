import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PaymentPlannerModal from "../invoices/PaymentPlannerModal";

interface Invoice {
  id: number;
  number: string;
  supplierId: number;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: string;
  description?: string;
}

interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
}

const PendingInvoicesTable: React.FC = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ["/api/invoices/pending"],
  });

  const { data: suppliers, isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ["/api/suppliers"],
  });

  if (isLoadingInvoices || isLoadingSuppliers) {
    return (
      <div className="mt-8 overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-light">
          <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Facture</TableHead>
                <TableHead>Fournisseur</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date d'émission</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {[...Array(7)].map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  const getSupplierName = (supplierId: number) => {
    const supplier = suppliers.find((s: Supplier) => s.id === supplierId);
    return supplier ? supplier.name : "Inconnu";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium leading-5 text-yellow-800 bg-yellow-100 rounded-full">
            À traiter
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium leading-5 text-green-800 bg-green-100 rounded-full">
            En cours
          </span>
        );
      case "paid":
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium leading-5 text-blue-800 bg-blue-100 rounded-full">
            Payé
          </span>
        );
      default:
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium leading-5 text-red-800 bg-red-100 rounded-full">
            Urgent
          </span>
        );
    }
  };

  const handleOpenModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  return (
    <div className="mt-8 overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-light">
        <h3 className="text-lg font-medium leading-6 text-gray-dark">
          Factures en attente de paiement
        </h3>
        <div className="flex">
          <Button asChild className="bg-primary hover:bg-primary-dark">
            <Link href="/invoices/new">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle facture
            </Link>
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                N° Facture
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                Fournisseur
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                Montant
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                Date d'émission
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                Échéance
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                Statut
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice: Invoice) => (
              <TableRow
                key={invoice.id}
                className="hover:bg-gray-50"
              >
                <TableCell className="px-6 py-4 text-sm text-gray-dark whitespace-nowrap">
                  {invoice.number}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-dark whitespace-nowrap">
                  {getSupplierName(invoice.supplierId)}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-dark whitespace-nowrap">
                  {formatCurrency(invoice.amount)}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-dark whitespace-nowrap">
                  {formatDate(invoice.issueDate)}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-dark whitespace-nowrap">
                  {formatDate(invoice.dueDate)}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(invoice.status)}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-right whitespace-nowrap">
                  <button
                    onClick={() => handleOpenModal(invoice)}
                    className="text-primary hover:text-primary-dark"
                  >
                    {invoice.status === "pending" ? "Planifier" : "Voir détails"}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-light">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-medium">
              Affichage de <span className="font-medium">1</span> à{" "}
              <span className="font-medium">{invoices.length}</span> sur{" "}
              <span className="font-medium">{invoices.length}</span> résultats
            </p>
          </div>
          <div>
            <nav
              className="inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-medium bg-white border border-gray-light rounded-l-md hover:bg-gray-50">
                <span className="sr-only">Précédent</span>
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                aria-current="page"
                className="relative z-10 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-primary"
              >
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-medium bg-white border border-gray-light rounded-r-md hover:bg-gray-50">
                <span className="sr-only">Suivant</span>
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {selectedInvoice && (
        <PaymentPlannerModal
          invoice={selectedInvoice}
          supplier={suppliers.find((s: Supplier) => s.id === selectedInvoice.supplierId)}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PendingInvoicesTable;
