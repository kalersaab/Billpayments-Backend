import { HttpException } from '@/exceptions/HttpException';
import { CustomerService } from '@/services/customer.service';
import { NextFunction, Request, Response } from 'express';

export class CustomerController {
    private customerService: CustomerService;
      constructor() {
        this.customerService = new CustomerService();
      }
public createCustomerData = async (req: Request, res: Response, next: NextFunction) => {
    const customerData = req.body;
    try {
      const createCustomer = await this.customerService.createCustomers(customerData);

      res.status(201).json({ data: createCustomer, message: 'Customer created successfully' });
    } catch (error) {
      next(new HttpException(500, error.message || 'Something went wrong'));
    }
  };
}
