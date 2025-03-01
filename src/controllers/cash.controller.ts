import { CashManagementDto } from "@/dtos/cash.dto";
import { CashService } from "@/services/cash.service";
import { NextFunction, Request, Response } from "express";
import Container from "typedi";

export class CashManagementController {
    public CashService = Container.get(CashService);
    public Cash = async (req: Request, res: Response, next: NextFunction) => {
      const amount: CashManagementDto = req.body;
      try {
        const createBill = await this.CashService.createCash(amount);
        res.status(201).json({ data: createBill, message: 'Amount created successfully' });
      } catch (error) {
        next(error);
      }
    };
    public updateCash = async (req: Request, res: Response, next: NextFunction) => {
      const {body} = req
      const { id } = req.params;
      try {
        const updateBill = await this.CashService.updateCash(id,body);
        res.status(200).json({ data: updateBill, message: 'Amount updated successfully' });
      } catch (error) {
        next(error);
      }
    }
    public getCash = async (req: Request, res: Response, next: NextFunction) => {
      try 
      {
        const findAllAmount = await this.CashService.findAllCash();
        res.status(200).json({ data: findAllAmount, message: 'Amount successfully fetched' });
      }
      catch (error) {
        next(error);
      }
    }
    public deleteCash = async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      try {
        const deleteBill = await this.CashService.deleteCash(id);
        res.status(200).json({ data: deleteBill, message: 'Amount deleted successfully' });
      } catch (error) {
        next(error);
      }
    }
} 