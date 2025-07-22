import { CategoryController } from "@/controllers/category.controller";
import { CategoryDto } from "@/dtos/category.dto";
import { Routes } from "@/interfaces/routes.interface";
import { ValidationMiddleware } from "@/middlewares/validation.middleware";
import { Router } from "express";

export class CategoryRoute implements Routes {
  public path = '/categories';
  public router = Router();
  public category = new CategoryController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}`, this.category.getCategories.bind(this.category));
    this.router.post(`${this.path}`,ValidationMiddleware(CategoryDto, true), this.category.Category.bind(this.category));
    this.router.get(`${this.path}/:id`, this.category.getCategoryById.bind(this.category));
    this.router.put(`${this.path}/:id`, ValidationMiddleware(CategoryDto, true),this.category.updateCategoryById.bind(this.category));
    this.router.delete(`${this.path}/:id`, this.category.deleteCategory.bind(this.category));
  }
}