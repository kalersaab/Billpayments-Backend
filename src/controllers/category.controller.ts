import { HttpException } from '@/exceptions/HttpException';
import { CategoryService } from '@/services/category.service';
import { NextFunction, Request, Response } from 'express';

export class CategoryController {
  private categoryService: CategoryService;
  constructor() {
    this.categoryService = new CategoryService();
  }
  public async Category(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body;
    try {
      const category = await this.categoryService.createCategory(name);
      res.status(201).json({ data: category, message: 'category created successfully', status: 201 });
    } catch (error) {
      next(new HttpException(500, error.message || 'Something went wrong'));
    }
  }
  public async getCategories(req: Request, res: Response, next: NextFunction) {
    const { query }: any = req;
    try {
      const categories = await this.categoryService.findCategory(query);
      if (categories) {
        res.status(200).json({ data: categories, message: 'categories fetched successfully', status: 200 });
      } else {
        res.status(404).json({ data: [], message: 'categories not found', status: 404 });
      }
    } catch (error) {
      next(new HttpException(500, error.message || 'Something went wrong'));
    }
  }
  public async getCategoryById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const category = await this.categoryService.findCategoryById(id);
      if (category) {
        res.status(200).json({ data: category, message: 'category fetched successfully', status: 200 });
      } else {
        res.status(404).json({ data: [], message: 'category not found', status: 404 });
      }
    } catch (error) {
      next(new HttpException(500, error.message || 'Something went wrong'));
    }
  }
  public async updateCategoryById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const category = await this.categoryService.updateCategory(id, name);
      if (category) {
        res.status(200).json({ data: category, message: 'category fetched successfully', status: 200 });
      } else {
        res.status(404).json({ data: [], message: 'category not found', status: 404 });
      }
    } catch (error) {
      next(new HttpException(500, error.message || 'Something went wrong'));
    }
  }
  public async deleteCategory(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const category = await this.categoryService.deleteCategory(id);
      res.status(200).json({ data: category, message: 'category deleted successfully', status: 200 });
    } catch (error) {
      next(new HttpException(500, error.message || 'Something went wrong'));
    }
  }
}
