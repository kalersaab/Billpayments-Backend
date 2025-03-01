import { CashManagementController } from "@/controllers/cash.controller";
import { CashManagementDto } from "@/dtos/cash.dto";
import { Routes } from "@/interfaces/routes.interface";
import { ValidationMiddleware } from "@/middlewares/validation.middleware";
import { Router } from "express";

export class CashRoute implements Routes {
  public path = '/cashManagement';
  public router = Router();
  public cash = new CashManagementController();
  constructor() {
    this.initializeRoutes();
  }
    private initializeRoutes() {
        this.router.get(`${this.path}/getcash`, this.cash.getCash);
        this.router.post(`${this.path}/createcash`,  ValidationMiddleware(CashManagementDto),this.cash.Cash);
        this.router.put(`${this.path}/updatecash/:id`, ValidationMiddleware(CashManagementDto),this.cash.updateCash);
        this.router.delete(`${this.path}/deletecash/:id`, this.cash.deleteCash);
    }
}