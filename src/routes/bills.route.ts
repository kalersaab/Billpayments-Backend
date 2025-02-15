import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { BillController } from '@/controllers/bills.controller';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { createBillDto } from '@/dtos/bills.dto';

export class BillRoute implements Routes {
  public path = '/bills';
  public router = Router();
  public bill = new BillController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/createpayment`, ValidationMiddleware(createBillDto), this.bill.Bills);
    this.router.get(`${this.path}/getpayments`, this.bill.getBills);
    this.router.get(`${this.path}/getpayments/:id`, this.bill.getBillById);
    this.router.put(`${this.path}/updatepayments/:id`, ValidationMiddleware(createBillDto, true), this.bill.updateBill);
    this.router.delete(`${this.path}/:id`, this.bill.deleteBill);
  }
}
