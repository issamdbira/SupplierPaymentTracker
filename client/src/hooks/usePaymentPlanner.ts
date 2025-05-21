import { useState, useEffect } from "react";
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

interface UsePaymentPlannerProps {
  invoice: Invoice;
  supplier?: Supplier;
  defaultInstallmentCount?: number;
  onClose?: () => void;
}

export const usePaymentPlanner = ({
  invoice,
  supplier,
  defaultInstallmentCount = 4,
  onClose,
}: UsePaymentPlannerProps) => {
  const [installmentCount, setInstallmentCount] = useState(defaultInstallmentCount);
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [total, setTotal] = useState({
    amount: 0,
    percentage: 0,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveInstallmentsMutation = useMutation({
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
      
      if (onClose) onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement du plan de paiement.",
        variant: "destructive",
      });
    },
  });

  // Generate installments based on count
  useEffect(() => {
    if (invoice) {
      generateInstallments();
    }
  }, [invoice, installmentCount]);

  // Generate installments
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

  // Handle date change
  const handleDateChange = (index: number, value: string) => {
    const updated = [...installments];
    updated[index].dueDate = new Date(value).toISOString();
    setInstallments(updated);
  };

  // Handle amount change
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

  // Handle percentage change
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

  // Handle payment method change
  const handlePaymentMethodChange = (index: number, value: string) => {
    const updated = [...installments];
    updated[index].paymentMethod = value;
    setInstallments(updated);
  };

  // Save payment plan
  const savePaymentPlan = () => {
    saveInstallmentsMutation.mutate(installments);
  };

  // Export to PDF
  const exportToPDF = () => {
    if (!supplier) return;
    
    generatePaymentPlanPDF(invoice, supplier, installments);
  };

  // Format date for input
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return {
    installmentCount,
    setInstallmentCount,
    installments,
    total,
    handleDateChange,
    handleAmountChange,
    handlePercentageChange,
    handlePaymentMethodChange,
    savePaymentPlan,
    exportToPDF,
    formatDateForInput,
    isSubmitting: saveInstallmentsMutation.isPending,
  };
};
