var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import dotenv2 from "dotenv";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  activities: () => activities,
  bankTransactions: () => bankTransactions,
  customers: () => customers,
  insertActivitySchema: () => insertActivitySchema,
  insertBankTransactionSchema: () => insertBankTransactionSchema,
  insertCustomerSchema: () => insertCustomerSchema,
  insertInstallmentSchema: () => insertInstallmentSchema,
  insertInvoiceSchema: () => insertInvoiceSchema,
  insertReceivableSchema: () => insertReceivableSchema,
  insertSupplierSchema: () => insertSupplierSchema,
  insertUserSchema: () => insertUserSchema,
  installments: () => installments,
  invoiceStatusEnum: () => invoiceStatusEnum,
  invoices: () => invoices,
  paymentMethodEnum: () => paymentMethodEnum,
  receivables: () => receivables,
  sessions: () => sessions,
  suppliers: () => suppliers,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, pgEnum, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: text("sess").notNull(),
    expire: timestamp("expire").notNull()
  }
);
var users = pgTable("users", {
  id: varchar("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"),
  fullName: text("full_name").notNull(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  id: true,
  username: true,
  password: true,
  fullName: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true
});
var suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  contactPerson: text("contact_person"),
  category: text("category"),
  taxId: text("tax_id"),
  bankInfo: text("bank_info"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertSupplierSchema = createInsertSchema(suppliers).pick({
  name: true,
  email: true,
  phone: true,
  address: true,
  contactPerson: true,
  category: true,
  taxId: true,
  bankInfo: true,
  notes: true
});
var customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  contactPerson: text("contact_person"),
  category: text("category"),
  taxId: text("tax_id"),
  bankInfo: text("bank_info"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertCustomerSchema = createInsertSchema(customers).pick({
  name: true,
  email: true,
  phone: true,
  address: true,
  contactPerson: true,
  category: true,
  taxId: true,
  bankInfo: true,
  notes: true
});
var invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "pending",
  "paid",
  "partial",
  "cancelled"
]);
var paymentMethodEnum = pgEnum("payment_method", [
  "check",
  "transfer",
  "draft",
  "cash",
  "card"
]);
var invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  number: text("number").notNull().unique(),
  supplierId: integer("supplier_id").notNull(),
  amount: doublePrecision("amount").notNull(),
  issueDate: timestamp("issue_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").notNull().default("pending"),
  description: text("description"),
  category: text("category"),
  reference: text("reference"),
  attachmentUrl: text("attachment_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertInvoiceSchema = createInsertSchema(invoices).pick({
  number: true,
  supplierId: true,
  amount: true,
  issueDate: true,
  dueDate: true,
  status: true,
  description: true,
  category: true,
  reference: true,
  attachmentUrl: true
});
var receivables = pgTable("receivables", {
  id: serial("id").primaryKey(),
  number: text("number").notNull().unique(),
  customerId: integer("customer_id").notNull(),
  amount: doublePrecision("amount").notNull(),
  issueDate: timestamp("issue_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").notNull().default("pending"),
  description: text("description"),
  category: text("category"),
  reference: text("reference"),
  attachmentUrl: text("attachment_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertReceivableSchema = createInsertSchema(receivables).pick({
  number: true,
  customerId: true,
  amount: true,
  issueDate: true,
  dueDate: true,
  status: true,
  description: true,
  category: true,
  reference: true,
  attachmentUrl: true
});
var installments = pgTable("installments", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull(),
  installmentNumber: integer("installment_number").notNull(),
  amount: doublePrecision("amount").notNull(),
  percentage: doublePrecision("percentage").notNull(),
  dueDate: timestamp("due_date").notNull(),
  paymentMethod: text("payment_method").notNull().default("transfer"),
  status: text("status").notNull().default("pending"),
  paymentDate: timestamp("payment_date"),
  reference: text("reference"),
  bankTransactionId: integer("bank_transaction_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertInstallmentSchema = createInsertSchema(installments).pick({
  invoiceId: true,
  installmentNumber: true,
  amount: true,
  percentage: true,
  dueDate: true,
  paymentMethod: true,
  status: true,
  paymentDate: true,
  reference: true,
  bankTransactionId: true,
  notes: true
});
var bankTransactions = pgTable("bank_transactions", {
  id: serial("id").primaryKey(),
  accountId: text("account_id").notNull(),
  transactionDate: timestamp("transaction_date").notNull(),
  amount: doublePrecision("amount").notNull(),
  description: text("description"),
  reference: text("reference"),
  type: text("type").notNull(),
  // credit, debit
  category: text("category"),
  matchedEntityType: text("matched_entity_type"),
  // invoice, receivable, etc.
  matchedEntityId: integer("matched_entity_id"),
  isMatched: boolean("is_matched").default(false),
  importBatch: text("import_batch"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertBankTransactionSchema = createInsertSchema(bankTransactions).pick({
  accountId: true,
  transactionDate: true,
  amount: true,
  description: true,
  reference: true,
  type: true,
  category: true,
  matchedEntityType: true,
  matchedEntityId: true,
  isMatched: true,
  importBatch: true
});
var activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: integer("resource_id"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  details: text("details"),
  metadata: text("metadata")
});
var insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  action: true,
  resourceType: true,
  resourceId: true,
  details: true,
  metadata: true
});

// server/db.ts
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });
console.log("DATABASE_URL =", process.env.DATABASE_URL);
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/DatabaseStorage.ts
import { eq, desc, lte, gte, and, sql } from "drizzle-orm";
var DatabaseStorage = class {
  // User methods
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(user) {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  // Supplier methods
  async getSupplier(id) {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier;
  }
  async getSuppliers() {
    return await db.select().from(suppliers);
  }
  async createSupplier(supplier) {
    const [createdSupplier] = await db.insert(suppliers).values(supplier).returning();
    return createdSupplier;
  }
  async updateSupplier(id, supplier) {
    const [updatedSupplier] = await db.update(suppliers).set(supplier).where(eq(suppliers.id, id)).returning();
    return updatedSupplier;
  }
  async deleteSupplier(id) {
    await db.delete(suppliers).where(eq(suppliers.id, id));
    return true;
  }
  // Customer methods
  async getCustomer(id) {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }
  async getCustomers() {
    return await db.select().from(customers);
  }
  async createCustomer(customer) {
    const [createdCustomer] = await db.insert(customers).values(customer).returning();
    return createdCustomer;
  }
  async updateCustomer(id, customer) {
    const [updatedCustomer] = await db.update(customers).set(customer).where(eq(customers.id, id)).returning();
    return updatedCustomer;
  }
  async deleteCustomer(id) {
    await db.delete(customers).where(eq(customers.id, id));
    return true;
  }
  // Invoice methods
  async getInvoice(id) {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }
  async getInvoiceWithInstallments(id) {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    if (!invoice) return void 0;
    const installments2 = await db.select().from(installments2).where(eq(installments2.invoiceId, id));
    return { invoice, installments: installments2 };
  }
  async getInvoices() {
    return await db.select().from(invoices);
  }
  async getPendingInvoices() {
    return await db.select().from(invoices).where(
      sql`${invoices.status} = 'pending' OR ${invoices.status} = 'partial'`
    );
  }
  async createInvoice(invoice) {
    const [createdInvoice] = await db.insert(invoices).values(invoice).returning();
    return createdInvoice;
  }
  async updateInvoice(id, invoice) {
    const [updatedInvoice] = await db.update(invoices).set(invoice).where(eq(invoices.id, id)).returning();
    return updatedInvoice;
  }
  async deleteInvoice(id) {
    await db.delete(installments).where(eq(installments.invoiceId, id));
    await db.delete(invoices).where(eq(invoices.id, id));
    return true;
  }
  // Receivable methods
  async getReceivable(id) {
    const [receivable] = await db.select().from(receivables).where(eq(receivables.id, id));
    return receivable;
  }
  async getReceivables() {
    return await db.select().from(receivables);
  }
  async getPendingReceivables() {
    return await db.select().from(receivables).where(
      sql`${receivables.status} = 'pending' OR ${receivables.status} = 'partial'`
    );
  }
  async createReceivable(receivable) {
    const [createdReceivable] = await db.insert(receivables).values(receivable).returning();
    return createdReceivable;
  }
  async updateReceivable(id, receivable) {
    const [updatedReceivable] = await db.update(receivables).set(receivable).where(eq(receivables.id, id)).returning();
    return updatedReceivable;
  }
  async deleteReceivable(id) {
    await db.delete(receivables).where(eq(receivables.id, id));
    return true;
  }
  // Installment methods
  async getInstallment(id) {
    const [installment] = await db.select().from(installments).where(eq(installments.id, id));
    return installment;
  }
  async getInstallmentsByInvoice(invoiceId) {
    return await db.select().from(installments).where(eq(installments.invoiceId, invoiceId)).orderBy(installments.installmentNumber);
  }
  async getUpcomingInstallments() {
    return await db.select().from(installments).where(eq(installments.status, "pending")).orderBy(installments.dueDate);
  }
  async createInstallment(installment) {
    const [createdInstallment] = await db.insert(installments).values(installment).returning();
    return createdInstallment;
  }
  async createInstallments(newInstallments) {
    if (newInstallments.length === 0) return [];
    const results = await db.insert(installments).values(newInstallments).returning();
    return results;
  }
  async updateInstallment(id, installment) {
    const [updatedInstallment] = await db.update(installments).set(installment).where(eq(installments.id, id)).returning();
    return updatedInstallment;
  }
  async deleteInstallment(id) {
    await db.delete(installments).where(eq(installments.id, id));
    return true;
  }
  async deleteInstallmentsByInvoice(invoiceId) {
    await db.delete(installments).where(eq(installments.invoiceId, invoiceId));
    return true;
  }
  // Bank Transaction methods
  async getBankTransaction(id) {
    const [transaction] = await db.select().from(bankTransactions).where(eq(bankTransactions.id, id));
    return transaction;
  }
  async getBankTransactions(from, to) {
    if (from && to) {
      return await db.select().from(bankTransactions).where(and(
        gte(bankTransactions.transactionDate, from),
        lte(bankTransactions.transactionDate, to)
      )).orderBy(desc(bankTransactions.transactionDate));
    }
    return await db.select().from(bankTransactions).orderBy(desc(bankTransactions.transactionDate));
  }
  async createBankTransaction(transaction) {
    const [createdTransaction] = await db.insert(bankTransactions).values(transaction).returning();
    return createdTransaction;
  }
  async createBankTransactions(transactions) {
    if (transactions.length === 0) return [];
    const results = await db.insert(bankTransactions).values(transactions).returning();
    return results;
  }
  async updateBankTransaction(id, transaction) {
    const [updatedTransaction] = await db.update(bankTransactions).set(transaction).where(eq(bankTransactions.id, id)).returning();
    return updatedTransaction;
  }
  async deleteBankTransaction(id) {
    await db.delete(bankTransactions).where(eq(bankTransactions.id, id));
    return true;
  }
  // Activity methods
  async getActivity(id) {
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity;
  }
  async getActivities(limit) {
    const query = db.select().from(activities).orderBy(desc(activities.timestamp));
    if (limit) {
      return await query.limit(limit);
    }
    return await query;
  }
  async createActivity(activity) {
    const activityWithTimestamp = {
      ...activity,
      timestamp: activity.timestamp || /* @__PURE__ */ new Date()
    };
    const [createdActivity] = await db.insert(activities).values(activityWithTimestamp).returning();
    return createdActivity;
  }
  // Dashboard methods
  async getStats() {
    const [{ count: invoiceCount }] = await db.select({ count: sql`count(*)` }).from(invoices);
    const [{ count: upcomingPayments }] = await db.select({ count: sql`count(*)` }).from(installments).where(eq(installments.status, "pending"));
    const pendingInvoicesResult = await db.select().from(invoices).where(
      sql`${invoices.status} = 'pending' OR ${invoices.status} = 'partial'`
    );
    const pendingAmount = pendingInvoicesResult.reduce(
      (sum, invoice) => sum + Number(invoice.amount),
      0
    );
    const now = /* @__PURE__ */ new Date();
    const oneWeekFromNow = /* @__PURE__ */ new Date();
    oneWeekFromNow.setDate(now.getDate() + 7);
    const dueInvoices = pendingInvoicesResult.filter(
      (invoice) => new Date(invoice.dueDate) <= oneWeekFromNow
    ).length;
    const [{ count: customerCount }] = await db.select({ count: sql`count(*)` }).from(customers);
    const [{ count: receivableCount }] = await db.select({ count: sql`count(*)` }).from(receivables);
    const pendingReceivablesResult = await db.select().from(receivables).where(
      sql`${receivables.status} = 'pending' OR ${receivables.status} = 'partial'`
    );
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
      pendingReceivableAmount
    };
  }
  async getFinancialForecast() {
    const now = /* @__PURE__ */ new Date();
    const upcomingInstallments = await db.select().from(installments).where(eq(installments.status, "pending"));
    const result = {};
    const months = ["janvier", "f\xE9vrier", "mars", "avril", "mai", "juin", "juillet", "ao\xFBt", "septembre", "octobre", "novembre", "d\xE9cembre"];
    for (let i = 0; i < 6; i++) {
      const date = /* @__PURE__ */ new Date();
      date.setMonth(now.getMonth() + i);
      const monthKey = months[date.getMonth()] + " " + date.getFullYear();
      result[monthKey] = 0;
    }
    for (const installment of upcomingInstallments) {
      const dueDate = new Date(installment.dueDate);
      const monthKey = months[dueDate.getMonth()] + " " + dueDate.getFullYear();
      if (result[monthKey] !== void 0) {
        result[monthKey] += Number(installment.amount);
      }
    }
    return Object.entries(result).map(([month, amount]) => ({
      month,
      amount
    }));
  }
  async getSupplierDistribution() {
    const allSuppliers = await db.select().from(suppliers);
    const allInvoices = await db.select().from(invoices);
    const supplierAmounts = {};
    for (const invoice of allInvoices) {
      const supplierId = invoice.supplierId;
      if (!supplierAmounts[supplierId]) {
        supplierAmounts[supplierId] = 0;
      }
      supplierAmounts[supplierId] += Number(invoice.amount);
    }
    const result = allSuppliers.map((supplier) => ({
      name: supplier.name,
      amount: supplierAmounts[supplier.id] || 0
    })).filter((item) => item.amount > 0).sort((a, b) => b.amount - a.amount).slice(0, 5);
    return result;
  }
  async getCustomerDistribution() {
    const allCustomers = await db.select().from(customers);
    const allReceivables = await db.select().from(receivables);
    const customerAmounts = {};
    for (const receivable of allReceivables) {
      const customerId = receivable.customerId;
      if (!customerAmounts[customerId]) {
        customerAmounts[customerId] = 0;
      }
      customerAmounts[customerId] += Number(receivable.amount);
    }
    const result = allCustomers.map((customer) => ({
      name: customer.name,
      amount: customerAmounts[customer.id] || 0
    })).filter((item) => item.amount > 0).sort((a, b) => b.amount - a.amount).slice(0, 5);
    return result;
  }
  async getCashFlowForecast() {
    const now = /* @__PURE__ */ new Date();
    const result = {};
    const months = ["janvier", "f\xE9vrier", "mars", "avril", "mai", "juin", "juillet", "ao\xFBt", "septembre", "octobre", "novembre", "d\xE9cembre"];
    for (let i = 0; i < 6; i++) {
      const date = /* @__PURE__ */ new Date();
      date.setMonth(now.getMonth() + i);
      const monthKey = months[date.getMonth()] + " " + date.getFullYear();
      result[monthKey] = { income: 0, expense: 0 };
    }
    const upcomingInstallments = await db.select().from(installments).where(eq(installments.status, "pending"));
    for (const installment of upcomingInstallments) {
      const dueDate = new Date(installment.dueDate);
      const monthKey = months[dueDate.getMonth()] + " " + dueDate.getFullYear();
      if (result[monthKey] !== void 0) {
        result[monthKey].expense += Number(installment.amount);
      }
    }
    return Object.entries(result).map(([month, { income, expense }]) => ({
      month,
      income,
      expense
    }));
  }
};

// server/storage.ts
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  const apiRouter = app2.route("/api");
  app2.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });
  app2.get("/api/dashboard/forecast", async (req, res) => {
    try {
      const forecast = await storage.getFinancialForecast();
      res.json(forecast);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial forecast" });
    }
  });
  app2.get("/api/dashboard/supplier-distribution", async (req, res) => {
    try {
      const data = await storage.getSupplierDistribution();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplier distribution" });
    }
  });
  app2.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers2 = await storage.getSuppliers();
      res.json(suppliers2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });
  app2.get("/api/suppliers/:id", async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      if (isNaN(supplierId)) {
        return res.status(400).json({ message: "Invalid supplier ID" });
      }
      const supplier = await storage.getSupplier(supplierId);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplier" });
    }
  });
  app2.post("/api/suppliers", async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      await storage.createActivity({
        userId: 1,
        // Assuming admin user for now
        action: "create",
        resourceType: "supplier",
        resourceId: supplier.id,
        details: `a cr\xE9\xE9 un nouveau fournisseur ${supplier.name}`
      });
      res.status(201).json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid supplier data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create supplier" });
    }
  });
  app2.put("/api/suppliers/:id", async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      if (isNaN(supplierId)) {
        return res.status(400).json({ message: "Invalid supplier ID" });
      }
      const validatedData = insertSupplierSchema.partial().parse(req.body);
      const updatedSupplier = await storage.updateSupplier(supplierId, validatedData);
      if (!updatedSupplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      await storage.createActivity({
        userId: 1,
        // Assuming admin user for now
        action: "update",
        resourceType: "supplier",
        resourceId: supplierId,
        details: `a modifi\xE9 le fournisseur ${updatedSupplier.name}`
      });
      res.json(updatedSupplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid supplier data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update supplier" });
    }
  });
  app2.delete("/api/suppliers/:id", async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      if (isNaN(supplierId)) {
        return res.status(400).json({ message: "Invalid supplier ID" });
      }
      const supplier = await storage.getSupplier(supplierId);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      const result = await storage.deleteSupplier(supplierId);
      await storage.createActivity({
        userId: 1,
        // Assuming admin user for now
        action: "delete",
        resourceType: "supplier",
        resourceId: supplierId,
        details: `a supprim\xE9 le fournisseur ${supplier.name}`
      });
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete supplier" });
    }
  });
  app2.get("/api/invoices", async (req, res) => {
    try {
      const invoices2 = await storage.getInvoices();
      res.json(invoices2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });
  app2.get("/api/invoices/pending", async (req, res) => {
    try {
      const invoices2 = await storage.getPendingInvoices();
      res.json(invoices2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending invoices" });
    }
  });
  app2.get("/api/invoices/:id", async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      if (isNaN(invoiceId)) {
        return res.status(400).json({ message: "Invalid invoice ID" });
      }
      const invoice = await storage.getInvoice(invoiceId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });
  app2.get("/api/invoices/:id/with-installments", async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      if (isNaN(invoiceId)) {
        return res.status(400).json({ message: "Invalid invoice ID" });
      }
      const data = await storage.getInvoiceWithInstallments(invoiceId);
      if (!data) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoice with installments" });
    }
  });
  app2.post("/api/invoices", async (req, res) => {
    try {
      const validatedData = insertInvoiceSchema.parse(req.body);
      const supplier = await storage.getSupplier(validatedData.supplierId);
      if (!supplier) {
        return res.status(400).json({ message: "Supplier does not exist" });
      }
      const invoice = await storage.createInvoice(validatedData);
      await storage.createActivity({
        userId: 1,
        // Assuming admin user for now
        action: "create",
        resourceType: "invoice",
        resourceId: invoice.id,
        details: `a ajout\xE9 une nouvelle facture ${invoice.number} de ${supplier.name}`
      });
      res.status(201).json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid invoice data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });
  app2.put("/api/invoices/:id", async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      if (isNaN(invoiceId)) {
        return res.status(400).json({ message: "Invalid invoice ID" });
      }
      const validatedData = insertInvoiceSchema.partial().parse(req.body);
      const updatedInvoice = await storage.updateInvoice(invoiceId, validatedData);
      if (!updatedInvoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      await storage.createActivity({
        userId: 1,
        // Assuming admin user for now
        action: "update",
        resourceType: "invoice",
        resourceId: invoiceId,
        details: `a modifi\xE9 la facture ${updatedInvoice.number}`
      });
      res.json(updatedInvoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid invoice data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update invoice" });
    }
  });
  app2.delete("/api/invoices/:id", async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      if (isNaN(invoiceId)) {
        return res.status(400).json({ message: "Invalid invoice ID" });
      }
      const invoice = await storage.getInvoice(invoiceId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      const result = await storage.deleteInvoice(invoiceId);
      await storage.createActivity({
        userId: 1,
        // Assuming admin user for now
        action: "delete",
        resourceType: "invoice",
        resourceId: invoiceId,
        details: `a supprim\xE9 la facture ${invoice.number}`
      });
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete invoice" });
    }
  });
  app2.get("/api/installments", async (req, res) => {
    try {
      const invoiceId = req.query.invoiceId;
      if (invoiceId) {
        const id = parseInt(invoiceId);
        if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid invoice ID" });
        }
        const installments2 = await storage.getInstallmentsByInvoice(id);
        res.json(installments2);
      } else {
        const installments2 = await storage.getUpcomingInstallments();
        res.json(installments2);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch installments" });
    }
  });
  app2.post("/api/installments", async (req, res) => {
    try {
      if (!Array.isArray(req.body)) {
        const validatedData = insertInstallmentSchema.parse(req.body);
        const invoice2 = await storage.getInvoice(validatedData.invoiceId);
        if (!invoice2) {
          return res.status(400).json({ message: "Invoice does not exist" });
        }
        const installment = await storage.createInstallment(validatedData);
        await storage.createActivity({
          userId: 1,
          // Assuming admin user for now
          action: "create",
          resourceType: "installment",
          resourceId: installment.id,
          details: `a cr\xE9\xE9 un \xE9ch\xE9ancier pour la facture ${invoice2.number}`
        });
        return res.status(201).json(installment);
      }
      const validatedDataArray = z.array(insertInstallmentSchema).parse(req.body);
      if (validatedDataArray.length === 0) {
        return res.status(400).json({ message: "No installments provided" });
      }
      const invoiceId = validatedDataArray[0].invoiceId;
      const invoice = await storage.getInvoice(invoiceId);
      if (!invoice) {
        return res.status(400).json({ message: "Invoice does not exist" });
      }
      await storage.deleteInstallmentsByInvoice(invoiceId);
      const installments2 = await storage.createInstallments(validatedDataArray);
      await storage.updateInvoice(invoiceId, { status: "partial" });
      await storage.createActivity({
        userId: 1,
        // Assuming admin user for now
        action: "create",
        resourceType: "payment_plan",
        resourceId: invoiceId,
        details: `a cr\xE9\xE9 un plan de paiement pour la facture ${invoice.number}`
      });
      res.status(201).json(installments2);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid installment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create installments" });
    }
  });
  app2.put("/api/installments/:id", async (req, res) => {
    try {
      const installmentId = parseInt(req.params.id);
      if (isNaN(installmentId)) {
        return res.status(400).json({ message: "Invalid installment ID" });
      }
      const validatedData = insertInstallmentSchema.partial().parse(req.body);
      const updatedInstallment = await storage.updateInstallment(installmentId, validatedData);
      if (!updatedInstallment) {
        return res.status(404).json({ message: "Installment not found" });
      }
      await storage.createActivity({
        userId: 1,
        // Assuming admin user for now
        action: "update",
        resourceType: "installment",
        resourceId: installmentId,
        details: `a modifi\xE9 l'\xE9ch\xE9ance ${updatedInstallment.installmentNumber} de la facture ${updatedInstallment.invoiceId}`
      });
      res.json(updatedInstallment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid installment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update installment" });
    }
  });
  app2.get("/api/activities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
      if (limit !== void 0 && isNaN(limit)) {
        return res.status(400).json({ message: "Invalid limit parameter" });
      }
      const activities2 = await storage.getActivities(limit);
      res.json(activities2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });
  app2.post("/api/activities", async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid activity data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create activity" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
dotenv2.config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
