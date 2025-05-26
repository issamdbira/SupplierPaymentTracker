import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, Wallet } from "lucide-react";

interface Transaction {
  id: number;
  accountId: string;
  transactionDate: string;
  amount: number;
  description: string;
  reference: string;
  type: string;
  category: string;
  isMatched: boolean;
}

const FinancialSituationPage: React.FC = () => {
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/financial-situation"],
  });

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

  const getInflows = () => {
    if (!Array.isArray(transactions)) return [];
    return transactions.filter(t => t.type === "credit");
  };

  const getOutflows = () => {
    if (!Array.isArray(transactions)) return [];
    return transactions.filter(t => t.type === "debit");
  };

  const getTotalInflow = () => {
    return getInflows().reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const getTotalOutflow = () => {
    return getOutflows().reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const getNetCashflow = () => {
    return getTotalInflow() - getTotalOutflow();
  };

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-dark">Situation Financière</h1>
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
        <title>Situation Financière | FinancePro</title>
        <meta name="description" content="Consultez votre situation financière, analysez vos flux de trésorerie et suivez vos encaissements et décaissements." />
      </Helmet>
      
      <div className="py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-dark">Situation Financière</h1>
        </div>

        <div className="px-4 mx-auto mt-6 max-w-7xl sm:px-6 md:px-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Entrées</CardDescription>
                <CardTitle className="text-2xl text-green-600">{formatCurrency(getTotalInflow())}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                  Total des encaissements
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Sorties</CardDescription>
                <CardTitle className="text-2xl text-red-600">{formatCurrency(getTotalOutflow())}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                  Total des décaissements
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Solde</CardDescription>
                <CardTitle className={`text-2xl ${getNetCashflow() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(getNetCashflow())}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Wallet className="mr-1 h-4 w-4" />
                  Différence entrées/sorties
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Table with Tabs */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Flux financiers</CardTitle>
              <CardDescription>
                Consultez tous vos mouvements financiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">Tous les flux</TabsTrigger>
                  <TabsTrigger value="inflows">Encaissements</TabsTrigger>
                  <TabsTrigger value="outflows">Décaissements</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Référence</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Montant</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <Wallet className="mx-auto h-12 w-12 text-gray-300" />
                              <p className="mt-2 text-gray-medium">Aucune transaction trouvée</p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell>{transaction.reference}</TableCell>
                              <TableCell>{transaction.category}</TableCell>
                              <TableCell>
                                {transaction.type === "credit" ? (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                    Entrée
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                    Sortie
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className={`text-right font-medium ${transaction.type === "credit" ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.type === "credit" ? "+" : "-"}
                                {formatCurrency(Math.abs(transaction.amount))}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="inflows">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Référence</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead className="text-right">Montant</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getInflows().length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              <ArrowUp className="mx-auto h-12 w-12 text-gray-300" />
                              <p className="mt-2 text-gray-medium">Aucun encaissement trouvé</p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          getInflows().map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell>{transaction.reference}</TableCell>
                              <TableCell>{transaction.category}</TableCell>
                              <TableCell className="text-right font-medium text-green-600">
                                +{formatCurrency(Math.abs(transaction.amount))}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="outflows">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Référence</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead className="text-right">Montant</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getOutflows().length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              <ArrowDown className="mx-auto h-12 w-12 text-gray-300" />
                              <p className="mt-2 text-gray-medium">Aucun décaissement trouvé</p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          getOutflows().map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell>{transaction.reference}</TableCell>
                              <TableCell>{transaction.category}</TableCell>
                              <TableCell className="text-right font-medium text-red-600">
                                -{formatCurrency(Math.abs(transaction.amount))}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default FinancialSituationPage;
