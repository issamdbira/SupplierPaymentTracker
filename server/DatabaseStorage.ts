import { 
  type User, type InsertUser, 
  type Supplier, type InsertSupplier,
  type Invoice, type InsertInvoice,
  type Installment, type InsertInstallment,
  type Activity, type InsertActivity,
  type Customer, type InsertCustomer,
  users, suppliers, invoices, installments, activities, customers,
  receivables, type Receivable, type InsertReceivable,
  bankTransactions, type BankTransaction, type InsertBankTransaction
} from "@shared/schema";
import { IStorage } from "./storage";
import { db } from "./db";
import { eq, desc, lte, gte, and, sql } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }
  
  async upsertUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Supplier methods
  async getSupplier(id: number): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier;
  }

  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers);
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const [createdSupplier] = await db.insert(suppliers).values(supplier).returning();
    return createdSupplier;
  }

  async updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const [updatedSupplier] = await db
      .update(suppliers)
      .set(supplier)
      .where(eq(suppliers.id, id))
      .returning();
    return updatedSupplier;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    await db.delete(suppliers).where(eq(suppliers.id, id));
    return true;
  }
  
  // Customer methods
  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers);
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [createdCustomer] = await db.insert(customers).values(customer).returning();
    return createdCustomer;
  }

  async updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const [updatedCustomer] = await db
      .update(customers)
      .set(customer)
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    await db.delete(customers).where(eq(customers.id, id));
    return true;
  }

  // Invoice methods
  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async getInvoiceWithInstallments(id: number): Promise<{invoice: Invoice, installments: Installment[]} | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    if (!invoice) return undefined;
    
    const installments = await db.select().from(installments).where(eq(installments.invoiceId, id));
    return { invoice, installments };
  }

  async getInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices);
  }

  async getPendingInvoices(): Promise<Invoice[]> {
    return await db
      .select()
      .from(invoices)
      .where(
        sql`${invoices.status} = 'pending' OR ${invoices.status} = 'partial'`
      );
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [createdInvoice] = await db.insert(invoices).values(invoice).returning();
    return createdInvoice;
  }

  async updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const [updatedInvoice] = await db
      .update(invoices)
      .set(invoice)
      .where(eq(invoices.id, id))
      .returning();
    return updatedInvoice;
  }

  async deleteInvoice(id: number): Promise<boolean> {
    // Delete all installments for this invoice
    await db.delete(installments).where(eq(installments.invoiceId, id));
    // Delete the invoice
    await db.delete(invoices).where(eq(invoices.id, id));
    return true;
  }

  // Receivable methods
  async getReceivable(id: number): Promise<Receivable | undefined> {
    const [receivable] = await db.select().from(receivables).where(eq(receivables.id, id));
    return receivable;
  }

  async getReceivables(): Promise<Receivable[]> {
    return await db.select().from(receivables);
  }

  async getPendingReceivables(): Promise<Receivable[]> {
    return await db
      .select()
      .from(receivables)
      .where(
        sql`${receivables.status} = 'pending' OR ${receivables.status} = 'partial'`
      );
  }

  async createReceivable(receivable: InsertReceivable): Promise<Receivable> {
    const [createdReceivable] = await db.insert(receivables).values(receivable).returning();
    return createdReceivable;
  }

  async updateReceivable(id: number, receivable: Partial<InsertReceivable>): Promise<Receivable | undefined> {
    const [updatedReceivable] = await db
      .update(receivables)
      .set(receivable)
      .where(eq(receivables.id, id))
      .returning();
    return updatedReceivable;
  }

  async deleteReceivable(id: number): Promise<boolean> {
    await db.delete(receivables).where(eq(receivables.id, id));
    return true;
  }

  // Installment methods
  async getInstallment(id: number): Promise<Installment | undefined> {
    const [installment] = await db.select().from(installments).where(eq(installments.id, id));
    return installment;
  }

  async getInstallmentsByInvoice(invoiceId: number): Promise<Installment[]> {
    return await db
      .select()
      .from(installments)
      .where(eq(installments.invoiceId, invoiceId))
      .orderBy(installments.installmentNumber);
  }

  async getUpcomingInstallments(): Promise<Installment[]> {
    return await db
      .select()
      .from(installments)
      .where(eq(installments.status, "pending"))
      .orderBy(installments.dueDate);
  }

  async createInstallment(installment: InsertInstallment): Promise<Installment> {
    const [createdInstallment] = await db.insert(installments).values(installment).returning();
    return createdInstallment;
  }

  async createInstallments(newInstallments: InsertInstallment[]): Promise<Installment[]> {
    if (newInstallments.length === 0) return [];
    
    const results = await db.insert(installments).values(newInstallments).returning();
    return results;
  }

  async updateInstallment(id: number, installment: Partial<InsertInstallment>): Promise<Installment | undefined> {
    const [updatedInstallment] = await db
      .update(installments)
      .set(installment)
      .where(eq(installments.id, id))
      .returning();
    return updatedInstallment;
  }

  async deleteInstallment(id: number): Promise<boolean> {
    await db.delete(installments).where(eq(installments.id, id));
    return true;
  }

  async deleteInstallmentsByInvoice(invoiceId: number): Promise<boolean> {
    await db.delete(installments).where(eq(installments.invoiceId, invoiceId));
    return true;
  }

  // Bank Transaction methods
  async getBankTransaction(id: number): Promise<BankTransaction | undefined> {
    const [transaction] = await db.select().from(bankTransactions).where(eq(bankTransactions.id, id));
    return transaction;
  }

  async getBankTransactions(from?: Date, to?: Date): Promise<BankTransaction[]> {
    if (from && to) {
      return await db
        .select()
        .from(bankTransactions)
        .where(and(
          gte(bankTransactions.transactionDate, from),
          lte(bankTransactions.transactionDate, to)
        ))
        .orderBy(desc(bankTransactions.transactionDate));
    }
    
    return await db
      .select()
      .from(bankTransactions)
      .orderBy(desc(bankTransactions.transactionDate));
  }

  async createBankTransaction(transaction: InsertBankTransaction): Promise<BankTransaction> {
    const [createdTransaction] = await db.insert(bankTransactions).values(transaction).returning();
    return createdTransaction;
  }

  async createBankTransactions(transactions: InsertBankTransaction[]): Promise<BankTransaction[]> {
    if (transactions.length === 0) return [];
    
    const results = await db.insert(bankTransactions).values(transactions).returning();
    return results;
  }

  async updateBankTransaction(id: number, transaction: Partial<InsertBankTransaction>): Promise<BankTransaction | undefined> {
    const [updatedTransaction] = await db
      .update(bankTransactions)
      .set(transaction)
      .where(eq(bankTransactions.id, id))
      .returning();
    return updatedTransaction;
  }

  async deleteBankTransaction(id: number): Promise<boolean> {
    await db.delete(bankTransactions).where(eq(bankTransactions.id, id));
    return true;
  }

  // Activity methods
  async getActivity(id: number): Promise<Activity | undefined> {
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity;
  }

  async getActivities(limit?: number): Promise<Activity[]> {
    const query = db
      .select()
      .from(activities)
      .orderBy(desc(activities.timestamp));
    
    if (limit) {
      return await query.limit(limit);
    }
    
    return await query;
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const activityWithTimestamp = {
      ...activity,
      timestamp: activity.timestamp || new Date()
    };
    const [createdActivity] = await db.insert(activities).values(activityWithTimestamp).returning();
    return createdActivity;
  }

  // Dashboard methods
  async getStats(): Promise<{
    invoiceCount: number;
    upcomingPayments: number;
    pendingAmount: number;
    dueInvoices: number;
    customerCount: number;
    receivableCount: number;
    pendingReceivableAmount: number;
  }> {
    // Get invoice counts
    const [{ count: invoiceCount }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(invoices);

    // Get upcoming installments count (pending status)
    const [{ count: upcomingPayments }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(installments)
      .where(eq(installments.status, "pending"));

    // Get pending invoices
    const pendingInvoicesResult = await db
      .select()
      .from(invoices)
      .where(
        sql`${invoices.status} = 'pending' OR ${invoices.status} = 'partial'`
      );

    // Calculate pending amount
    const pendingAmount = pendingInvoicesResult.reduce(
      (sum, invoice) => sum + Number(invoice.amount),
      0
    );

    // Calculate due invoices (due date within 7 days)
    const now = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(now.getDate() + 7);

    const dueInvoices = pendingInvoicesResult.filter(
      (invoice) => new Date(invoice.dueDate) <= oneWeekFromNow
    ).length;

    // Get customer count
    const [{ count: customerCount }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(customers);

    // Get receivable count
    const [{ count: receivableCount }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(receivables);

    // Get pending receivables
    const pendingReceivablesResult = await db
      .select()
      .from(receivables)
      .where(
        sql`${receivables.status} = 'pending' OR ${receivables.status} = 'partial'`
      );

    // Calculate pending receivable amount
    const pendingReceivableAmount = pendingReceivablesResult.reduce(
      (sum, receivable) => sum + Number(receivable.amount),
      0
    );

    return {
      invoiceCount,
      upcomingPayments,
      pendingAmount,
      dueInvoices,
      customerCount,
      receivableCount,
      pendingReceivableAmount,
    };
  }

  async getFinancialForecast(): Promise<{ month: string; amount: number }[]> {
    // Get current date
    const now = new Date();
    
    // Get upcoming installments
    const upcomingInstallments = await db
      .select()
      .from(installments)
      .where(eq(installments.status, "pending"));
    
    // Initialize result with next 6 months
    const result: { [key: string]: number } = {};
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(now.getMonth() + i);
      const monthKey = months[date.getMonth()] + " " + date.getFullYear();
      result[monthKey] = 0;
    }
    
    // Sum amounts by month
    for (const installment of upcomingInstallments) {
      const dueDate = new Date(installment.dueDate);
      const monthKey = months[dueDate.getMonth()] + " " + dueDate.getFullYear();
      
      if (result[monthKey] !== undefined) {
        result[monthKey] += Number(installment.amount);
      }
    }
    
    // Convert to array for API response
    return Object.entries(result).map(([month, amount]) => ({
      month,
      amount,
    }));
  }

  async getSupplierDistribution(): Promise<{ name: string; amount: number }[]> {
    // Get all suppliers
    const allSuppliers = await db.select().from(suppliers);
    
    // Get all invoices
    const allInvoices = await db.select().from(invoices);
    
    // Calculate total amount per supplier
    const supplierAmounts: { [supplierId: number]: number } = {};
    
    for (const invoice of allInvoices) {
      const supplierId = invoice.supplierId;
      
      if (!supplierAmounts[supplierId]) {
        supplierAmounts[supplierId] = 0;
      }
      
      supplierAmounts[supplierId] += Number(invoice.amount);
    }
    
    // Create result array with supplier names and amounts
    const result = allSuppliers
      .map((supplier) => ({
        name: supplier.name,
        amount: supplierAmounts[supplier.id] || 0,
      }))
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Get top 5 suppliers
    
    return result;
  }
  
  async getCustomerDistribution(): Promise<{ name: string; amount: number }[]> {
    // Get all customers
    const allCustomers = await db.select().from(customers);
    
    // Get all receivables
    const allReceivables = await db.select().from(receivables);
    
    // Calculate total amount per customer
    const customerAmounts: { [customerId: number]: number } = {};
    
    for (const receivable of allReceivables) {
      const customerId = receivable.customerId;
      
      if (!customerAmounts[customerId]) {
        customerAmounts[customerId] = 0;
      }
      
      customerAmounts[customerId] += Number(receivable.amount);
    }
    
    // Create result array with customer names and amounts
    const result = allCustomers
      .map((customer) => ({
        name: customer.name,
        amount: customerAmounts[customer.id] || 0,
      }))
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Get top 5 customers
    
    return result;
  }
  
  async getCashFlowForecast(): Promise<{ month: string; income: number; expense: number }[]> {
    // Get current date
    const now = new Date();
    
    // Initialize result with next 6 months
    const result: { [key: string]: { income: number; expense: number } } = {};
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(now.getMonth() + i);
      const monthKey = months[date.getMonth()] + " " + date.getFullYear();
      result[monthKey] = { income: 0, expense: 0 };
    }
    
    // Get upcoming installments for expenses
    const upcomingInstallments = await db
      .select()
      .from(installments)
      .where(eq(installments.status, "pending"));
    
    // Sum expense amounts by month
    for (const installment of upcomingInstallments) {
      const dueDate = new Date(installment.dueDate);
      const monthKey = months[dueDate.getMonth()] + " " + dueDate.getFullYear();
      
      if (result[monthKey] !== undefined) {
        result[monthKey].expense += Number(installment.amount);
      }
    }
    
    // TODO: Add logic for income from receivables when implemented
    
    // Convert to array for API response
    return Object.entries(result).map(([month, { income, expense }]) => ({
      month,
      income,
      expense,
    }));
  }
}