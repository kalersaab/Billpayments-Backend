import { createBillDto } from '@/dtos/bills.dto';
import { BillService } from '@/services/bill.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class BillController {
  public BillService = Container.get(BillService);
  public Bills = async (req: Request, res: Response, next: NextFunction) => {
    const payments: createBillDto = req.body;
    try {
      const createBill = await this.BillService.createBill(payments);
      res.status(201).json({ data: createBill, message: 'bill created successfully' });
    } catch (error) {
      next(error);
    }
  };
  public getBills = async (req: Request, res: Response, next: NextFunction) => {
    const { query }: any = req;
    try {
      const getBills = await this.BillService.findAllBills(query);
      res.status(200).json({ data: getBills, message: 'bills fetched successfully' });
    } catch (error) {
      next(error);
    }
  };
  public getBillById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const getBill = await this.BillService.findBillById(id);
      res.status(200).json({ data: getBill, message: 'bill fetched successfully' });
    } catch (error) {
      next(error);
    }
  };
  public updateBill = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { body } = req;
    try {
      const updateBill = await this.BillService.updateBill(id, body);
      res.status(200).json({ data: updateBill, message: 'bill updated successfully' });
    } catch (error) {
      next(error);
    }
  };
    public deleteBill = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
        const deleteBill = await this.BillService.deleteBill(id);
        res.status(200).json({ data: deleteBill, message: 'bill deleted successfully' });
        } catch (error) {
        next(error);
        }
    };
}
