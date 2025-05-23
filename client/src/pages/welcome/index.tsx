import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  User,
  ArrowRight
} from "lucide-react";
import { useState } from "react";

export default function WelcomePage() {
  const [_, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = () => {
    // Pour la démonstration, rediriger directement vers l'application
    setLocation("/suppliers");
  };

  return (
    <div className="min-h-screen page-custom flex">
      {/* Côté gauche - Authentification */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <Card className="card-custom w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              <h1 className="text-3xl font-bold text-orange-600 mb-2">Gesto</h1>
              <p className="text-gray-600">Plateforme de gestion d'entreprise</p>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isLogin ? "bg-white shadow-sm" : "text-gray-500"
                  }`}
                  onClick={() => setIsLogin(true)}
                >
                  Connexion
                </button>
                <button
                  className={`px-4 py-2 rounded-md transition-colors ${
                    !isLogin ? "bg-white shadow-sm" : "text-gray-500"
                  }`}
                  onClick={() => setIsLogin(false)}
                >
                  Inscription
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nom complet</label>
                  <Input placeholder="Votre nom complet" />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input type="email" placeholder="votre@email.com" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Mot de passe</label>
                <Input type="password" placeholder="••••••••" />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              )}
            </div>

            <Button 
              className="btn-primary w-full"
              onClick={handleAuth}
            >
              {isLogin ? "Se connecter" : "S'inscrire"}
            </Button>

            {isLogin && (
              <div className="text-center">
                <a href="#" className="text-sm text-gray-500 hover:text-orange-600">
                  Mot de passe oublié ?
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Côté droit - Accès simple et élégant */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-700">
              Gestion Financière
            </h2>
            <p className="text-xl text-gray-600 max-w-md mx-auto">
              Optimisez votre trésorerie et pilotez vos flux financiers en toute simplicité
            </p>
          </div>

          {/* Module Trésorerie mis en avant */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-orange-200 max-w-sm mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              Module Trésorerie
            </h3>
            
            <p className="text-gray-600 mb-6">
              Gérez vos décaissements, planifiez vos paiements et suivez vos échéances
            </p>

            <div className="space-y-3 text-left mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Facturation fournisseurs
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Planification des paiements
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Tableaux de bord financiers
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                10 traites PDF gratuites par jour
              </div>
            </div>

            <Button 
              className="btn-primary w-full"
              onClick={() => setLocation("/suppliers")}
            >
              Accéder au module
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Mention discrète des autres modules */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              D'autres modules arrivent prochainement
            </p>
            <div className="flex justify-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}