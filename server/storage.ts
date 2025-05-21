import { 
  type User, type InsertUser, 
  type Supplier, type InsertSupplier,
  type Customer, type InsertCustomer,
  type Invoice, type InsertInvoice,
  type Receivable, type InsertReceivable,
  type Installment, type InsertInstallment,
  type BankTransaction, type InsertBankTransaction,
  type Activity, type InsertActivity
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(userData: InsertUser): Promise<User>;

  // Supplier methods
  getSupplier(id: number): Promise<Supplier | undefined>;
  getSuppliers(): Promise<Supplier[]>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: number): Promise<boolean>;

  // Customer methods
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomers(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;

  // Invoice methods (Supplier payments)
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoiceWithInstallments(id: number): Promise<{invoice: Invoice, installments: Installment[]} | undefined>;
  getInvoices(): Promise<Invoice[]>;
  getPendingInvoices(): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: number): Promise<boolean>;

  // Receivable methods (Customer payments)
  getReceivable(id: number): Promise<Receivable | undefined>;
  getReceivables(): Promise<Receivable[]>;
  getPendingReceivables(): Promise<Receivable[]>;
  createReceivable(receivable: InsertReceivable): Promise<Receivable>;
  updateReceivable(id: number, receivable: Partial<InsertReceivable>): Promise<Receivable | undefined>;
  deleteReceivable(id: number): Promise<boolean>;

  // Installment methods (for both invoice and receivable installments)
  getInstallment(id: number): Promise<Installment | undefined>;
  getInstallmentsByInvoice(invoiceId: number): Promise<Installment[]>;
  getUpcomingInstallments(): Promise<Installment[]>;
  createInstallment(installment: InsertInstallment): Promise<Installment>;
  createInstallments(installments: InsertInstallment[]): Promise<Installment[]>;
  updateInstallment(id: number, installment: Partial<InsertInstallment>): Promise<Installment | undefined>;
  deleteInstallment(id: number): Promise<boolean>;
  deleteInstallmentsByInvoice(invoiceId: number): Promise<boolean>;

  // Bank Transaction methods
  getBankTransaction(id: number): Promise<BankTransaction | undefined>;
  getBankTransactions(from?: Date, to?: Date): Promise<BankTransaction[]>;
  createBankTransaction(transaction: InsertBankTransaction): Promise<BankTransaction>;
  createBankTransactions(transactions: InsertBankTransaction[]): Promise<BankTransaction[]>;
  updateBankTransaction(id: number, transaction: Partial<InsertBankTransaction>): Promise<BankTransaction | undefined>;
  deleteBankTransaction(id: number): Promise<boolean>;

  // Activity methods
  getActivity(id: number): Promise<Activity | undefined>;
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Dashboard methods
  getStats(): Promise<{
    invoiceCount: number;
    upcomingPayments: number;
    pendingAmount: number;
    dueInvoices: number;
    customerCount: number;
    receivableCount: number;
    pendingReceivableAmount: number;
  }>;
  getFinancialForecast(): Promise<{month: string, amount: number}[]>;
  getSupplierDistribution(): Promise<{name: string, amount: number}[]>;
  getCustomerDistribution(): Promise<{name: string, amount: number}[]>;
  getCashFlowForecast(): Promise<{month: string, income: number, expense: number}[]>;
}

// In-memory implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private suppliers: Map<number, Supplier>;
  private invoices: Map<number, Invoice>;
  private installments: Map<number, Installment>;
  private activities: Map<number, Activity>;
  
  private userCurrentId: number;
  private supplierCurrentId: number;
  private invoiceCurrentId: number;
  private installmentCurrentId: number;
  private activityCurrentId: number;

  constructor() {
    this.users = new Map();
    this.suppliers = new Map();
    this.invoices = new Map();
    this.installments = new Map();
    this.activities = new Map();
    
    this.userCurrentId = 1;
    this.supplierCurrentId = 1;
    this.invoiceCurrentId = 1;
    this.installmentCurrentId = 1;
    this.activityCurrentId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  // Initialize with sample data
  private initializeSampleData() {
    // Create admin user
    this.createUser({
      username: "admin",
      password: "admin",
      fullName: "Thomas Durand",
      role: "admin"
    });

    // Create some suppliers
    const suppliers = [
      {
        name: "Dupont Matériaux",
        email: "contact@dupont-materiaux.com",
        phone: "+33123456789",
        address: "15 Rue des Entrepreneurs, 75015 Paris",
        contactPerson: "Jean Dupont"
      },
      {
        name: "Martin Construction",
        email: "info@martin-construction.com",
        phone: "+33234567890",
        address: "22 Avenue des Bâtisseurs, 69002 Lyon",
        contactPerson: "Sophie Martin"
      },
      {
        name: "Leroy Électricité",
        email: "contact@leroy-elec.com",
        phone: "+33345678901",
        address: "8 Rue des Artisans, 33000 Bordeaux",
        contactPerson: "Pierre Leroy"
      },
      {
        name: "Bernard Plomberie",
        email: "info@bernard-plomberie.com",
        phone: "+33456789012",
        address: "45 Boulevard des Métiers, 59000 Lille",
        contactPerson: "Marie Bernard"
      },
      {
        name: "Dubois Matériaux",
        email: "contact@dubois-mat.com",
        phone: "+33567890123",
        address: "36 Avenue de l'Industrie, 44000 Nantes",
        contactPerson: "Luc Dubois"
      }
    ];

    suppliers.forEach(supplier => {
      this.createSupplier(supplier);
    });

    // Create some invoices
    const invoices = [
      {
        number: "FAC-2023-0542",
        supplierId: 1,
        amount: 45780.0,
        issueDate: new Date(2023, 3, 15),
        dueDate: new Date(2023, 5, 15),
        status: "pending",
        description: "Fourniture de matériaux de construction"
      },
      {
        number: "FAC-2023-0536",
        supplierId: 2,
        amount: 28450.0,
        issueDate: new Date(2023, 3, 10),
        dueDate: new Date(2023, 4, 10),
        status: "pending",
        description: "Services de construction"
      },
      {
        number: "FAC-2023-0528",
        supplierId: 3,
        amount: 12340.0,
        issueDate: new Date(2023, 3, 5),
        dueDate: new Date(2023, 5, 5),
        status: "partial",
        description: "Installation électrique"
      },
      {
        number: "FAC-2023-0515",
        supplierId: 4,
        amount: 8920.0,
        issueDate: new Date(2023, 2, 28),
        dueDate: new Date(2023, 4, 28),
        status: "pending",
        description: "Services de plomberie"
      },
      {
        number: "FAC-2023-0502",
        supplierId: 5,
        amount: 34560.0,
        issueDate: new Date(2023, 2, 20),
        dueDate: new Date(2023, 4, 20),
        status: "partial",
        description: "Fourniture de matériaux de construction"
      }
    ];

    invoices.forEach(invoice => {
      this.createInvoice(invoice);
    });

    // Create some installments for invoice 3
    const installments = [
      {
        invoiceId: 3,
        installmentNumber: 1,
        amount: 4113.33,
        percentage: 33.33,
        dueDate: new Date(2023, 5, 5),
        paymentMethod: "transfer",
        status: "paid",
        paymentDate: new Date(2023, 5, 5)
      },
      {
        invoiceId: 3,
        installmentNumber: 2,
        amount: 4113.33,
        percentage: 33.33,
        dueDate: new Date(2023, 6, 5),
        paymentMethod: "transfer",
        status: "pending",
        paymentDate: undefined
      },
      {
        invoiceId: 3,
        installmentNumber: 3,
        amount: 4113.34,
        percentage: 33.34,
        dueDate: new Date(2023, 7, 5),
        paymentMethod: "transfer",
        status: "pending",
        paymentDate: undefined
      }
    ];

    installments.forEach(installment => {
      this.createInstallment(installment);
    });

    // Create some installments for invoice 5
    const installments2 = [
      {
        invoiceId: 5,
        installmentNumber: 1,
        amount: 17280.0,
        percentage: 50.0,
        dueDate: new Date(2023, 4, 20),
        paymentMethod: "transfer",
        status: "paid",
        paymentDate: new Date(2023, 4, 20)
      },
      {
        invoiceId: 5,
        installmentNumber: 2,
        amount: 17280.0,
        percentage: 50.0,
        dueDate: new Date(2023, 5, 20),
        paymentMethod: "draft",
        status: "pending",
        paymentDate: undefined
      }
    ];

    installments2.forEach(installment => {
      this.createInstallment(installment);
    });

    // Create some activities
    const activities = [
      {
        userId: 1,
        action: "validate",
        resourceType: "payment_plan",
        resourceId: 3,
        details: "a validé le plan de paiement pour la facture FAC-2023-0498"
      },
      {
        userId: 1,
        action: "create",
        resourceType: "invoice",
        resourceId: 1,
        details: "a ajouté une nouvelle facture FAC-2023-0542 de Dupont Matériaux"
      },
      {
        userId: 1,
        action: "payment",
        resourceType: "invoice",
        resourceId: 3,
        details: "a effectué un paiement de 12 340,00 € à Leroy Électricité"
      },
      {
        userId: 1,
        action: "alert",
        resourceType: "system",
        resourceId: null,
        details: "a généré une alerte pour les factures à échéance dans moins de 7 jours"
      }
    ];

    activities.forEach(activity => {
      this.createActivity(activity);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Supplier methods
  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const id = this.supplierCurrentId++;
    const newSupplier: Supplier = { ...supplier, id };
    this.suppliers.set(id, newSupplier);
    return newSupplier;
  }

  async updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const existingSupplier = this.suppliers.get(id);
    if (!existingSupplier) return undefined;
    
    const updatedSupplier = { ...existingSupplier, ...supplier };
    this.suppliers.set(id, updatedSupplier);
    return updatedSupplier;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Invoice methods
  async getInvoice(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async getInvoiceWithInstallments(id: number): Promise<{invoice: Invoice, installments: Installment[]} | undefined> {
    const invoice = await this.getInvoice(id);
    if (!invoice) return undefined;
    
    const installments = await this.getInstallmentsByInvoice(id);
    return { invoice, installments };
  }

  async getInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values());
  }

  async getPendingInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(
      (invoice) => invoice.status === "pending" || invoice.status === "partial"
    );
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const id = this.invoiceCurrentId++;
    const newInvoice: Invoice = { ...invoice, id };
    this.invoices.set(id, newInvoice);
    return newInvoice;
  }

  async updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const existingInvoice = this.invoices.get(id);
    if (!existingInvoice) return undefined;
    
    const updatedInvoice = { ...existingInvoice, ...invoice };
    this.invoices.set(id, updatedInvoice);
    return updatedInvoice;
  }

  async deleteInvoice(id: number): Promise<boolean> {
    // Delete all installments for this invoice
    await this.deleteInstallmentsByInvoice(id);
    return this.invoices.delete(id);
  }

  // Installment methods
  async getInstallment(id: number): Promise<Installment | undefined> {
    return this.installments.get(id);
  }

  async getInstallmentsByInvoice(invoiceId: number): Promise<Installment[]> {
    return Array.from(this.installments.values()).filter(
      (installment) => installment.invoiceId === invoiceId
    );
  }

  async getUpcomingInstallments(): Promise<Installment[]> {
    return Array.from(this.installments.values()).filter(
      (installment) => installment.status === "pending"
    );
  }

  async createInstallment(installment: InsertInstallment): Promise<Installment> {
    const id = this.installmentCurrentId++;
    const newInstallment: Installment = { ...installment, id };
    this.installments.set(id, newInstallment);
    return newInstallment;
  }

  async createInstallments(installments: InsertInstallment[]): Promise<Installment[]> {
    const createdInstallments: Installment[] = [];
    
    for (const installment of installments) {
      const createdInstallment = await this.createInstallment(installment);
      createdInstallments.push(createdInstallment);
    }
    
    return createdInstallments;
  }

  async updateInstallment(id: number, installment: Partial<InsertInstallment>): Promise<Installment | undefined> {
    const existingInstallment = this.installments.get(id);
    if (!existingInstallment) return undefined;
    
    const updatedInstallment = { ...existingInstallment, ...installment };
    this.installments.set(id, updatedInstallment);
    return updatedInstallment;
  }

  async deleteInstallment(id: number): Promise<boolean> {
    return this.installments.delete(id);
  }

  async deleteInstallmentsByInvoice(invoiceId: number): Promise<boolean> {
    const installments = await this.getInstallmentsByInvoice(invoiceId);
    
    for (const installment of installments) {
      await this.deleteInstallment(installment.id);
    }
    
    return true;
  }

  // Activity methods
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async getActivities(limit?: number): Promise<Activity[]> {
    const activities = Array.from(this.activities.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return limit ? activities.slice(0, limit) : activities;
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.activityCurrentId++;
    const newActivity: Activity = { 
      ...activity, 
      id, 
      timestamp: activity.timestamp || new Date() 
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  // Dashboard methods
  async getStats(): Promise<{ invoiceCount: number; upcomingPayments: number; pendingAmount: number; dueInvoices: number; }> {
    const invoices = await this.getInvoices();
    const pendingInvoices = await this.getPendingInvoices();
    const upcomingInstallments = await this.getUpcomingInstallments();
    
    // Calculate pending amount
    const pendingAmount = pendingInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    
    // Calculate due invoices (due date within 7 days)
    const now = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(now.getDate() + 7);
    
    const dueInvoices = pendingInvoices.filter(
      (invoice) => invoice.dueDate <= oneWeekFromNow
    ).length;
    
    return {
      invoiceCount: invoices.length,
      upcomingPayments: upcomingInstallments.length,
      pendingAmount,
      dueInvoices
    };
  }

  async getFinancialForecast(): Promise<{ month: string; amount: number; }[]> {
    const upcomingInstallments = await this.getUpcomingInstallments();
    const now = new Date();
    const result: { [key: string]: number } = {};
    
    // Get next 6 months
    for (let i = 0; i < 6; i++) {
      const date = new Date(now);
      date.setMonth(now.getMonth() + i);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      result[monthKey] = 0;
    }
    
    // Sum amounts by month
    for (const installment of upcomingInstallments) {
      const dueDate = new Date(installment.dueDate);
      const monthKey = `${dueDate.getFullYear()}-${dueDate.getMonth() + 1}`;
      
      if (result[monthKey] !== undefined) {
        result[monthKey] += installment.amount;
      }
    }
    
    // Convert to array and format for chart
    return Object.entries(result).map(([key, amount]) => {
      const [year, month] = key.split('-').map(Number);
      const date = new Date(year, month - 1);
      return {
        month: date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
        amount
      };
    });
  }

  async getSupplierDistribution(): Promise<{ name: string; amount: number; }[]> {
    const invoices = await this.getPendingInvoices();
    const suppliers = await this.getSuppliers();
    const result: { [key: number]: number } = {};
    
    // Sum amounts by supplier
    for (const invoice of invoices) {
      if (!result[invoice.supplierId]) {
        result[invoice.supplierId] = 0;
      }
      result[invoice.supplierId] += invoice.amount;
    }
    
    // Convert to array and format for chart
    const supplierData = Object.entries(result)
      .map(([supplierId, amount]) => {
        const supplier = suppliers.find(s => s.id === Number(supplierId));
        return {
          name: supplier ? supplier.name : 'Unknown',
          amount
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Top 5 suppliers
    
    return supplierData;
  }
}

export const storage = new MemStorage();
