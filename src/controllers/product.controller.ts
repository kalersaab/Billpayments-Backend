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
  public getProductById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const product = await this.productService.findProductById(id);
      if (product) {
        res.status(200).json({ data: product, message: 'Product fetched successfully' });
      } else {
        res.status(404).json({ data: null, message: 'Product not found' });
      }
    } catch (error) {
      next(new HttpException(500, error.message || 'Something went wrong'));
    }
  };
  public getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const { query }: any = req;
    try {
      const products = await this.productService.findProduct(query);
      if (products) {
        res.status(200).json({ data: products, message: 'Products fetched successfully' });
      } else {
        res.status(404).json({ data: [], message: 'Products not found' });
      }
    } catch (error) {
      next(new HttpException(500, error.message || 'Something went wrong'));
    }
  };
  public updateProductData = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const productData = req.body;
    try {
      const updatedProduct = await this.productService.updateProduct(id, productData);
      if (updatedProduct) {
        res.status(200).json({ data: updatedProduct, message: 'Product updated successfully' });
      } else {
        res.status(404).json({ data: null, message: 'Product not found' });
      }
    } catch (error) {
      next(new HttpException(500, error.message || 'Something went wrong'));
    }
  };
  public deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const product = await this.productService.deleteProduct(id);
      if (product) {
        res.status(200).json({ data: product, message: 'Product deleted successfully' });
      } else {
        res.status(404).json({ data: null, message: 'Product not found' });
      }
    } catch (error) {
      next(new HttpException(500, error.message || 'Something went wrong'));
    }
  };
}
