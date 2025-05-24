import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function CustomerDashboard() {
  // Fetch customer distribution data
  const { data: customerDistribution = [], isLoading: isLoadingDistribution } = useQuery({
    queryKey: ["dashboard", "customer-distribution"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/customer-distribution");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de la distribution des clients");
      }
      return response.json();
    },
  });

  // Fetch receivables data
  const { data: receivables = [], isLoading: isLoadingReceivables } = useQuery({
    queryKey: ["receivables", "pending"],
    queryFn: async () => {
      const response = await fetch("/api/receivables/pending");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des factures clients en attente");
      }
      return response.json();
    },
  });

  // Fetch stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des statistiques");
      }
      return response.json();
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord clients</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nombre de clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? "Chargement..." : stats?.customerCount || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Factures clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? "Chargement..." : stats?.receivableCount || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Montant en attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats
                ? "Chargement..."
                : new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(stats?.pendingReceivableAmount || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribution">
        <TabsList>
          <TabsTrigger value="distribution">Distribution des clients</TabsTrigger>
          <TabsTrigger value="receivables">Factures en attente</TabsTrigger>
        </TabsList>
        <TabsContent value="distribution" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribution des clients par montant</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoadingDistribution ? (
                <div className="flex justify-center items-center h-full">
                  Chargement...
                </div>
              ) : customerDistribution.length === 0 ? (
                <div className="flex justify-center items-center h-full text-muted-foreground">
                  Aucune donnée disponible
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {customerDistribution.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(value)
                      }
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="receivables" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Factures clients en attente</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingReceivables ? (
                <div className="flex justify-center py-8">Chargement...</div>
              ) : receivables.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune facture client en attente.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Numéro</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Date d'émission</TableHead>
                      <TableHead>Date d'échéance</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receivables.map((receivable: any) => (
                      <TableRow key={receivable.id}>
                        <TableCell className="font-medium">
                          {receivable.number}
                        </TableCell>
                        <TableCell>{receivable.customerName || `Client #${receivable.customerId}`}</TableCell>
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
                        <TableCell className="text-right">
                          {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(receivable.amount)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              receivable.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : receivable.status === "partial"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {receivable.status === "paid"
                              ? "Payée"
                              : receivable.status === "partial"
                              ? "Partielle"
                              : "En attente"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
