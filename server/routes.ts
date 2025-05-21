import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertInstallmentSchema, insertSupplierSchema, insertInvoiceSchema, insertActivitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = app.route('/api');

  // Dashboard endpoints
  app.get('/api/dashboard/stats', async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch dashboard stats' });
    }
  });

  app.get('/api/dashboard/forecast', async (req, res) => {
    try {
      const forecast = await storage.getFinancialForecast();
      res.json(forecast);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch financial forecast' });
    }
  });

  app.get('/api/dashboard/supplier-distribution', async (req, res) => {
    try {
      const data = await storage.getSupplierDistribution();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch supplier distribution' });
    }
  });

  // Supplier endpoints
  app.get('/api/suppliers', async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch suppliers' });
    }
  });

  app.get('/api/suppliers/:id', async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      if (isNaN(supplierId)) {
        return res.status(400).json({ message: 'Invalid supplier ID' });
      }

      const supplier = await storage.getSupplier(supplierId);
      if (!supplier) {
        return res.status(404).json({ message: 'Supplier not found' });
      }

      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch supplier' });
    }
  });

  app.post('/api/suppliers', async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      
      // Log activity
      await storage.createActivity({
        userId: 1, // Assuming admin user for now
        action: 'create',
        resourceType: 'supplier',
        resourceId: supplier.id,
        details: `a créé un nouveau fournisseur ${supplier.name}`
      });
      
      res.status(201).json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid supplier data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create supplier' });
    }
  });

  app.put('/api/suppliers/:id', async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      if (isNaN(supplierId)) {
        return res.status(400).json({ message: 'Invalid supplier ID' });
      }

      const validatedData = insertSupplierSchema.partial().parse(req.body);
      const updatedSupplier = await storage.updateSupplier(supplierId, validatedData);
      
      if (!updatedSupplier) {
        return res.status(404).json({ message: 'Supplier not found' });
      }
      
      // Log activity
      await storage.createActivity({
        userId: 1, // Assuming admin user for now
        action: 'update',
        resourceType: 'supplier',
        resourceId: supplierId,
        details: `a modifié le fournisseur ${updatedSupplier.name}`
      });
      
      res.json(updatedSupplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid supplier data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update supplier' });
    }
  });

  app.delete('/api/suppliers/:id', async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      if (isNaN(supplierId)) {
        return res.status(400).json({ message: 'Invalid supplier ID' });
      }

      const supplier = await storage.getSupplier(supplierId);
      if (!supplier) {
        return res.status(404).json({ message: 'Supplier not found' });
      }

      const result = await storage.deleteSupplier(supplierId);
      
      // Log activity
      await storage.createActivity({
        userId: 1, // Assuming admin user for now
        action: 'delete',
        resourceType: 'supplier',
        resourceId: supplierId,
        details: `a supprimé le fournisseur ${supplier.name}`
      });
      
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete supplier' });
    }
  });

  // Invoice endpoints
  app.get('/api/invoices', async (req, res) => {
    try {
      const invoices = await storage.getInvoices();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch invoices' });
    }
  });

  app.get('/api/invoices/pending', async (req, res) => {
    try {
      const invoices = await storage.getPendingInvoices();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch pending invoices' });
    }
  });

  app.get('/api/invoices/:id', async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      if (isNaN(invoiceId)) {
        return res.status(400).json({ message: 'Invalid invoice ID' });
      }

      const invoice = await storage.getInvoice(invoiceId);
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }

      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch invoice' });
    }
  });

  app.get('/api/invoices/:id/with-installments', async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      if (isNaN(invoiceId)) {
        return res.status(400).json({ message: 'Invalid invoice ID' });
      }

      const data = await storage.getInvoiceWithInstallments(invoiceId);
      if (!data) {
        return res.status(404).json({ message: 'Invoice not found' });
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch invoice with installments' });
    }
  });

  app.post('/api/invoices', async (req, res) => {
    try {
      const validatedData = insertInvoiceSchema.parse(req.body);
      
      // Check if supplier exists
      const supplier = await storage.getSupplier(validatedData.supplierId);
      if (!supplier) {
        return res.status(400).json({ message: 'Supplier does not exist' });
      }
      
      const invoice = await storage.createInvoice(validatedData);
      
      // Log activity
      await storage.createActivity({
        userId: 1, // Assuming admin user for now
        action: 'create',
        resourceType: 'invoice',
        resourceId: invoice.id,
        details: `a ajouté une nouvelle facture ${invoice.number} de ${supplier.name}`
      });
      
      res.status(201).json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid invoice data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create invoice' });
    }
  });

  app.put('/api/invoices/:id', async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      if (isNaN(invoiceId)) {
        return res.status(400).json({ message: 'Invalid invoice ID' });
      }

      const validatedData = insertInvoiceSchema.partial().parse(req.body);
      const updatedInvoice = await storage.updateInvoice(invoiceId, validatedData);
      
      if (!updatedInvoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      
      // Log activity
      await storage.createActivity({
        userId: 1, // Assuming admin user for now
        action: 'update',
        resourceType: 'invoice',
        resourceId: invoiceId,
        details: `a modifié la facture ${updatedInvoice.number}`
      });
      
      res.json(updatedInvoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid invoice data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update invoice' });
    }
  });

  app.delete('/api/invoices/:id', async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      if (isNaN(invoiceId)) {
        return res.status(400).json({ message: 'Invalid invoice ID' });
      }

      const invoice = await storage.getInvoice(invoiceId);
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }

      const result = await storage.deleteInvoice(invoiceId);
      
      // Log activity
      await storage.createActivity({
        userId: 1, // Assuming admin user for now
        action: 'delete',
        resourceType: 'invoice',
        resourceId: invoiceId,
        details: `a supprimé la facture ${invoice.number}`
      });
      
      res.json({ success: result });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete invoice' });
    }
  });

  // Installment endpoints
  app.get('/api/installments', async (req, res) => {
    try {
      const invoiceId = req.query.invoiceId as string;
      
      if (invoiceId) {
        const id = parseInt(invoiceId);
        if (isNaN(id)) {
          return res.status(400).json({ message: 'Invalid invoice ID' });
        }
        
        const installments = await storage.getInstallmentsByInvoice(id);
        res.json(installments);
      } else {
        const installments = await storage.getUpcomingInstallments();
        res.json(installments);
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch installments' });
    }
  });

  app.post('/api/installments', async (req, res) => {
    try {
      // Handle single installment
      if (!Array.isArray(req.body)) {
        const validatedData = insertInstallmentSchema.parse(req.body);
        
        // Check if invoice exists
        const invoice = await storage.getInvoice(validatedData.invoiceId);
        if (!invoice) {
          return res.status(400).json({ message: 'Invoice does not exist' });
        }
        
        const installment = await storage.createInstallment(validatedData);
        
        // Log activity
        await storage.createActivity({
          userId: 1, // Assuming admin user for now
          action: 'create',
          resourceType: 'installment',
          resourceId: installment.id,
          details: `a créé un échéancier pour la facture ${invoice.number}`
        });
        
        return res.status(201).json(installment);
      }
      
      // Handle multiple installments
      const validatedDataArray = z.array(insertInstallmentSchema).parse(req.body);
      
      if (validatedDataArray.length === 0) {
        return res.status(400).json({ message: 'No installments provided' });
      }
      
      // Check if invoice exists
      const invoiceId = validatedDataArray[0].invoiceId;
      const invoice = await storage.getInvoice(invoiceId);
      if (!invoice) {
        return res.status(400).json({ message: 'Invoice does not exist' });
      }
      
      // Delete existing installments for this invoice
      await storage.deleteInstallmentsByInvoice(invoiceId);
      
      // Create new installments
      const installments = await storage.createInstallments(validatedDataArray);
      
      // Update invoice status
      await storage.updateInvoice(invoiceId, { status: 'partial' });
      
      // Log activity
      await storage.createActivity({
        userId: 1, // Assuming admin user for now
        action: 'create',
        resourceType: 'payment_plan',
        resourceId: invoiceId,
        details: `a créé un plan de paiement pour la facture ${invoice.number}`
      });
      
      res.status(201).json(installments);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid installment data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create installments' });
    }
  });

  app.put('/api/installments/:id', async (req, res) => {
    try {
      const installmentId = parseInt(req.params.id);
      if (isNaN(installmentId)) {
        return res.status(400).json({ message: 'Invalid installment ID' });
      }

      const validatedData = insertInstallmentSchema.partial().parse(req.body);
      const updatedInstallment = await storage.updateInstallment(installmentId, validatedData);
      
      if (!updatedInstallment) {
        return res.status(404).json({ message: 'Installment not found' });
      }
      
      // Log activity
      await storage.createActivity({
        userId: 1, // Assuming admin user for now
        action: 'update',
        resourceType: 'installment',
        resourceId: installmentId,
        details: `a modifié l'échéance ${updatedInstallment.installmentNumber} de la facture ${updatedInstallment.invoiceId}`
      });
      
      res.json(updatedInstallment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid installment data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update installment' });
    }
  });

  // Activity endpoints
  app.get('/api/activities', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      if (limit !== undefined && isNaN(limit)) {
        return res.status(400).json({ message: 'Invalid limit parameter' });
      }
      
      const activities = await storage.getActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch activities' });
    }
  });

  app.post('/api/activities', async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid activity data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create activity' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
