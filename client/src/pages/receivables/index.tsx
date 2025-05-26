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
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, FileText, Building, ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface ReceivableInstallment {
  id: number;
  receivableId: number;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  status: string;
  paymentDate?: string;
  reference?: string;
}

interface Customer {
  id: number;
  name: string;
}

const ReceivablesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const { data: receivableInstallments = [], isLoading: isLoadingInstallments } = useQuery<ReceivableInstallment[]>({
    queryKey: ["/api/receivable-installments"],
  });

  const { data: receivables = [], isLoading: isLoadingReceivables } = useQuery<Receivable[]>({
    queryKey: ["/api/receivables"],
  });

  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const isLoading = isLoadingInstallments || isLoadingReceivables || isLoadingCustomers;

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

  const filteredInstallments = () => {
    if (!Array.isArray(receivableInstallments)) return [];
    
    return receivableInstallments.filter((installment: ReceivableInstallment) => {
      // Status filter
      if (statusFilter && installment.status !== statusFilter) {
        return false;
      }

      // Date filter
      if (dateFilter) {
        const today = new Date();
        const dueDate = new Date(installment.dueDate);
        
        if (dateFilter === "overdue" && dueDate >= today) {
          return false;
        } else if (dateFilter === "thisMonth") {
          const isThisMonth = 
            dueDate.getMonth() === today.getMonth() && 
            dueDate.getFullYear() === today.getFullYear();
          if (!isThisMonth) return false;
        } else if (dateFilter === "nextMonth") {
          const nextMonth = new Date(today);
          nextMonth.setMonth(today.getMonth() + 1);
          const isNextMonth = 
            dueDate.getMonth() === nextMonth.getMonth() && 
            dueDate.getFullYear() === nextMonth.getFullYear();
          if (!isNextMonth) return false;
        }
      }

      // Search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const receivableId = installment.receivableId;
        const receivable = Array.isArray(receivables) ? receivables.find((rec: Receivable) => rec.id === receivableId) : null;
        const customerId = receivable?.customerId;
        const customer = Array.isArray(customers) ? customers.find((c: Customer) => c.id === customerId) : null;
        
        // Search in receivable number or customer name
        return (
          receivable?.number.toLowerCase().includes(searchLower) ||
          customer?.name.toLowerCase().includes(searchLower) ||
          installment.reference?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  };

  const getReceivableNumber = (receivableId: number) => {
    const receivable = Array.isArray(receivables) ? receivables.find((rec: Receivable) => rec.id === receivableId) : null;
    return receivable?.number || `#${receivableId}`;
  };

  const getCustomerName = (receivableId: number) => {
    const receivable = Array.isArray(receivables) ? receivables.find((rec: Receivable) => rec.id === receivableId) : null;
    if (!receivable) return "Inconnu";
    
    const customer = Array.isArray(customers) ? customers.find((c: Customer) => c.id === receivable.customerId) : null;
    return customer?.name || "Inconnu";
  };

  const getTotalAmount = () => {
    if (!Array.isArray(receivableInstallments)) return 0;
    return receivableInstallments.reduce((sum, installment: ReceivableInstallment) => sum + installment.amount, 0);
  };

  const getPendingAmount = () => {
    if (!Array.isArray(receivableInstallments)) return 0;
    return receivableInstallments
      .filter((installment: ReceivableInstallment) => installment.status === "pending" || installment.status === "overdue")
      .reduce((sum, installment: ReceivableInstallment) => sum + installment.amount, 0);
  };

  const getPaidAmount = () => {
    if (!Array.isArray(receivableInstallments)) return 0;
    return receivableInstallments
      .filter((installment: ReceivableInstallment) => installment.status === "paid")
      .reduce((sum, installment: ReceivableInstallment) => sum + installment.amount, 0);
  };

  const getOverdueAmount = () => {
    if (!Array.isArray(receivableInstallments)) return 0;
    return receivableInstallments
      .filter((installment: ReceivableInstallment) => installment.status === "overdue")
      .reduce((sum, installment: ReceivableInstallment) => sum + installment.amount, 0);
  };

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-dark">Encaissements</h1>
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
        <title>Encaissements | FinancePro</title>
        <meta name="description" content="Gérez vos encaissements clients, suivez les échéances et planifiez vos entrées de trésorerie." />
      </Helmet>
      
      <div className="py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-dark">Encaissements</h1>
        </div>

        <div className="px-4 mx-auto mt-6 max-w-7xl sm:px-6 md:px-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total</CardDescription>
                <CardTitle className="text-2xl">{formatCurrency(getTotalAmount())}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Montant total des échéances
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Encaissé</CardDescription>
                <CardTitle className="text-2xl text-green-600">{formatCurrency(getPaidAmount())}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Montant total encaissé
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>En attente</CardDescription>
                <CardTitle className="text-2xl text-yellow-600">{formatCurrency(getPendingAmount())}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Montant restant à encaisser
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>En retard</CardDescription>
                <CardTitle className="text-2xl text-red-600">{formatCurrency(getOverdueAmount())}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Montant des échéances en retard
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Échéances d'encaissement</CardTitle>
              <CardDescription>
                Gérez les échéances d'encaissement pour vos clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-medium h-4 w-4" />
                  <Input
                    placeholder="Rechercher par client ou numéro de facture..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="w-full md:w-48">
                  <Select
                    value={statusFilter || ""}
                    onValueChange={(value) => setStatusFilter(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les statuts</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="paid">Payé</SelectItem>
                      <SelectItem value="overdue">En retard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-48">
                  <Select
                    value={dateFilter || ""}
                    onValueChange={(value) => setDateFilter(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les périodes</SelectItem>
                      <SelectItem value="overdue">En retard</SelectItem>
                      <SelectItem value="thisMonth">Ce mois-ci</SelectItem>
                      <SelectItem value="nextMonth">Mois prochain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Échéance</TableHead>
                      <TableHead>Facture</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Date d'échéance</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date d'encaissement</TableHead>
                      <TableHead>Référence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInstallments().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <ArrowUp className="mx-auto h-12 w-12 text-gray-300" />
                          <p className="mt-2 text-gray-medium">Aucune échéance trouvée</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInstallments().map((installment: ReceivableInstallment) => (
                        <TableRow key={installment.id}>
                          <TableCell>#{installment.installmentNumber}</TableCell>
                          <TableCell className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-medium" />
                            {getReceivableNumber(installment.receivableId)}
                          </TableCell>
                          <TableCell className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-medium" />
                            {getCustomerName(installment.receivableId)}
                          </TableCell>
                          <TableCell className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-medium" />
                            {formatDate(installment.dueDate)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(installment.amount)}
                          </TableCell>
                          <TableCell>{getStatusBadge(installment.status)}</TableCell>
                          <TableCell>
                            {installment.paymentDate ? formatDate(installment.paymentDate) : "-"}
                          </TableCell>
                          <TableCell>
                            {installment.reference || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ReceivablesPage;
