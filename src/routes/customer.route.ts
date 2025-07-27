import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { createBillDto } from '@/dtos/bills.dto';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { CustomerController } from '@/controllers/customer.controller';
import { CustomerDto } from '@/dtos/customer.dto';

export class CustomerRoute implements Routes {
  public path = '/customers';
  public router = Router();
  public customer = new CustomerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, ValidationMiddleware(CustomerDto, true),this.customer.createCustomerData);
    this.router.get(`${this.path}`, this.customer.getCustomers);
    this.router.put(`${this.path}/:id`, this.customer.updateCustomerById);
    this.router.delete(`${this.path}/:id`, this.customer.deleteCustomer);
  }
}