import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Check, Calendar as CalendarIcon, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Installment {
  id: number;
  invoiceId: number;
  installmentNumber: number;
  amount: number;
  percentage: number;
  dueDate: string;
  paymentMethod: string;
  status: string;
  paymentDate?: string;
}

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

const PaymentsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: installments, isLoading: isLoadingInstallments } = useQuery({
    queryKey: ["/api/installments"],
  });

  const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ["/api/invoices"],
  });

  const { data: suppliers, isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ["/api/suppliers"],
  });

  const markAsPaidMutation = useMutation({
    mutationFn: async (installmentId: number) => {
      const response = await apiRequest(
        "PUT",
        `/api/installments/${installmentId}`,
        {
          status: "paid",
          paymentDate: new Date().toISOString(),
        }
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Paiement confirmé",
        description: "Le paiement a été marqué comme effectué avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/installments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite, veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  // Get filtered installments based on selected date
  const filteredInstallments = React.useMemo(() => {
    if (!installments || !selectedDate) return [];

    return installments.filter((installment: Installment) => {
      const installmentDate = new Date(installment.dueDate);
      return (
        installmentDate.getDate() === selectedDate.getDate() &&
        installmentDate.getMonth() === selectedDate.getMonth() &&
        installmentDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [installments, selectedDate]);

  // Get payment dates to highlight in calendar
  const paymentDates = React.useMemo(() => {
    if (!installments) return [];

    return installments.map((installment: Installment) => {
      return new Date(installment.dueDate);
    });
  }, [installments]);

  const getInvoiceNumber = (invoiceId: number) => {
    const invoice = invoices?.find((inv: Invoice) => inv.id === invoiceId);
    return invoice ? invoice.number : "Inconnu";
  };

  const getSupplierName = (invoiceId: number) => {
    const invoice = invoices?.find((inv: Invoice) => inv.id === invoiceId);
    if (!invoice) return "Inconnu";

    const supplier = suppliers?.find((s: Supplier) => s.id === invoice.supplierId);
    return supplier ? supplier.name : "Inconnu";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "check":
        return "Chèque";
      case "transfer":
        return "Virement";
      case "draft":
        return "Traite";
      default:
        return method;
    }
  };

  const handleMarkAsPaid = (installmentId: number) => {
    markAsPaidMutation.mutate(installmentId);
  };

  if (isLoadingInstallments || isLoadingInvoices || isLoadingSuppliers) {
    return (
      <div className="py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-dark">Décaissements</h1>
          <div className="mt-6 animate-pulse">
            <div className="h-96 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Décaissements | FinancePro</title>
        <meta name="description" content="Gérez vos échéances de paiement et suivez les décaissements planifiés." />
      </Helmet>
      
      <div className="py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-dark">Décaissements</h1>
        </div>

        <div className="px-4 mx-auto mt-6 max-w-7xl sm:px-6 md:px-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Calendar */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Calendrier des paiements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    locale={fr}
                    modifiers={{
                      highlighted: paymentDates,
                    }}
                    modifiersStyles={{
                      highlighted: {
                        backgroundColor: "hsl(var(--primary) / 0.15)",
                        fontWeight: "bold",
                      },
                    }}
                  />
                  <div className="mt-4 flex gap-2 items-center">
                    <Badge className="bg-primary text-white">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {paymentDates.length} échéances prévues
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payments for selected date */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    Échéances du{" "}
                    {selectedDate
                      ? format(selectedDate, "d MMMM yyyy", { locale: fr })
                      : "jour"}
                  </span>
                  <Badge variant="outline" className="ml-2">
                    {filteredInstallments.length} paiements
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredInstallments.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-gray-medium">
                      Aucun paiement prévu pour cette date
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                            Facture
                          </TableHead>
                          <TableHead className="text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                            Fournisseur
                          </TableHead>
                          <TableHead className="text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                            Montant
                          </TableHead>
                          <TableHead className="text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                            Échéance
                          </TableHead>
                          <TableHead className="text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                            Mode de paiement
                          </TableHead>
                          <TableHead className="text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                            Status
                          </TableHead>
                          <TableHead className="text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInstallments.map((installment: Installment) => (
                          <TableRow key={installment.id} className="hover:bg-gray-50">
                            <TableCell className="text-sm text-gray-dark whitespace-nowrap">
                              {getInvoiceNumber(installment.invoiceId)}
                            </TableCell>
                            <TableCell className="text-sm text-gray-dark whitespace-nowrap">
                              {getSupplierName(installment.invoiceId)}
                            </TableCell>
                            <TableCell className="text-sm text-gray-dark whitespace-nowrap">
                              {formatCurrency(installment.amount)}
                            </TableCell>
                            <TableCell className="text-sm text-gray-dark whitespace-nowrap">
                              {format(new Date(installment.dueDate), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell className="text-sm text-gray-dark whitespace-nowrap">
                              {getPaymentMethodDisplay(installment.paymentMethod)}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <Badge
                                className={
                                  installment.status === "paid"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {installment.status === "paid" ? "Payé" : "À payer"}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {installment.status === "pending" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1 text-primary hover:text-white hover:bg-primary"
                                  onClick={() => handleMarkAsPaid(installment.id)}
                                  disabled={markAsPaidMutation.isPending}
                                >
                                  <Check className="h-4 w-4" />
                                  Marquer payé
                                </Button>
                              )}
                              {installment.status === "paid" && (
                                <span className="text-xs text-gray-medium">
                                  Payé le{" "}
                                  {format(
                                    new Date(installment.paymentDate || ""),
                                    "dd/MM/yyyy"
                                  )}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* All upcoming payments */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Tous les paiements à venir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                        Facture
                      </TableHead>
                      <TableHead className="text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                        Fournisseur
                      </TableHead>
                      <TableHead className="text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                        Montant
                      </TableHead>
                      <TableHead className="text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                        Échéance
                      </TableHead>
                      <TableHead className="text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                        Mode de paiement
                      </TableHead>
                      <TableHead className="text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {installments
                      .filter((i: Installment) => i.status === "pending")
                      .sort((a: Installment, b: Installment) => {
                        const dateA = new Date(a.dueDate).getTime();
                        const dateB = new Date(b.dueDate).getTime();
                        return dateA - dateB;
                      })
                      .map((installment: Installment) => (
                        <TableRow key={installment.id} className="hover:bg-gray-50">
                          <TableCell className="text-sm text-gray-dark whitespace-nowrap">
                            {getInvoiceNumber(installment.invoiceId)}
                          </TableCell>
                          <TableCell className="text-sm text-gray-dark whitespace-nowrap">
                            {getSupplierName(installment.invoiceId)}
                          </TableCell>
                          <TableCell className="text-sm text-gray-dark whitespace-nowrap">
                            {formatCurrency(installment.amount)}
                          </TableCell>
                          <TableCell className="text-sm text-gray-dark whitespace-nowrap">
                            {format(new Date(installment.dueDate), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell className="text-sm text-gray-dark whitespace-nowrap">
                            {getPaymentMethodDisplay(installment.paymentMethod)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge className="bg-yellow-100 text-yellow-800">
                              À payer
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-primary hover:text-white hover:bg-primary"
                              onClick={() => handleMarkAsPaid(installment.id)}
                              disabled={markAsPaidMutation.isPending}
                            >
                              <Check className="h-4 w-4" />
                              Marquer payé
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
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

export default PaymentsPage;
