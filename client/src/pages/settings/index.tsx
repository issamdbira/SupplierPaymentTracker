import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/layout/ThemeProvider";
import { Moon, Sun, UserCog, Bell, Shield, Euro } from "lucide-react";

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Helmet>
        <title>Paramètres | FinancePro</title>
        <meta name="description" content="Configurez vos préférences et personnalisez votre expérience sur la plateforme de gestion des décaissements." />
      </Helmet>
      
      <div className="py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-dark">Paramètres</h1>
        </div>

        <div className="px-4 mx-auto mt-6 max-w-7xl sm:px-6 md:px-8">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Sécurité
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                Préférences
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du profil</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" defaultValue="Thomas Durand" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="thomas.durand@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Input id="role" defaultValue="Administrateur" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" defaultValue="+33 1 23 45 67 89" />
                  </div>
                  <Button className="bg-primary hover:bg-primary-dark mt-4">
                    Enregistrer les modifications
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Configurez vos préférences de notification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Échéances de paiement</Label>
                        <p className="text-sm text-muted-foreground">
                          Recevoir des notifications pour les échéances à venir
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Nouvelles factures</Label>
                        <p className="text-sm text-muted-foreground">
                          Recevoir des notifications pour les nouvelles factures
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Rapports</Label>
                        <p className="text-sm text-muted-foreground">
                          Recevoir des rapports hebdomadaires par email
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notifications du navigateur</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Alertes de paiement</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications dans le navigateur pour les paiements imminents
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <Button className="bg-primary hover:bg-primary-dark mt-4">
                    Enregistrer les préférences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                  <CardDescription>
                    Gérez vos paramètres de sécurité et mots de passe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Changer de mot de passe</h3>
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Mot de passe actuel</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button className="bg-primary hover:bg-primary-dark">
                      Mettre à jour le mot de passe
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Sessions</h3>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Dernière connexion</p>
                      <p className="text-sm text-muted-foreground">
                        Aujourd'hui à 10:45 depuis Paris, France
                      </p>
                    </div>
                    <Button variant="outline">
                      Se déconnecter de toutes les sessions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences</CardTitle>
                  <CardDescription>
                    Personnalisez votre expérience d'utilisation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Thème sombre</Label>
                      <p className="text-sm text-muted-foreground">
                        Basculer entre les thèmes clair et sombre
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sun className="h-5 w-5 text-yellow-500" />
                      <Switch
                        checked={theme === "dark"}
                        onCheckedChange={(checked) => {
                          setTheme(checked ? "dark" : "light");
                        }}
                      />
                      <Moon className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Paramètres financiers</h3>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Devise par défaut</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                          <Euro className="h-4 w-4" />
                        </div>
                        <Input id="currency" defaultValue="EUR" className="rounded-l-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Format de date</Label>
                      <Input id="date-format" defaultValue="DD/MM/YYYY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment-days">Délai de paiement par défaut (jours)</Label>
                      <Input id="payment-days" type="number" defaultValue="30" />
                    </div>
                  </div>

                  <Button className="bg-primary hover:bg-primary-dark mt-4">
                    Enregistrer les préférences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
