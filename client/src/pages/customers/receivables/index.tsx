import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Receivable {
  id: number;
  number: string;
  customerId: number;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: string;
  description: string | null;
  category: string | null;
}

interface Customer {
  id: number;
  name: string;
}

export default function ReceivablesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch receivables
  const { data: receivables = [], isLoading: isLoadingReceivables } = useQuery({
    queryKey: ["receivables"],
    queryFn: async () => {
      const response = await fetch("/api/receivables");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des factures clients");
      }
      return response.json();
    },
  });

  // Fetch customers for mapping IDs to names
  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await fetch("/api/customers");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des clients");
      }
      return response.json();
    },
  });

  // Create a map of customer IDs to names
  const customerMap = customers.reduce((acc: Record<number, string>, customer: Customer) => {
    acc[customer.id] = customer.name;
    return acc;
  }, {});

  // Filter receivables based on search term
  const filteredReceivables = receivables.filter((receivable: Receivable) => {
    const customerName = customerMap[receivable.customerId] || "";
    return (
      receivable.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (receivable.description && receivable.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Get status display text
  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Payée";
      case "partial":
        return "Partielle";
      case "pending":
        return "En attente";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  // Get status style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Factures clients</h1>

      <Card>
        <CardHeader>
          <CardTitle>Liste des factures clients</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une facture..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingReceivables ? (
            <div className="flex justify-center py-8">Chargement...</div>
          ) : filteredReceivables.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "Aucune facture ne correspond à votre recherche." : "Aucune facture trouvée."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date d'émission</TableHead>
                  <TableHead>Date d'échéance</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceivables.map((receivable: Receivable) => (
                  <TableRow key={receivable.id}>
                    <TableCell className="font-medium">{receivable.number}</TableCell>
                    <TableCell>{customerMap[receivable.customerId] || `Client #${receivable.customerId}`}</TableCell>
                    <TableCell>
                      {format(new Date(receivable.issueDate), "dd MMM yyyy", {
                        locale: fr,
                      })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(receivable.dueDate), "dd MMM yyyy", {
                        locale: fr,
                      })}
                    </TableCell>
                    <TableCell>{receivable.description || "-"}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(receivable.amount)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(
                          receivable.status
                        )}`}
                      >
                        {getStatusText(receivable.status)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
