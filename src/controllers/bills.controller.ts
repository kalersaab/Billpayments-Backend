import { createBillDto } from '@/dtos/bills.dto';
import { HttpException } from '@/exceptions/HttpException';
import { BillService } from '@/services/bill.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class BillController {
  public BillService = Container.get(BillService);
  public Bills = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payments: createBillDto = req.body;
      const { rate, quantity } = payments;

      // Validate rate and quantity
      if (typeof rate !== 'number' || typeof quantity !== 'number') {
        return next(new HttpException(400, 'Invalid input: rate and quantity must be numbers.'));
      }

      const total:number = rate * quantity;
      const createBill = await this.BillService.createBill({ ...payments, total });

      res.status(201).json({
        status:201,
        data: createBill,
        message: 'Bill created successfully',
      });

    } catch (error: any) {
      next(new HttpException(500, error?.message || 'Something went wrong'));
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
