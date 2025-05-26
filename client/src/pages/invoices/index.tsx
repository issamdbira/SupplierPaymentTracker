import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, Plus, FileText, Building, ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Invoice {
  id: number;
  number: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: string;
  supplierId: number;
  description?: string;
}

interface Receivable {
  id: number;
  number: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: string;
  customerId: number;
  description?: string;
}

interface Supplier {
  id: number;
  name: string;
}

interface Customer {
  id: number;
  name: string;
}

const InvoicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data: invoices = [], isLoading: isLoadingInvoices } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices"],
  });

  const { data: receivables = [], isLoading: isLoadingReceivables } = useQuery<Receivable[]>({
    queryKey: ["/api/receivables"],
  });

  const { data: suppliers = [], isLoading: isLoadingSuppliers } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const isLoading = isLoadingInvoices || isLoadingReceivables || isLoadingSuppliers || isLoadingCustomers;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Payé
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            En attente
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            En retard
          </Badge>
        );
      case "partial":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Partiel
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const getSupplierName = (supplierId: number) => {
    const supplier = Array.isArray(suppliers) ? suppliers.find((s: Supplier) => s.id === supplierId) : null;
    return supplier?.name || "Inconnu";
  };

  const getCustomerName = (customerId: number) => {
    const customer = Array.isArray(customers) ? customers.find((c: Customer) => c.id === customerId) : null;
    return customer?.name || "Inconnu";
  };

  const filteredInvoices = () => {
    if (!Array.isArray(invoices)) return [];
    
    return invoices.filter((invoice: Invoice) => {
      // Status filter
      if (statusFilter && invoice.status !== statusFilter) {
        return false;
      }

      // Search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const supplierName = getSupplierName(invoice.supplierId).toLowerCase();
        
        return (
          invoice.number.toLowerCase().includes(searchLower) ||
          supplierName.includes(searchLower) ||
          (invoice.description && invoice.description.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  };

  const filteredReceivables = () => {
    if (!Array.isArray(receivables)) return [];
    
    return receivables.filter((receivable: Receivable) => {
      // Status filter
      if (statusFilter && receivable.status !== statusFilter) {
        return false;
      }

      // Search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const customerName = getCustomerName(receivable.customerId).toLowerCase();
        
        return (
          receivable.number.toLowerCase().includes(searchLower) ||
          customerName.includes(searchLower) ||
          (receivable.description && receivable.description.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  };

  const getTotalInvoiceAmount = () => {
    if (!Array.isArray(invoices)) return 0;
    return invoices.reduce((sum, invoice: Invoice) => sum + invoice.amount, 0);
  };

  const getTotalReceivableAmount = () => {
    if (!Array.isArray(receivables)) return 0;
    return receivables.reduce((sum, receivable: Receivable) => sum + receivable.amount, 0);
  };

  const getPendingInvoiceAmount = () => {
    if (!Array.isArray(invoices)) return 0;
    return invoices
      .filter((invoice: Invoice) => invoice.status === "pending" || invoice.status === "partial")
      .reduce((sum, invoice: Invoice) => sum + invoice.amount, 0);
  };

  const getPendingReceivableAmount = () => {
    if (!Array.isArray(receivables)) return 0;
    return receivables
      .filter((receivable: Receivable) => receivable.status === "pending" || receivable.status === "partial")
      .reduce((sum, receivable: Receivable) => sum + receivable.amount, 0);
  };

  if (isLoading) {
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
        <title>Factures | FinancePro</title>
        <meta name="description" content="Gérez vos factures d'achat et de vente, suivez les paiements et organisez votre comptabilité." />
      </Helmet>
      
      <div className="py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-dark">Factures</h1>
        </div>

        <div className="px-4 mx-auto mt-6 max-w-7xl sm:px-6 md:px-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Achats</CardDescription>
                <CardTitle className="text-2xl text-red-600">{formatCurrency(getTotalInvoiceAmount())}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                  Montant total des factures fournisseurs
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Achats en attente</CardDescription>
                <CardTitle className="text-2xl text-yellow-600">{formatCurrency(getPendingInvoiceAmount())}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowDown className="mr-1 h-4 w-4 text-yellow-500" />
                  Montant des factures fournisseurs à payer
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Ventes</CardDescription>
                <CardTitle className="text-2xl text-green-600">{formatCurrency(getTotalReceivableAmount())}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                  Montant total des factures clients
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Ventes en attente</CardDescription>
                <CardTitle className="text-2xl text-blue-600">{formatCurrency(getPendingReceivableAmount())}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUp className="mr-1 h-4 w-4 text-blue-500" />
                  Montant des factures clients à encaisser
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="mt-6 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-medium h-4 w-4" />
              <Input
                placeholder="Rechercher par numéro, fournisseur ou client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter || ""}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="paid">Payé</option>
              <option value="partial">Partiel</option>
              <option value="overdue">En retard</option>
            </select>
          </div>

          {/* Invoices Tables */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Supplier Invoices (Left) */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>Factures d'achat</CardTitle>
                  <Button
                    className="bg-primary hover:bg-primary-dark"
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle facture
                  </Button>
                </div>
                <CardDescription>
                  Factures fournisseurs à payer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Numéro</TableHead>
                        <TableHead>Fournisseur</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices().length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <ArrowDown className="mx-auto h-12 w-12 text-gray-300" />
                            <p className="mt-2 text-gray-medium">Aucune facture trouvée</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInvoices().map((invoice: Invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-medium" />
                              {invoice.number}
                            </TableCell>
                            <TableCell className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-medium" />
                              {getSupplierName(invoice.supplierId)}
                            </TableCell>
                            <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(invoice.amount)}
                            </TableCell>
                            <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" size="sm">
                  Voir toutes les factures d'achat
                </Button>
              </CardFooter>
            </Card>

            {/* Customer Invoices (Right) */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>Factures de vente</CardTitle>
                  <Button
                    className="bg-primary hover:bg-primary-dark"
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle facture
                  </Button>
                </div>
                <CardDescription>
                  Factures clients à encaisser
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Numéro</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReceivables().length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <ArrowUp className="mx-auto h-12 w-12 text-gray-300" />
                            <p className="mt-2 text-gray-medium">Aucune facture trouvée</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredReceivables().map((receivable: Receivable) => (
                          <TableRow key={receivable.id}>
                            <TableCell className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-medium" />
                              {receivable.number}
                            </TableCell>
                            <TableCell className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-medium" />
                              {getCustomerName(receivable.customerId)}
                            </TableCell>
                            <TableCell>{formatDate(receivable.issueDate)}</TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(receivable.amount)}
                            </TableCell>
                            <TableCell>{getStatusBadge(receivable.status)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" size="sm">
                  Voir toutes les factures de vente
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicesPage;
