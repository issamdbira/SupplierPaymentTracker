import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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

/**
 * Generate a PDF for the payment plan
 */
export const generatePaymentPlanPDF = (
  invoice: Invoice,
  supplier: Supplier,
  installments: Installment[]
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add some styling
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Plan de paiement", pageWidth / 2, 20, { align: "center" });
  
  // Add invoice details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Facture: ${invoice.number}`, 14, 40);
  doc.text(`Fournisseur: ${supplier.name}`, 14, 48);
  
  if (supplier.contactPerson) {
    doc.text(`Contact: ${supplier.contactPerson}`, 14, 56);
  }
  
  doc.text(`Montant total: ${formatCurrency(invoice.amount)}`, 14, 64);
  doc.text(`Date d'émission: ${formatDate(invoice.issueDate)}`, 14, 72);
  doc.text(`Date d'échéance: ${formatDate(invoice.dueDate)}`, 14, 80);
  
  // Add payment plan details
  doc.setFont("helvetica", "bold");
  doc.text("Détails du plan de paiement", 14, 96);
  
  // Create table
  const tableColumn = ["N°", "Date d'échéance", "Montant", "Pourcentage", "Mode de paiement"];
  const tableRows: any[] = [];
  
  // Add rows
  installments.forEach((installment) => {
    const paymentMethodMap: Record<string, string> = {
      check: "Chèque",
      transfer: "Virement",
      draft: "Traite"
    };
    
    const tableRow = [
      installment.installmentNumber,
      formatDate(installment.dueDate),
      formatCurrency(installment.amount),
      `${installment.percentage.toFixed(2)}%`,
      paymentMethodMap[installment.paymentMethod] || installment.paymentMethod
    ];
    tableRows.push(tableRow);
  });
  
  // Add total row
  const totalAmount = installments.reduce((sum, inst) => sum + inst.amount, 0);
  const totalPercentage = installments.reduce((sum, inst) => sum + inst.percentage, 0);
  tableRows.push([
    "Total",
    "",
    formatCurrency(totalAmount),
    `${totalPercentage.toFixed(2)}%`,
    ""
  ]);
  
  // @ts-ignore
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 100,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [255, 152, 0], textColor: [255, 255, 255] },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 40 },
      2: { cellWidth: 40 },
      3: { cellWidth: 30 },
      4: { cellWidth: 40 }
    },
    foot: [["", "", "", "", ""]]
  });
  
  // Add signature section
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.text("Signatures", 14, finalY);
  
  doc.text("Pour le fournisseur:", 30, finalY + 20);
  doc.line(30, finalY + 40, 100, finalY + 40);
  
  doc.text("Pour l'entreprise:", pageWidth - 100, finalY + 20);
  doc.line(pageWidth - 100, finalY + 40, pageWidth - 30, finalY + 40);
  
  // Add footer
  doc.setFontSize(10);
  doc.text(`Document généré le ${formatDate(new Date().toISOString())}`, 14, doc.internal.pageSize.getHeight() - 10);
  
  // Save the PDF
  doc.save(`Plan_paiement_${invoice.number}.pdf`);
};

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "dd/MM/yyyy", { locale: fr });
};
