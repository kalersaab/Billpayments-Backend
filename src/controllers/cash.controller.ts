import { CashManagementDto } from "@/dtos/cash.dto";
import { HttpException } from "@/exceptions/HttpException";
import { CashService } from "@/services/cash.service";
import { NextFunction, Request, Response } from "express";
import Container from "typedi";

export class CashManagementController {
    private CashService: CashService;
      constructor() {
        this.CashService = new CashService();
      }
    public Cash = async (req: Request, res: Response, next: NextFunction) => {
      const amount: CashManagementDto = req.body;
      try {
        const createBill = await this.CashService.createCash(amount);
        res.status(201).json({ data: createBill, message: 'Amount created successfully', status: 201 });
      } catch (error) {
        next(new HttpException(500, error || 'Something went Wrong'));
      }
    };
    public updateCash = async (req: Request, res: Response, next: NextFunction) => {
      const {body} = req
      const { id } = req.params;
      try {
        const updateBill = await this.CashService.updateCash(id,body);
        res.status(200).json({ data: updateBill, message: 'Amount updated successfully', status:200 });
      } catch (error) {
        next(new HttpException (500, error ?? 'Something went wrong'));
      }
    }
    public getCash = async (req: Request, res: Response, next: NextFunction) => {
      const {query}:any = req
      try 
      {
        const findAllAmount = await this.CashService.findAllCash(query);
       
        return res.status(200).json({ data: findAllAmount, message: 'Amount successfully fetched', status:200});
    }
      catch (error) {
        next(new HttpException(500, error.message ?? 'something went wrong'));
      }
    }
    public deleteCash = async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      try {
        const deleteBill = await this.CashService.deleteCash(id);
        if(!deleteBill){
          res.status(404).json({message:'Amount not found', status:404})
        }
        res.status(200).json({ message: 'Amount deleted successfully', status: 200 });
      } catch (error) {
        next(new HttpException(500, error.message ?? 'something went wrong'));
      }
    }
} 