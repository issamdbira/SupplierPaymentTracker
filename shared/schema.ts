import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, pgEnum, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: text("sess").notNull(),
    expire: timestamp("expire").notNull(),
  }
);

// User Schema
export const users = pgTable("users", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  username: true,
  password: true,
  fullName: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
});

// Supplier Schema
export const suppliers = pgTable("suppliers", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSupplierSchema = createInsertSchema(suppliers).pick({
  name: true,
  email: true,
  phone: true,
  address: true,
  contactPerson: true,
  category: true,
  taxId: true,
  bankInfo: true,
  notes: true,
});

// Customer Schema
export const customers = pgTable("customers", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCustomerSchema = createInsertSchema(customers).pick({
  name: true,
  email: true,
  phone: true,
  address: true,
  contactPerson: true,
  category: true,
  taxId: true,
  bankInfo: true,
  notes: true,
});

// Invoice Status Enum
export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "pending",
  "paid",
  "partial",
  "cancelled",
]);

// Payment Method Enum
export const paymentMethodEnum = pgEnum("payment_method", [
  "check",
  "transfer",
  "draft",
  "cash",
  "card",
]);

// Invoice Type Enum
export const invoiceTypeEnum = pgEnum("invoice_type", [
  "purchase", // Facture d'achat
  "sale",     // Facture de vente
]);

// Invoice Schema (Supplier Payments)
export const invoices = pgTable("invoices", {
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
  // Champ pour l'intégration future avec le stock
  affectsStock: boolean("affects_stock").default(true),
  type: text("type").notNull().default("purchase"), // purchase = achat
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInvoiceSchema = createInsertSchema(invoices).pick({
  number: true,
  supplierId: true,
  amount: true,
  issueDate: true,
  dueDate: true,
  status: true,
  description: true,
  category: true,
  reference: true,
  attachmentUrl: true,
  affectsStock: true,
  type: true,
});

// Receivable Schema (Customer Payments)
export const receivables = pgTable("receivables", {
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
  // Champ pour l'intégration future avec le stock
  affectsStock: boolean("affects_stock").default(true),
  type: text("type").notNull().default("sale"), // sale = vente
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReceivableSchema = createInsertSchema(receivables).pick({
  number: true,
  customerId: true,
  amount: true,
  issueDate: true,
  dueDate: true,
  status: true,
  description: true,
  category: true,
  reference: true,
  attachmentUrl: true,
  affectsStock: true,
  type: true,
});

// Payment Installment Schema (For Supplier Payments)
export const installments = pgTable("installments", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInstallmentSchema = createInsertSchema(installments).pick({
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
  notes: true,
});

// Bank Transaction Schema
export const bankTransactions = pgTable("bank_transactions", {
  id: serial("id").primaryKey(),
  accountId: text("account_id").notNull(),
  transactionDate: timestamp("transaction_date").notNull(),
  amount: doublePrecision("amount").notNull(),
  description: text("description"),
  reference: text("reference"),
  type: text("type").notNull(), // credit, debit
  category: text("category"),
  matchedEntityType: text("matched_entity_type"), // invoice, receivable, etc.
  matchedEntityId: integer("matched_entity_id"),
  isMatched: boolean("is_matched").default(false),
  importBatch: text("import_batch"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBankTransactionSchema = createInsertSchema(bankTransactions).pick({
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
  importBatch: true,
});

// Activity Schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: integer("resource_id"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  details: text("details"),
  metadata: text("metadata"),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  action: true,
  resourceType: true,
  resourceId: true,
  details: true,
  metadata: true,
});

// Schéma pour les produits (préparation pour le module stock)
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  description: text("description"),
  category: text("category"),
  price: doublePrecision("price").notNull(),
  cost: doublePrecision("cost"),
  currentStock: integer("current_stock").default(0),
  minStock: integer("min_stock").default(0),
  unit: text("unit").default("unité"),
  supplierId: integer("supplier_id"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  sku: true,
  description: true,
  category: true,
  price: true,
  cost: true,
  currentStock: true,
  minStock: true,
  unit: true,
  supplierId: true,
  imageUrl: true,
  isActive: true,
});

// Schéma pour les mouvements de stock (préparation pour le module stock)
export const stockMovements = pgTable("stock_movements", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  type: text("type").notNull(), // in, out
  reason: text("reason").notNull(), // purchase, sale, adjustment, return
  sourceDocumentType: text("source_document_type"), // invoice, receivable
  sourceDocumentId: integer("source_document_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by"),
});

export const insertStockMovementSchema = createInsertSchema(stockMovements).pick({
  productId: true,
  quantity: true,
  type: true,
  reason: true,
  sourceDocumentType: true,
  sourceDocumentId: true,
  notes: true,
  createdBy: true,
});

// Schéma pour les lignes de facture (préparation pour le module stock)
export const invoiceLines = pgTable("invoice_lines", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull(),
  productId: integer("product_id").notNull(),
  description: text("description"),
  quantity: doublePrecision("quantity").notNull(),
  unitPrice: doublePrecision("unit_price").notNull(),
  totalPrice: doublePrecision("total_price").notNull(),
  taxRate: doublePrecision("tax_rate").default(0),
  taxAmount: doublePrecision("tax_amount").default(0),
  discount: doublePrecision("discount").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInvoiceLineSchema = createInsertSchema(invoiceLines).pick({
  invoiceId: true,
  productId: true,
  description: true,
  quantity: true,
  unitPrice: true,
  totalPrice: true,
  taxRate: true,
  taxAmount: true,
  discount: true,
});

// Schéma pour les lignes de facture client (préparation pour le module stock)
export const receivableLines = pgTable("receivable_lines", {
  id: serial("id").primaryKey(),
  receivableId: integer("receivable_id").notNull(),
  productId: integer("product_id").notNull(),
  description: text("description"),
  quantity: doublePrecision("quantity").notNull(),
  unitPrice: doublePrecision("unit_price").notNull(),
  totalPrice: doublePrecision("total_price").notNull(),
  taxRate: doublePrecision("tax_rate").default(0),
  taxAmount: doublePrecision("tax_amount").default(0),
  discount: doublePrecision("discount").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReceivableLineSchema = createInsertSchema(receivableLines).pick({
  receivableId: true,
  productId: true,
  description: true,
  quantity: true,
  unitPrice: true,
  totalPrice: true,
  taxRate: true,
  taxAmount: true,
  discount: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type Receivable = typeof receivables.$inferSelect;
export type InsertReceivable = z.infer<typeof insertReceivableSchema>;

export type Installment = typeof installments.$inferSelect;
export type InsertInstallment = z.infer<typeof insertInstallmentSchema>;

export type BankTransaction = typeof bankTransactions.$inferSelect;
export type InsertBankTransaction = z.infer<typeof insertBankTransactionSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type StockMovement = typeof stockMovements.$inferSelect;
export type InsertStockMovement = z.infer<typeof insertStockMovementSchema>;

export type InvoiceLine = typeof invoiceLines.$inferSelect;
export type InsertInvoiceLine = z.infer<typeof insertInvoiceLineSchema>;

export type ReceivableLine = typeof receivableLines.$inferSelect;
export type InsertReceivableLine = z.infer<typeof insertReceivableLineSchema>;
