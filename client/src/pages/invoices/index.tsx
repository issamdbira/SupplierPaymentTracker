import React, { useState } from "react";
import { Helmet } from "react-helmet";
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
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, Filter } from "lucide-react";
import PaymentPlannerModal from "@/components/invoices/PaymentPlannerModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const Invoices: React.FC = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ["/api/invoices"],
  });

  const { data: suppliers, isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ["/api/suppliers"],
  });

  const filteredInvoices = React.useMemo(() => {
    if (!invoices) return [];

    return invoices.filter((invoice: Invoice) => {
      // Status filter
      if (filterStatus !== "all" && invoice.status !== filterStatus) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== "") {
        const supplierId = invoice.supplierId;
        const supplier = suppliers?.find((s: Supplier) => s.id === supplierId);
        const supplierName = supplier ? supplier.name.toLowerCase() : "";

        const searchTerms = [
          invoice.number.toLowerCase(),
          supplierName,
          invoice.description ? invoice.description.toLowerCase() : "",
        ];

        const query = searchQuery.toLowerCase();
        if (!searchTerms.some(term => term.includes(query))) {
          return false;
        }
      }

      return true;
    });
  }, [invoices, filterStatus, searchQuery, suppliers]);

  const getSupplierName = (supplierId: number) => {
    const supplier = suppliers?.find((s: Supplier) => s.id === supplierId);
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
      case "cancelled":
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium leading-5 text-gray-800 bg-gray-100 rounded-full">
            Annulé
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

  if (isLoadingInvoices || isLoadingSuppliers) {
    return (
      <div className="py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-dark">Factures</h1>
          <div className="mt-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-96 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Factures | Gesto</title>
        <meta name="description" content="Gérez vos factures fournisseurs, planifiez vos paiements et suivez les échéances." />
      </Helmet>
      
      <div className="py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-dark">Factures</h1>
        </div>

        <div className="px-4 mx-auto mt-6 max-w-7xl sm:px-6 md:px-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Liste des factures</CardTitle>
                <Button asChild className="bg-primary hover:bg-primary-dark">
                  <Link href="/invoices/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle facture
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-medium h-4 w-4" />
                  <Input
                    placeholder="Rechercher une facture..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="w-full md:w-60">
                  <Select
                    value={filterStatus}
                    onValueChange={setFilterStatus}
                  >
                    <SelectTrigger className="w-full">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="pending">À traiter</SelectItem>
                      <SelectItem value="partial">En cours</SelectItem>
                      <SelectItem value="paid">Payé</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Invoices Table */}
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
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <FileText className="mx-auto h-12 w-12 text-gray-300" />
                          <p className="mt-2 text-gray-medium">Aucune facture trouvée</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice: Invoice) => (
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-3 border-t border-gray-light mt-4">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-medium">
                      Affichage de <span className="font-medium">1</span> à{" "}
                      <span className="font-medium">{filteredInvoices.length}</span> sur{" "}
                      <span className="font-medium">{filteredInvoices.length}</span> résultats
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
    </>
  );
}

export default InvoicesPage;