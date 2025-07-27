import { CustomerDto } from '@/dtos/customer.dto';
import { productDto } from '@/dtos/product.dto';
import customerSchema from '@/models/customer.model';
import productSchema from '@/models/product.model';
import { InferSchemaType, model, Model } from 'mongoose';
import { Service } from 'typedi';

@Service()
export class ProductService {
  private _product: Model<InferSchemaType<typeof customerSchema>>;
  constructor() {
    this._product = model('product', productSchema);
  }
  public async createProduct(product: productDto) {
    try {
      const createProduct = new this._product({ ...product });
      await createProduct.save();
      return createProduct;
    } catch (error) {
      throw error;
    }
  }
  public async findProductById(id: string) {
    try {
      const product = await this._product.findById(id);
      return product;
    } catch (error) {
      throw error;
    }
  }
  public async findProduct(query: { page: string; limit: string; keyword?: string }) {
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
      const products = await this._product.aggregate([
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
      return { data: products[0]?.data, count: products[0]?.count[0]?.total };
    } catch (error) {
      throw error;
    }
  }
  public async updateProduct(id: string, productData: CustomerDto) {
    try {
      const updatedProduct = await this._product.findByIdAndUpdate(id, productData, { new: true });
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }
  public async deleteProduct(id: string) {
    try {
      const product = await this._product.findByIdAndDelete(id);
      return product;
    } catch (error) {
      throw error;
    }
  }
}
