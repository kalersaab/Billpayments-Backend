import { HttpException } from '@/exceptions/HttpException';
import { CustomerService } from '@/services/customer.service';
import { ProductService } from '@/services/product.service';
import { NextFunction, Request, Response } from 'express';

export class ProductController {
    private productService: ProductService;
      constructor() {
        this.productService = new ProductService();
      }
public createProductData = async (req: Request, res: Response, next: NextFunction) => {
    const productData = req.body;
    try {
      const createProduct = await this.productService.createProduct(productData);

      res.status(201).json({ data: createProduct, message: 'Product created successfully' });
    } catch (error) {
      next(new HttpException(500, error.message || 'Something went wrong'));
    }
  };
}
