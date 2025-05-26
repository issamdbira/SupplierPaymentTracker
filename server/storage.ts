import { 
  type User, type InsertUser, 
  type Supplier, type InsertSupplier,
  type Customer, type InsertCustomer,
  type Invoice, type InsertInvoice,
  type Receivable, type InsertReceivable,
  type Installment, type InsertInstallment,
  type BankTransaction, type InsertBankTransaction,
  type Activity, type InsertActivity
} from "../shared/schema";

export interface IStorage {
  // User methods
  getUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(userData: InsertUser): Promise<User>;

  // Supplier methods
  getSuppliers(): Promise<Supplier[]>;
  getSupplierById(id: number): Promise<Supplier | null>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | null>;
  deleteSupplier(id: number): Promise<boolean>;

  // Customer methods
  getCustomers(): Promise<Customer[]>;
  getCustomerById(id: number): Promise<Customer | null>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | null>;
  deleteCustomer(id: number): Promise<boolean>;

  // Invoice methods
  getInvoices(): Promise<Invoice[]>;
  getInvoiceById(id: number): Promise<Invoice | null>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice | null>;
  deleteInvoice(id: number): Promise<boolean>;
  getInvoiceWithInstallments(id: number): Promise<{ invoice: Invoice; installments: Installment[] } | null>;

  // Receivable methods
  getReceivables(): Promise<Receivable[]>;
  getReceivableById(id: number): Promise<Receivable | null>;
  createReceivable(receivable: InsertReceivable): Promise<Receivable>;
  updateReceivable(id: number, receivable: Partial<InsertReceivable>): Promise<Receivable | null>;
  deleteReceivable(id: number): Promise<boolean>;
  getReceivableWithInstallments(id: number): Promise<{ receivable: Receivable; installments: ReceivableInstallment[] } | null>;

  // Installment methods
  getInstallments(): Promise<Installment[]>;
  getInstallmentById(id: number): Promise<Installment | null>;
  getInstallmentsByInvoiceId(invoiceId: number): Promise<Installment[]>;
  createInstallment(installment: InsertInstallment): Promise<Installment>;
  updateInstallment(id: number, installment: Partial<InsertInstallment>): Promise<Installment | null>;

  // Receivable Installment methods
  getReceivableInstallments(): Promise<ReceivableInstallment[]>;
  getReceivableInstallmentById(id: number): Promise<ReceivableInstallment | null>;
  getReceivableInstallmentsByReceivableId(receivableId: number): Promise<ReceivableInstallment[]>;
  createReceivableInstallment(installment: InsertReceivableInstallment): Promise<ReceivableInstallment>;
  updateReceivableInstallment(id: number, installment: Partial<InsertReceivableInstallment>): Promise<ReceivableInstallment | null>;

  // Bank Transaction methods
  getBankTransactions(from?: string, to?: string, type?: string): Promise<BankTransaction[]>;
  createBankTransaction(transaction: InsertBankTransaction): Promise<BankTransaction>;

  // Dashboard methods
  getStats(): Promise<{
    supplierCount: number;
    customerCount: number;
    invoiceCount: number;
    receivableCount: number;
    pendingInvoiceAmount: number;
    pendingReceivableAmount: number;
  }>;
  getPaymentsByMonth(): Promise<{ month: string; amount: number }[]>;
  getSupplierDistribution(): Promise<{ supplier: string; amount: number }[]>;
  getPendingInvoices(): Promise<Invoice[]>;
  getRecentActivities(): Promise<Activity[]>;

  // Activity methods
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Financial situation methods
  getFinancialSituation(type?: string): Promise<any[]>;
}

// Interface for Receivable Installment
export interface ReceivableInstallment {
  id: number;
  receivableId: number;
  installmentNumber: number;
  amount: number;
  percentage: number;
  dueDate: string;
  paymentMethod: string;
  status: string;
  paymentDate?: string;
  reference?: string;
  bankTransactionId?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface for inserting a new Receivable Installment
export interface InsertReceivableInstallment {
  receivableId: number;
  installmentNumber: number;
  amount: number;
  percentage: number;
  dueDate: string;
  paymentMethod: string;
  status: string;
  paymentDate?: string;
  reference?: string;
  bankTransactionId?: number;
  notes?: string;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private userCurrentId = 1;

  private suppliers: Map<number, Supplier> = new Map();
  private supplierCurrentId = 1;

  private customers: Map<number, Customer> = new Map();
  private customerCurrentId = 1;

  private invoices: Map<number, Invoice> = new Map();
  private invoiceCurrentId = 1;

  private receivables: Map<number, Receivable> = new Map();
  private receivableCurrentId = 1;

  private installments: Map<number, Installment> = new Map();
  private installmentCurrentId = 1;

  private receivableInstallments: Map<number, ReceivableInstallment> = new Map();
  private receivableInstallmentCurrentId = 1;

  private bankTransactions: Map<number, BankTransaction> = new Map();
  private bankTransactionCurrentId = 1;

  private activities: Map<number, Activity> = new Map();
  private activityCurrentId = 1;

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample users
    this.createUser({
      id: "1",
      username: "admin",
      password: "admin",
      fullName: "Admin User",
      email: "admin@example.com",
      role: "admin"
    });

    // Sample suppliers
    this.createSupplier({
      name: "Fournisseur A",
      email: "contact@fournisseura.com",
      phone: "+33123456789",
      address: "123 Rue de Paris, 75001 Paris",
      contactPerson: "Jean Dupont",
      category: "Matériel informatique",
      taxId: "FR12345678901",
      bankInfo: "IBAN: FR76 1234 5678 9012 3456 7890 123",
      notes: "Fournisseur principal de matériel informatique"
    });

    this.createSupplier({
      name: "Fournisseur B",
      email: "contact@fournisseurb.com",
      phone: "+33123456790",
      address: "456 Avenue des Champs-Élysées, 75008 Paris",
      contactPerson: "Marie Martin",
      category: "Fournitures de bureau",
      taxId: "FR98765432109",
      bankInfo: "IBAN: FR76 9876 5432 1098 7654 3210 987",
      notes: "Fournisseur de fournitures de bureau"
    });

    // Sample customers
    this.createCustomer({
      name: "Client X",
      email: "contact@clientx.com",
      phone: "+33123456791",
      address: "789 Boulevard Haussmann, 75009 Paris",
      contactPerson: "Pierre Durand",
      category: "Entreprise",
      taxId: "FR13579246801",
      bankInfo: "IBAN: FR76 1357 9246 8013 5792 4680 135",
      notes: "Client régulier"
    });

    this.createCustomer({
      name: "Client Y",
      email: "contact@clienty.com",
      phone: "+33123456792",
      address: "321 Rue de Rivoli, 75004 Paris",
      contactPerson: "Sophie Lefebvre",
      category: "Administration",
      taxId: "FR24680135792",
      bankInfo: "IBAN: FR76 2468 0135 7924 6801 3579 246",
      notes: "Client important"
    });

    // Sample invoices (supplier payments)
    const invoice1 = this.createInvoice({
      number: "INV-2025-001",
      supplierId: 1,
      amount: 1200.50,
      issueDate: new Date("2025-05-01").toISOString(),
      dueDate: new Date("2025-05-31").toISOString(),
      status: "pending",
      description: "Achat de matériel informatique",
      category: "Équipement",
      reference: "BON-2025-001"
    });

    const invoice2 = this.createInvoice({
      number: "INV-2025-002",
      supplierId: 2,
      amount: 450.75,
      issueDate: new Date("2025-05-05").toISOString(),
      dueDate: new Date("2025-06-05").toISOString(),
      status: "pending",
      description: "Fournitures de bureau trimestrielles",
      category: "Fournitures",
      reference: "BON-2025-002"
    });

    // Sample receivables (customer payments)
    const receivable1 = this.createReceivable({
      number: "FACT-2025-001",
      customerId: 1,
      amount: 2500.00,
      issueDate: new Date("2025-05-02").toISOString(),
      dueDate: new Date("2025-06-02").toISOString(),
      status: "pending",
      description: "Services de consultation",
      category: "Services",
      reference: "DEVIS-2025-001"
    });

    const receivable2 = this.createReceivable({
      number: "FACT-2025-002",
      customerId: 2,
      amount: 1800.25,
      issueDate: new Date("2025-05-10").toISOString(),
      dueDate: new Date("2025-06-10").toISOString(),
      status: "pending",
      description: "Développement de logiciel",
      category: "Développement",
      reference: "DEVIS-2025-002"
    });

    // Sample installments for invoices
    this.createInstallment({
      invoiceId: invoice1.id,
      installmentNumber: 1,
      amount: 600.25,
      percentage: 50,
      dueDate: new Date("2025-05-15").toISOString(),
      paymentMethod: "transfer",
      status: "pending"
    });

    this.createInstallment({
      invoiceId: invoice1.id,
      installmentNumber: 2,
      amount: 600.25,
      percentage: 50,
      dueDate: new Date("2025-05-31").toISOString(),
      paymentMethod: "transfer",
      status: "pending"
    });

    this.createInstallment({
      invoiceId: invoice2.id,
      installmentNumber: 1,
      amount: 450.75,
      percentage: 100,
      dueDate: new Date("2025-06-05").toISOString(),
      paymentMethod: "check",
      status: "pending"
    });

    // Sample installments for receivables
    this.createReceivableInstallment({
      receivableId: receivable1.id,
      installmentNumber: 1,
      amount: 1250.00,
      percentage: 50,
      dueDate: new Date("2025-05-17").toISOString(),
      paymentMethod: "transfer",
      status: "pending"
    });

    this.createReceivableInstallment({
      receivableId: receivable1.id,
      installmentNumber: 2,
      amount: 1250.00,
      percentage: 50,
      dueDate: new Date("2025-06-02").toISOString(),
      paymentMethod: "transfer",
      status: "pending"
    });

    this.createReceivableInstallment({
      receivableId: receivable2.id,
      installmentNumber: 1,
      amount: 900.13,
      percentage: 50,
      dueDate: new Date("2025-05-25").toISOString(),
      paymentMethod: "transfer",
      status: "pending"
    });

    this.createReceivableInstallment({
      receivableId: receivable2.id,
      installmentNumber: 2,
      amount: 900.12,
      percentage: 50,
      dueDate: new Date("2025-06-10").toISOString(),
      paymentMethod: "transfer",
      status: "pending"
    });

    // Sample bank transactions
    this.createBankTransaction({
      accountId: "main",
      transactionDate: new Date("2025-05-01").toISOString(),
      amount: -450.75,
      description: "Paiement Fournisseur B",
      reference: "VIR-2025-001",
      type: "debit",
      category: "Fournitures",
      isMatched: false
    });

    this.createBankTransaction({
      accountId: "main",
      transactionDate: new Date("2025-05-03").toISOString(),
      amount: 1250.00,
      description: "Paiement Client X",
      reference: "VIR-2025-002",
      type: "credit",
      category: "Services",
      isMatched: false
    });
  }

  // User methods
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUserById(id: number): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const users = Array.from(this.users.values());
    return users.find(user => user.username === username) || null;
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const newUser: User = { ...user, id: user.id || id.toString() };
    this.users.set(id, newUser);
    return newUser;
  }

  async upsertUser(userData: InsertUser): Promise<User> {
    const existingUser = await this.getUserByUsername(userData.username);
    if (existingUser) {
      const updatedUser: User = { ...existingUser, ...userData };
      this.users.set(parseInt(existingUser.id), updatedUser);
      return updatedUser;
    } else {
      return this.createUser(userData);
    }
  }

  // Supplier methods
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplierById(id: number): Promise<Supplier | null> {
    return this.suppliers.get(id) || null;
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const id = this.supplierCurrentId++;
    const now = new Date().toISOString();
    const newSupplier: Supplier = {
      ...supplier,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.suppliers.set(id, newSupplier);
    return newSupplier;
  }

  async updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | null> {
    const existingSupplier = this.suppliers.get(id);
    if (!existingSupplier) {
      return null;
    }
    const updatedSupplier: Supplier = {
      ...existingSupplier,
      ...supplier,
      updatedAt: new Date().toISOString()
    };
    this.suppliers.set(id, updatedSupplier);
    return updatedSupplier;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Customer methods
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomerById(id: number): Promise<Customer | null> {
    return this.customers.get(id) || null;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const id = this.customerCurrentId++;
    const now = new Date().toISOString();
    const newCustomer: Customer = {
      ...customer,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.customers.set(id, newCustomer);
    return newCustomer;
  }

  async updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | null> {
    const existingCustomer = this.customers.get(id);
    if (!existingCustomer) {
      return null;
    }
    const updatedCustomer: Customer = {
      ...existingCustomer,
      ...customer,
      updatedAt: new Date().toISOString()
    };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    return this.customers.delete(id);
  }

  // Invoice methods
  async getInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values());
  }

  async getInvoiceById(id: number): Promise<Invoice | null> {
    return this.invoices.get(id) || null;
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const id = this.invoiceCurrentId++;
    const now = new Date().toISOString();
    const newInvoice: Invoice = {
      ...invoice,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.invoices.set(id, newInvoice);
    return newInvoice;
  }

  async updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice | null> {
    const existingInvoice = this.invoices.get(id);
    if (!existingInvoice) {
      return null;
    }
    const updatedInvoice: Invoice = {
      ...existingInvoice,
      ...invoice,
      updatedAt: new Date().toISOString()
    };
    this.invoices.set(id, updatedInvoice);
    return updatedInvoice;
  }

  async deleteInvoice(id: number): Promise<boolean> {
    return this.invoices.delete(id);
  }

  async getInvoiceWithInstallments(id: number): Promise<{ invoice: Invoice; installments: Installment[] } | null> {
    const invoice = await this.getInvoiceById(id);
    if (!invoice) {
      return null;
    }
    const installments = await this.getInstallmentsByInvoiceId(id);
    return { invoice, installments };
  }

  // Receivable methods
  async getReceivables(): Promise<Receivable[]> {
    return Array.from(this.receivables.values());
  }

  async getReceivableById(id: number): Promise<Receivable | null> {
    return this.receivables.get(id) || null;
  }

  async createReceivable(receivable: InsertReceivable): Promise<Receivable> {
    const id = this.receivableCurrentId++;
    const now = new Date().toISOString();
    const newReceivable: Receivable = {
      ...receivable,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.receivables.set(id, newReceivable);
    return newReceivable;
  }

  async updateReceivable(id: number, receivable: Partial<InsertReceivable>): Promise<Receivable | null> {
    const existingReceivable = this.receivables.get(id);
    if (!existingReceivable) {
      return null;
    }
    const updatedReceivable: Receivable = {
      ...existingReceivable,
      ...receivable,
      updatedAt: new Date().toISOString()
    };
    this.receivables.set(id, updatedReceivable);
    return updatedReceivable;
  }

  async deleteReceivable(id: number): Promise<boolean> {
    return this.receivables.delete(id);
  }

  async getReceivableWithInstallments(id: number): Promise<{ receivable: Receivable; installments: ReceivableInstallment[] } | null> {
    const receivable = await this.getReceivableById(id);
    if (!receivable) {
      return null;
    }
    const installments = await this.getReceivableInstallmentsByReceivableId(id);
    return { receivable, installments };
  }

  // Installment methods
  async getInstallments(): Promise<Installment[]> {
    return Array.from(this.installments.values());
  }

  async getInstallmentById(id: number): Promise<Installment | null> {
    return this.installments.get(id) || null;
  }

  async getInstallmentsByInvoiceId(invoiceId: number): Promise<Installment[]> {
    return Array.from(this.installments.values()).filter(
      installment => installment.invoiceId === invoiceId
    );
  }

  async createInstallment(installment: InsertInstallment): Promise<Installment> {
    const id = this.installmentCurrentId++;
    const now = new Date().toISOString();
    const newInstallment: Installment = {
      ...installment,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.installments.set(id, newInstallment);
    return newInstallment;
  }

  async updateInstallment(id: number, installment: Partial<InsertInstallment>): Promise<Installment | null> {
    const existingInstallment = this.installments.get(id);
    if (!existingInstallment) {
      return null;
    }
    const updatedInstallment: Installment = {
      ...existingInstallment,
      ...installment,
      updatedAt: new Date().toISOString()
    };
    this.installments.set(id, updatedInstallment);
    return updatedInstallment;
  }

  // Receivable Installment methods
  async getReceivableInstallments(): Promise<ReceivableInstallment[]> {
    return Array.from(this.receivableInstallments.values());
  }

  async getReceivableInstallmentById(id: number): Promise<ReceivableInstallment | null> {
    return this.receivableInstallments.get(id) || null;
  }

  async getReceivableInstallmentsByReceivableId(receivableId: number): Promise<ReceivableInstallment[]> {
    return Array.from(this.receivableInstallments.values()).filter(
      installment => installment.receivableId === receivableId
    );
  }

  async createReceivableInstallment(installment: InsertReceivableInstallment): Promise<ReceivableInstallment> {
    const id = this.receivableInstallmentCurrentId++;
    const now = new Date().toISOString();
    const newInstallment: ReceivableInstallment = {
      ...installment,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.receivableInstallments.set(id, newInstallment);
    return newInstallment;
  }

  async updateReceivableInstallment(id: number, installment: Partial<InsertReceivableInstallment>): Promise<ReceivableInstallment | null> {
    const existingInstallment = this.receivableInstallments.get(id);
    if (!existingInstallment) {
      return null;
    }
    const updatedInstallment: ReceivableInstallment = {
      ...existingInstallment,
      ...installment,
      updatedAt: new Date().toISOString()
    };
    this.receivableInstallments.set(id, updatedInstallment);
    return updatedInstallment;
  }

  // Bank Transaction methods
  async getBankTransactions(from?: string, to?: string, type?: string): Promise<BankTransaction[]> {
    let transactions = Array.from(this.bankTransactions.values());
    
    if (from) {
      const fromDate = new Date(from);
      transactions = transactions.filter(t => new Date(t.transactionDate) >= fromDate);
    }
    
    if (to) {
      const toDate = new Date(to);
      transactions = transactions.filter(t => new Date(t.transactionDate) <= toDate);
    }
    
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }
    
    return transactions;
  }

  async createBankTransaction(transaction: InsertBankTransaction): Promise<BankTransaction> {
    const id = this.bankTransactionCurrentId++;
    const now = new Date().toISOString();
    const newTransaction: BankTransaction = {
      ...transaction,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.bankTransactions.set(id, newTransaction);
    return newTransaction;
  }

  // Dashboard methods
  async getStats(): Promise<{
    supplierCount: number;
    customerCount: number;
    invoiceCount: number;
    receivableCount: number;
    pendingInvoiceAmount: number;
    pendingReceivableAmount: number;
  }> {
    const suppliers = await this.getSuppliers();
    const customers = await this.getCustomers();
    const invoices = await this.getInvoices();
    const receivables = await this.getReceivables();
    
    const pendingInvoices = invoices.filter(invoice => invoice.status === "pending" || invoice.status === "partial");
    const pendingReceivables = receivables.filter(receivable => receivable.status === "pending" || receivable.status === "partial");
    
    const pendingInvoiceAmount = pendingInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    const pendingReceivableAmount = pendingReceivables.reduce((sum, receivable) => sum + receivable.amount, 0);
    
    return {
      supplierCount: suppliers.length,
      customerCount: customers.length,
      invoiceCount: invoices.length,
      receivableCount: receivables.length,
      pendingInvoiceAmount,
      pendingReceivableAmount
    };
  }

  async getPaymentsByMonth(): Promise<{ month: string; amount: number }[]> {
    const installments = await this.getInstallments();
    const receivableInstallments = await this.getReceivableInstallments();
    
    const paymentsByMonth: Map<string, number> = new Map();
    
    // Process supplier payments (negative amounts)
    installments.forEach(installment => {
      if (installment.paymentDate) {
        const date = new Date(installment.paymentDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const currentAmount = paymentsByMonth.get(monthKey) || 0;
        paymentsByMonth.set(monthKey, currentAmount - installment.amount);
      }
    });
    
    // Process customer payments (positive amounts)
    receivableInstallments.forEach(installment => {
      if (installment.paymentDate) {
        const date = new Date(installment.paymentDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const currentAmount = paymentsByMonth.get(monthKey) || 0;
        paymentsByMonth.set(monthKey, currentAmount + installment.amount);
      }
    });
    
    // Convert to array and sort by month
    const result: { month: string; amount: number }[] = [];
    paymentsByMonth.forEach((amount, month) => {
      result.push({ month, amount });
    });
    
    return result.sort((a, b) => a.month.localeCompare(b.month));
  }

  async getSupplierDistribution(): Promise<{ supplier: string; amount: number }[]> {
    const invoices = await this.getInvoices();
    const suppliers = await this.getSuppliers();
    
    const supplierAmounts: Map<number, number> = new Map();
    
    invoices.forEach(invoice => {
      const currentAmount = supplierAmounts.get(invoice.supplierId) || 0;
      supplierAmounts.set(invoice.supplierId, currentAmount + invoice.amount);
    });
    
    const result: { supplier: string; amount: number }[] = [];
    supplierAmounts.forEach((amount, supplierId) => {
      const supplier = suppliers.find(s => s.id === supplierId);
      if (supplier) {
        result.push({ supplier: supplier.name, amount });
      }
    });
    
    return result.sort((a, b) => b.amount - a.amount);
  }

  async getPendingInvoices(): Promise<Invoice[]> {
    const invoices = await this.getInvoices();
    return invoices.filter(invoice => invoice.status === "pending" || invoice.status === "partial");
  }

  async getRecentActivities(): Promise<Activity[]> {
    const activities = Array.from(this.activities.values());
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);
  }

  // Activity methods
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.activityCurrentId++;
    const now = new Date().toISOString();
    const newActivity: Activity = {
      ...activity,
      id,
      timestamp: now
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  // Financial situation methods
  async getFinancialSituation(type?: string): Promise<any[]> {
    const bankTransactions = await this.getBankTransactions();
    
    if (type) {
      return bankTransactions.filter(transaction => transaction.type === type);
    }
    
    return bankTransactions;
  }
}
