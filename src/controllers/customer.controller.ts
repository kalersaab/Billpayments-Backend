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
  public getCustomers = async (req: Request, res: Response, next: NextFunction) => {
    const { query }: any = req;
    try {
      const customers = await this.customerService.findCustomers(query);
      if (customers) {
        res.status(200).json({ data: customers, message: 'Customers fetched successfully' });
      } else {
        res.status(404).json({ data: [], message: 'Customers not found' });
      }
    } catch (error) {
      next(new HttpException(500, error.message || 'Something went wrong'));
    }
  };
  public getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const customer = await this.customerService.findCustomerById(id);
      if (customer) {
        res.status(200).json({ data: customer, message: 'Customer fetched successfully' });
      } else {
        res.status(404).json({ data: [], message: 'Customer not found' });
      }
    } catch (error) {
      next(new HttpException(500, error.message || 'Something went wrong'));
    }
  };
  public updateCustomerById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const customerData = req.body;
    try {
      const updatedCustomer = await this.customerService.updateCustomer(id, customerData);
      if (updatedCustomer) {
        res.status(200).json({ data: updatedCustomer, message: 'Customer updated successfully' });
      } else {
        res.status(404).json({ data: [], message: 'Customer not found' });
      }
    } catch (error) {
      next(new HttpException(500, error.message || 'Something went wrong'));
    }
  };
  public deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const deletedCustomer = await this.customerService.deleteCustomer(id);
      if (deletedCustomer) {
        res.status(200).json({ data: deletedCustomer, message: 'Customer deleted successfully' });
      } else {
        res.status(404).json({ data: [], message: 'Customer not found' });
      }
    } catch (error) {
      next(new HttpException(500, error.message || 'Something went wrong'));
    }
  };
}
