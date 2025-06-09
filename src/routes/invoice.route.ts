import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { createBillDto } from '@/dtos/bills.dto';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { InvoiceController } from '@/controllers/invoice.controller';

export class InvoiceRoute implements Routes {
  public path = '/invoices';
  public router = Router();
  public invoice = new InvoiceController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.invoice.createInvoice);
    this.router.get(`${this.path}`, this.invoice.getInvoices);
    this.router.get(`${this.path}/:id`, this.invoice.getInvoice);
    this.router.put(`${this.path}/:id`, this.invoice.updateInvoice);
    this.router.delete(`${this.path}/:id`, this.invoice.deleteInvoice);
  }
}
