import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X, Check, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { generatePaymentPlanPDF } from "@/lib/pdfGenerator";

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

interface Installment {
  invoiceId: number;
  installmentNumber: number;
  amount: number;
  percentage: number;
  dueDate: string;
  paymentMethod: string;
  status: string;
  paymentDate?: string;
}

interface PaymentPlannerModalProps {
  invoice: Invoice;
  supplier: Supplier | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentPlannerModal: React.FC<PaymentPlannerModalProps> = ({
  invoice,
  supplier,
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [installmentCount, setInstallmentCount] = useState(4);
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [total, setTotal] = useState({
    amount: 0,
    percentage: 0,
  });

  const mutation = useMutation({
    mutationFn: async (installments: Installment[]) => {
      const response = await apiRequest("POST", "/api/installments", installments);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/forecast"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      
      toast({
        title: "Plan de paiement validé",
        description: "Le plan de paiement a été enregistré avec succès.",
      });
      
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement du plan de paiement.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (isOpen && invoice) {
      generateInstallments();
    }
  }, [isOpen, invoice, installmentCount]);

  // Format date string to YYYY-MM-DD for input
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Generate installments based on count
  const generateInstallments = () => {
    if (!invoice) return;

    const baseAmount = invoice.amount / installmentCount;
    const basePercentage = 100 / installmentCount;
    const dueDate = new Date(invoice.dueDate);
    const newInstallments: Installment[] = [];

    for (let i = 0; i < installmentCount; i++) {
      const installmentDate = new Date(dueDate);
      
      // First installment on the due date, others monthly after
      if (i > 0) {
        installmentDate.setMonth(dueDate.getMonth() + i);
      }

      // Adjust amounts for last installment to handle rounding errors
      let amount = baseAmount;
      let percentage = basePercentage;
      
      if (i === installmentCount - 1) {
        const currentTotal = newInstallments.reduce((sum, inst) => sum + inst.amount, 0);
        amount = Math.round((invoice.amount - currentTotal) * 100) / 100;
        
        const currentPercentage = newInstallments.reduce((sum, inst) => sum + inst.percentage, 0);
        percentage = Math.round((100 - currentPercentage) * 100) / 100;
      } else {
        // Round to 2 decimal places
        amount = Math.round(amount * 100) / 100;
        percentage = Math.round(percentage * 100) / 100;
      }

      newInstallments.push({
        invoiceId: invoice.id,
        installmentNumber: i + 1,
        amount: amount,
        percentage: percentage,
        dueDate: installmentDate.toISOString(),
        paymentMethod: i === 0 ? "transfer" : "draft",
        status: "pending",
      });
    }

    setInstallments(newInstallments);
    calculateTotal(newInstallments);
  };

  // Calculate totals
  const calculateTotal = (installments: Installment[]) => {
    const totalAmount = installments.reduce((sum, inst) => sum + inst.amount, 0);
    const totalPercentage = installments.reduce((sum, inst) => sum + inst.percentage, 0);
    
    setTotal({
      amount: Math.round(totalAmount * 100) / 100,
      percentage: Math.round(totalPercentage * 100) / 100,
    });
  };

  // Handle form changes
  const handleDateChange = (index: number, value: string) => {
    const updated = [...installments];
    updated[index].dueDate = new Date(value).toISOString();
    setInstallments(updated);
  };

  const handleAmountChange = (index: number, value: string) => {
    const amount = parseFloat(value) || 0;
    const updated = [...installments];
    updated[index].amount = amount;
    
    // Update percentage based on new amount
    updated[index].percentage = Math.round((amount / invoice.amount) * 100 * 100) / 100;
    
    // Adjust last installment if not changing the last one
    if (index < installments.length - 1) {
      const otherInstallmentsAmount = updated.reduce((sum, inst, i) => 
        i !== installments.length - 1 ? sum + inst.amount : sum, 0);
      
      const lastInstallmentAmount = Math.round((invoice.amount - otherInstallmentsAmount) * 100) / 100;
      updated[installments.length - 1].amount = lastInstallmentAmount;
      
      const otherInstallmentsPercentage = updated.reduce((sum, inst, i) => 
        i !== installments.length - 1 ? sum + inst.percentage : sum, 0);
      
      const lastInstallmentPercentage = Math.round((100 - otherInstallmentsPercentage) * 100) / 100;
      updated[installments.length - 1].percentage = lastInstallmentPercentage;
    }
    
    setInstallments(updated);
    calculateTotal(updated);
  };

  const handlePercentageChange = (index: number, value: string) => {
    const percentage = parseFloat(value) || 0;
    const updated = [...installments];
    updated[index].percentage = percentage;
    
    // Update amount based on new percentage
    updated[index].amount = Math.round((percentage / 100) * invoice.amount * 100) / 100;
    
    // Adjust last installment if not changing the last one
    if (index < installments.length - 1) {
      const otherInstallmentsPercentage = updated.reduce((sum, inst, i) => 
        i !== installments.length - 1 ? sum + inst.percentage : sum, 0);
      
      const lastInstallmentPercentage = Math.round((100 - otherInstallmentsPercentage) * 100) / 100;
      updated[installments.length - 1].percentage = lastInstallmentPercentage;
      
      const otherInstallmentsAmount = updated.reduce((sum, inst, i) => 
        i !== installments.length - 1 ? sum + inst.amount : sum, 0);
      
      const lastInstallmentAmount = Math.round((invoice.amount - otherInstallmentsAmount) * 100) / 100;
      updated[installments.length - 1].amount = lastInstallmentAmount;
    }
    
    setInstallments(updated);
    calculateTotal(updated);
  };

  const handlePaymentMethodChange = (index: number, value: string) => {
    const updated = [...installments];
    updated[index].paymentMethod = value;
    setInstallments(updated);
  };

  // Handle form submission
  const handleSubmit = () => {
    mutation.mutate(installments);
  };

  // Export to PDF
  const handleExportPDF = () => {
    if (!supplier) return;
    
    generatePaymentPlanPDF(invoice, supplier, installments);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            Planifier les paiements pour la facture {invoice.number}
          </DialogTitle>
          <DialogDescription>
            Définissez le plan de paiement en plusieurs échéances
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-medium">Fournisseur</label>
                <p className="mt-1 text-sm text-gray-dark">{supplier?.name || 'Inconnu'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-medium">Montant total</label>
                <p className="mt-1 text-sm font-bold text-gray-dark">{formatCurrency(invoice.amount)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-medium">Date d'échéance</label>
                <p className="mt-1 text-sm text-gray-dark">
                  {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-medium mb-2">
              Nombre d'échéances
            </label>
            <Select
              value={installmentCount.toString()}
              onValueChange={(value) => setInstallmentCount(parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner le nombre d'échéances" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                    N° Échéance
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                    Date
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                    Montant
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                    Pourcentage
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-medium uppercase">
                    Mode de paiement
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {installments.map((installment, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-6 py-4 text-sm text-gray-dark whitespace-nowrap">
                      {installment.installmentNumber}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Input
                        type="date"
                        value={formatDateForInput(installment.dueDate)}
                        onChange={(e) => handleDateChange(index, e.target.value)}
                        className="block w-full px-3 py-2 text-sm"
                      />
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Input
                        type="number"
                        value={installment.amount}
                        onChange={(e) => handleAmountChange(index, e.target.value)}
                        className="block w-full px-3 py-2 text-sm"
                        step="0.01"
                        min="0"
                      />
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Input
                        type="number"
                        value={installment.percentage}
                        onChange={(e) => handlePercentageChange(index, e.target.value)}
                        className="block w-full px-3 py-2 text-sm"
                        step="0.01"
                        min="0"
                        max="100"
                      />
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Select
                        value={installment.paymentMethod}
                        onValueChange={(value) => handlePaymentMethodChange(index, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="check">Chèque</SelectItem>
                          <SelectItem value="transfer">Virement</SelectItem>
                          <SelectItem value="draft">Traite</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="bg-gray-50">
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="px-6 py-4 text-sm font-medium text-gray-dark whitespace-nowrap"
                  >
                    Total
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-bold text-gray-dark whitespace-nowrap">
                    {formatCurrency(total.amount)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-bold text-gray-dark whitespace-nowrap">
                    {total.percentage.toFixed(2)}%
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>

        <DialogFooter className="flex justify-between mt-6 gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Annuler
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
              onClick={handleExportPDF}
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter en PDF
            </Button>
            <Button 
              className="bg-primary hover:bg-primary-dark"
              onClick={handleSubmit}
              disabled={mutation.isPending}
            >
              <Check className="w-4 h-4 mr-2" />
              Valider le plan
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPlannerModal;
