import { useState } from "react";
import { Plus, Search, Filter, FileText, Calendar, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Données d'exemple pour démontrer le style Ernst & Young
  const sampleInvoices = [
    { id: 1, number: "F-2024-001", supplier: "Achref", amount: 1500.00, status: "pending", issueDate: "2024-01-15", dueDate: "2024-02-15" },
    { id: 2, number: "F-2024-002", supplier: "Fournisseur Tech", amount: 2800.00, status: "paid", issueDate: "2024-01-20", dueDate: "2024-02-20" },
    { id: 3, number: "F-2024-003", supplier: "Services Pro", amount: 950.00, status: "overdue", issueDate: "2024-01-10", dueDate: "2024-02-10" },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "En attente", variant: "default" as const },
      processing: { label: "En cours", variant: "secondary" as const },
      paid: { label: "Payée", variant: "secondary" as const },
      overdue: { label: "En retard", variant: "destructive" as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const totalAmount = sampleInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const pendingCount = sampleInvoices.filter(inv => inv.status === 'pending').length;
  const overdueCount = sampleInvoices.filter(inv => inv.status === 'overdue').length;

  return (
    <div className="ey-page p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header avec style Ernst & Young */}
        <div className="ey-header rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Factures</h1>
              <p className="text-gray-600 mt-2">
                Gérez vos factures fournisseurs et planifiez vos paiements
              </p>
            </div>
            <Button className="ey-button">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Facture
            </Button>
          </div>
        </div>

        {/* Cartes de statistiques avec style EY */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="ey-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des Factures</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sampleInvoices.length}</div>
              <p className="text-xs text-muted-foreground">factures enregistrées</p>
            </CardContent>
          </Card>

          <Card className="ey-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">factures à traiter</p>
            </CardContent>
          </Card>

          <Card className="ey-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
              <p className="text-xs text-muted-foreground">montant total</p>
            </CardContent>
          </Card>

          <Card className="ey-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Retard</CardTitle>
              <Calendar className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
              <p className="text-xs text-muted-foreground">factures en retard</p>
            </CardContent>
          </Card>
        </div>

        {/* Recherche avec style EY */}
        <Card className="ey-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par numéro de facture ou fournisseur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="ey-button">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des factures avec style EY */}
        <Card className="ey-card">
          <CardHeader>
            <CardTitle>Liste des Factures</CardTitle>
            <CardDescription>
              {sampleInvoices.length} facture(s) trouvée(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleInvoices.map((invoice) => (
                <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <h3 className="font-medium">{invoice.number}</h3>
                        <p className="text-gray-600">{invoice.supplier}</p>
                        <p className="font-semibold text-lg">{formatCurrency(invoice.amount)}</p>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Émission: {formatDate(invoice.issueDate)} • Échéance: {formatDate(invoice.dueDate)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="ey-button">
                        Planifier
                      </Button>
                      <Button size="sm" variant="outline">
                        Modifier
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message de démonstration du style EY */}
        <Card className="ey-card border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-gray-700">
                <strong>Style Ernst & Young appliqué !</strong> Background gris clair, boutons jaune-orange et interface professionnelle.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default InvoicesPage;