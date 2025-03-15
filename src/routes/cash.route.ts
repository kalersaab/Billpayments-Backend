import { CashManagementController } from "@/controllers/cash.controller";
import { CashManagementDto } from "@/dtos/cash.dto";
import { Routes } from "@/interfaces/routes.interface";
import { authMiddleware } from "@/middlewares/auth.middleware";
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
        this.router.get(`${this.path}/getcash`, authMiddleware, this.cash.getCash);
        this.router.post(`${this.path}/createcash`, authMiddleware,ValidationMiddleware(CashManagementDto),this.cash.Cash);
        this.router.put(`${this.path}/updatecash/:id`,authMiddleware, ValidationMiddleware(CashManagementDto),this.cash.updateCash);
        this.router.delete(`${this.path}/deletecash/:id`,authMiddleware, this.cash.deleteCash);
    }
}