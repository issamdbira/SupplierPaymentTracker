import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Search, Plus, Edit, Trash, Mail, Phone, MapPin, User, Building } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CustomerForm, type CustomerFormData } from "@/components/customers/CustomerForm";

interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  contactPerson: string | null;
}

const CustomersPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const createMutation = useMutation({
    mutationFn: async (values: CustomerFormData) => {
      const response = await apiRequest("POST", "/api/customers", values);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      setIsCreateModalOpen(false);
      toast({
        title: "Client créé",
        description: "Le client a été créé avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création du client.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: number; values: CustomerFormData }) => {
      const response = await apiRequest("PUT", `/api/customers/${id}`, values);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      setIsEditModalOpen(false);
      setSelectedCustomer(null);
      toast({
        title: "Client mis à jour",
        description: "Le client a été mis à jour avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour du client.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/customers/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      setIsDeleteModalOpen(false);
      setSelectedCustomer(null);
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression du client.",
        variant: "destructive",
      });
    },
  });

  const onCreateSubmit = async (values: CustomerFormData): Promise<void> => {
    createMutation.mutate(values);
  };

  const onEditSubmit = async (values: CustomerFormData): Promise<void> => {
    if (selectedCustomer) {
      updateMutation.mutate({ id: selectedCustomer.id, values });
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCustomer) {
      deleteMutation.mutate(selectedCustomer.id);
    }
  };

  const filteredCustomers = React.useMemo(() => {
    if (!Array.isArray(customers)) return [];
    if (!searchQuery.trim()) return customers;

    const query = searchQuery.toLowerCase();
    return customers.filter((customer: Customer) => {
      const name = customer.name.toLowerCase();
      const email = customer.email?.toLowerCase() || "";
      const contactPerson = customer.contactPerson?.toLowerCase() || "";

      return (
        name.includes(query) ||
        email.includes(query) ||
        contactPerson.includes(query)
      );
    });
  }, [customers, searchQuery]);

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-dark">Clients</h1>
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
        <title>Clients | FinancePro</title>
        <meta name="description" content="Gérez la liste de vos clients, ajoutez de nouveaux contacts et suivez vos relations commerciales." />
      </Helmet>
      
      <div className="py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-dark">Clients</h1>
        </div>

        <div className="px-4 mx-auto mt-6 max-w-7xl sm:px-6 md:px-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Liste des clients</CardTitle>
                <Button
                  className="bg-primary hover:bg-primary-dark"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau client
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-medium h-4 w-4" />
                <Input
                  placeholder="Rechercher un client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Nom</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Adresse</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <Building className="mx-auto h-12 w-12 text-gray-300" />
                          <p className="mt-2 text-gray-medium">Aucun client trouvé</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((customer: Customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell>{customer.contactPerson || "-"}</TableCell>
                          <TableCell>{customer.email || "-"}</TableCell>
                          <TableCell>{customer.phone || "-"}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{customer.address || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(customer)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Modifier</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(customer)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Supprimer</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Customer Cards Grid - alternative view */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredCustomers.map((customer: Customer) => (
              <Card key={customer.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    {customer.name}
                  </CardTitle>
                  {customer.contactPerson && (
                    <CardDescription className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {customer.contactPerson}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {customer.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-medium" />
                      <span>{customer.email}</span>
                    </div>
                  )}
                  {customer.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-medium" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-medium mt-1" />
                      <span>{customer.address}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(customer)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(customer)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Create Customer Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau client</DialogTitle>
            <DialogDescription>
              Remplissez les informations du client ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <CustomerForm 
            onCancel={() => setIsCreateModalOpen(false)}
            onSubmit={onCreateSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Customer Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
            <DialogDescription>
              Modifiez les informations du client ci-dessous.
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <CustomerForm 
              onCancel={() => setIsEditModalOpen(false)}
              onSubmit={onEditSubmit}
              initialData={{
                name: selectedCustomer.name,
                email: selectedCustomer.email || "",
                phone: selectedCustomer.phone || "",
                address: selectedCustomer.address || "",
                contactPerson: selectedCustomer.contactPerson || ""
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomersPage;
