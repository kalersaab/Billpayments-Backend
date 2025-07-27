import { CategoryDto } from '@/dtos/category.dto';
import categorySchema from '@/models/category.model';
import productSchema from '@/models/product.model';
import { InferSchemaType, model, Model } from 'mongoose';
import { Service } from 'typedi';

@Service()
export class CategoryService {
  private _category: Model<InferSchemaType<typeof categorySchema>>;
  private _Product: Model<InferSchemaType<typeof productSchema>>;
  constructor() {
    this._category = model('category', categorySchema);
    this._Product = model('product', productSchema);
  }
  public async createCategory(name: CategoryDto) {
    try {
      const createCategory = await new this._category(name);
        const savedCategory = await createCategory.save();
      return savedCategory;
    } catch (error) {
      throw error;
    }
  }
  public async findCategory(query: { page: string; limit: string; keyword?: string }) {
    const pageIndex = parseInt(query.page, 10) || 0;
    const pageSize = parseInt(query.limit, 10) || 10;
    const searchCriteria: {} = {};
    if (query.keyword) {
      searchCriteria['$or'] = [
        {
          name: { $regex: `${query.keyword?.trim()}`, $options: 'i' },
        },
      ];
    }
    try {
      const findCategory = await this._category.aggregate([
        { $match: searchCriteria },
        {
          $sort: { lastActiveDate: -1 },
        },
        {
          $facet: {
            data: [{ $skip: pageIndex * pageSize }, { $limit: pageSize }],
            count: [{ $count: 'total' }],
          },
        },
      ]);
      return { data: findCategory[0]?.data, count: findCategory[0]?.count[0]?.total };
    } catch (error) {
      throw error;
    }
  }
  public async updateCategory(id: string, name: CategoryDto) {
    try {
      const updateCategory = await this._category.findByIdAndUpdate(id, name, { new: true });
      return updateCategory;
    } catch (error) {
      throw error;
    }
  }
  public async findCategoryById(id: string) {
    try {
      const findCategory = await this._category.findById(id);
      return findCategory;
    } catch (error) {
      throw error;
    }
  }
  public async deleteCategory(id: string) {
    try {
      await this._category.findByIdAndDelete(id);
      await this._Product.deleteMany({ categoryId: id });
      return true;

    } catch (error) {
      throw error;
    }
  }
}
