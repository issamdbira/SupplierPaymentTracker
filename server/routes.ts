import type { Express } from "express";
import { MemStorage } from "./storage";
const storage = new MemStorage();

export function setupRoutes(app: Express) {
  // User routes
  app.get("/api/users", async (req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });

  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUserById(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  });

  app.post("/api/users", async (req, res) => {
    const user = await storage.createUser(req.body);
    res.status(201).json(user);
  });

  // Supplier routes
  app.get("/api/suppliers", async (req, res) => {
    const suppliers = await storage.getSuppliers();
    res.json(suppliers);
  });

  app.get("/api/suppliers/:id", async (req, res) => {
    const supplier = await storage.getSupplierById(parseInt(req.params.id));
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.json(supplier);
  });

  app.post("/api/suppliers", async (req, res) => {
    const supplier = await storage.createSupplier(req.body);
    res.status(201).json(supplier);
  });

  app.put("/api/suppliers/:id", async (req, res) => {
    const supplier = await storage.updateSupplier(parseInt(req.params.id), req.body);
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.json(supplier);
  });

  app.delete("/api/suppliers/:id", async (req, res) => {
    const success = await storage.deleteSupplier(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.status(204).end();
  });

  // Customer routes
  app.get("/api/customers", async (req, res) => {
    const customers = await storage.getCustomers();
    res.json(customers);
  });

  app.get("/api/customers/:id", async (req, res) => {
    const customer = await storage.getCustomerById(parseInt(req.params.id));
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  });

  app.post("/api/customers", async (req, res) => {
    const customer = await storage.createCustomer(req.body);
    res.status(201).json(customer);
  });

  app.put("/api/customers/:id", async (req, res) => {
    const customer = await storage.updateCustomer(parseInt(req.params.id), req.body);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  });

  app.delete("/api/customers/:id", async (req, res) => {
    const success = await storage.deleteCustomer(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(204).end();
  });

  // Invoice routes
  app.get("/api/invoices", async (req, res) => {
    const invoices = await storage.getInvoices();
    res.json(invoices);
  });

  app.get("/api/invoices/:id", async (req, res) => {
    const invoice = await storage.getInvoiceById(parseInt(req.params.id));
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json(invoice);
  });

  app.post("/api/invoices", async (req, res) => {
    const invoice = await storage.createInvoice(req.body);
    res.status(201).json(invoice);
  });

  app.put("/api/invoices/:id", async (req, res) => {
    const invoice = await storage.updateInvoice(parseInt(req.params.id), req.body);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json(invoice);
  });

  app.delete("/api/invoices/:id", async (req, res) => {
    const success = await storage.deleteInvoice(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.status(204).end();
  });

  // Receivable routes
  app.get("/api/receivables", async (req, res) => {
    const receivables = await storage.getReceivables();
    res.json(receivables);
  });

  app.get("/api/receivables/:id", async (req, res) => {
    const receivable = await storage.getReceivableById(parseInt(req.params.id));
    if (!receivable) {
      return res.status(404).json({ error: "Receivable not found" });
    }
    res.json(receivable);
  });

  app.post("/api/receivables", async (req, res) => {
    const receivable = await storage.createReceivable(req.body);
    res.status(201).json(receivable);
  });

  app.put("/api/receivables/:id", async (req, res) => {
    const receivable = await storage.updateReceivable(parseInt(req.params.id), req.body);
    if (!receivable) {
      return res.status(404).json({ error: "Receivable not found" });
    }
    res.json(receivable);
  });

  app.delete("/api/receivables/:id", async (req, res) => {
    const success = await storage.deleteReceivable(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ error: "Receivable not found" });
    }
    res.status(204).end();
  });

  // Installment routes
  app.get("/api/installments", async (req, res) => {
    const installments = await storage.getInstallments();
    res.json(installments);
  });

  app.get("/api/installments/:id", async (req, res) => {
    const installment = await storage.getInstallmentById(parseInt(req.params.id));
    if (!installment) {
      return res.status(404).json({ error: "Installment not found" });
    }
    res.json(installment);
  });

  app.post("/api/installments", async (req, res) => {
    const installment = await storage.createInstallment(req.body);
    res.status(201).json(installment);
  });

  app.put("/api/installments/:id", async (req, res) => {
    const installment = await storage.updateInstallment(parseInt(req.params.id), req.body);
    if (!installment) {
      return res.status(404).json({ error: "Installment not found" });
    }
    res.json(installment);
  });

  // Receivable Installment routes
  app.get("/api/receivable-installments", async (req, res) => {
    const installments = await storage.getReceivableInstallments();
    res.json(installments);
  });

  app.get("/api/receivable-installments/:id", async (req, res) => {
    const installment = await storage.getReceivableInstallmentById(parseInt(req.params.id));
    if (!installment) {
      return res.status(404).json({ error: "Receivable installment not found" });
    }
    res.json(installment);
  });

  app.post("/api/receivable-installments", async (req, res) => {
    const installment = await storage.createReceivableInstallment(req.body);
    res.status(201).json(installment);
  });

  app.put("/api/receivable-installments/:id", async (req, res) => {
    const installment = await storage.updateReceivableInstallment(parseInt(req.params.id), req.body);
    if (!installment) {
      return res.status(404).json({ error: "Receivable installment not found" });
    }
    res.json(installment);
  });

  // Bank Transaction routes
  app.get("/api/bank-transactions", async (req, res) => {
    const { from, to, type } = req.query;
    const bankTransactions = await storage.getBankTransactions(
      from as string,
      to as string,
      type as string
    );
    res.json(bankTransactions);
  });

  app.post("/api/bank-transactions", async (req, res) => {
    const bankTransaction = await storage.createBankTransaction(req.body);
    res.status(201).json(bankTransaction);
  });

  // Dashboard routes
  app.get("/api/dashboard/stats", async (req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  app.get("/api/dashboard/payments-by-month", async (req, res) => {
    const paymentsByMonth = await storage.getPaymentsByMonth();
    res.json(paymentsByMonth);
  });

  app.get("/api/dashboard/supplier-distribution", async (req, res) => {
    const supplierDistribution = await storage.getSupplierDistribution();
    res.json(supplierDistribution);
  });

  app.get("/api/dashboard/pending-invoices", async (req, res) => {
    const pendingInvoices = await storage.getPendingInvoices();
    res.json(pendingInvoices);
  });

  app.get("/api/dashboard/recent-activities", async (req, res) => {
    const recentActivities = await storage.getRecentActivities();
    res.json(recentActivities);
  });

  // Activity routes
  app.post("/api/activities", async (req, res) => {
    const activity = await storage.createActivity(req.body);
    res.status(201).json(activity);
  });

  // Financial situation routes
  app.get("/api/financial-situation", async (req, res) => {
    const { type } = req.query;
    const transactions = await storage.getFinancialSituation(type as string);
    res.json(transactions);
  });
}
