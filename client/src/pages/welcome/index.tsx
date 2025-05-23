import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, FileText, CreditCard, ArrowRight } from "lucide-react";

export default function WelcomePage() {
  const [_, setLocation] = useLocation();
  
  // Function to navigate to a new route
  const navigate = (path: string) => {
    setLocation(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-orange-600">Gesto</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Gestion financière des décaissements et encaissements</h2>
            <p className="text-lg text-gray-600 mb-6">
              Une plateforme complète pour gérer vos paiements fournisseurs et vos encaissements clients
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Suppliers Card */}
            <Card className="border-2 border-orange-200 hover:border-orange-500 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 pb-6">
                <CardTitle className="text-2xl text-orange-800 flex items-center gap-2">
                  <Users className="h-6 w-6" /> 
                  Gestion Fournisseurs
                </CardTitle>
                <CardDescription className="text-orange-700 text-base">
                  Gérez toutes vos factures et paiements fournisseurs
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>Planification des échéances de paiement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>Suivi des factures et des paiements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>Rapports financiers détaillés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>Vérification des paiements bancaires</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  onClick={() => navigate('/suppliers')}
                >
                  Accéder aux fournisseurs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Customers Card */}
            <Card className="border-2 border-blue-200 hover:border-blue-500 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-6">
                <CardTitle className="text-2xl text-blue-800 flex items-center gap-2">
                  <Users className="h-6 w-6" /> 
                  Gestion Clients
                </CardTitle>
                <CardDescription className="text-blue-700 text-base">
                  Suivez toutes vos créances et encaissements
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Gestion des créances clients</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Planification des encaissements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Suivi des paiements reçus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Prévisions de trésorerie</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate('/customers')}
                >
                  Accéder aux clients
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <h3 className="text-xl font-semibold mb-4">Fonctionnalités principales</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <FileText className="mx-auto h-10 w-10 text-orange-500 mb-3" />
                <h4 className="font-bold mb-2">Factures et Échéanciers</h4>
                <p className="text-sm text-gray-600">Gérez facilement vos factures et planifiez vos paiements en plusieurs échéances</p>
              </Card>
              
              <Card className="text-center p-6">
                <CreditCard className="mx-auto h-10 w-10 text-orange-500 mb-3" />
                <h4 className="font-bold mb-2">Suivi bancaire</h4>
                <p className="text-sm text-gray-600">Importez vos relevés bancaires pour vérifier les paiements effectués</p>
              </Card>
              
              <Card className="text-center p-6">
                <Users className="mx-auto h-10 w-10 text-orange-500 mb-3" />
                <h4 className="font-bold mb-2">Comptabilité</h4>
                <p className="text-sm text-gray-600">Intégration avec les logiciels de comptabilité pour le lettrage des transactions</p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Gesto - Plateforme de gestion financière</p>
        </div>
      </footer>
    </div>
  );
}