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
