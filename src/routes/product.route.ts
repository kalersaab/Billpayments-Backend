import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { productDto } from '@/dtos/product.dto';
import { ProductController } from '@/controllers/product.controller';

export class ProductRoute implements Routes {
  public path = '/products';
  public router = Router();
  public product = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, ValidationMiddleware(productDto, true),this.product.createProductData);
    this.router.get(`${this.path}`, this.product.getProducts);
    this.router.get(`${this.path}/:id`, this.product.getProductById);
    this.router.put(`${this.path}/:id`, ValidationMiddleware(productDto, true),this.product.updateProductData);
    this.router.delete(`${this.path}/:id`, this.product.deleteProduct);
  }
}