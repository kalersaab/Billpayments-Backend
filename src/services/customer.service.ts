import { CustomerDto } from '@/dtos/customer.dto';
import customerSchema from '@/models/customer.model';
import { InferSchemaType, model, Model } from 'mongoose';
import { Service } from 'typedi';

@Service()
export class CustomerService {
  private _customer: Model<InferSchemaType<typeof customerSchema>>;
  constructor() {
    this._customer = model('customer', customerSchema);
  }
  public async createCustomers(customer: CustomerDto) {
    try {
      const createCustomer = new this._customer({ ...customer });
      await createCustomer.save();
      return createCustomer;
    } catch (error) {
      throw error;
    }
  }
    public async findCustomers(query: { page: string; limit: string; keyword?: string }) {
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
        const findCustomers = await this._customer.aggregate([
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
        return { data: findCustomers[0]?.data, count: findCustomers[0]?.count[0]?.total };
        } catch (error) {
        throw error;
        }
    }
    public async updateCustomer(id: string, customer: CustomerDto) {
        try {
            const updateCustomer = await this._customer.findByIdAndUpdate(id, customer, { new: true });
            return updateCustomer;
        } catch (error) {
            throw error;
        }
    }
    public async findCustomerById(id: string) {
        try {
            const findCustomer = await this._customer.findById(id);
            return findCustomer;
        } catch (error) {
            throw error;
        }
    }
    public async deleteCustomer(id: string) {
        try {
            const deleteCustomer = await this._customer.findByIdAndDelete(id);
            return deleteCustomer;
        } catch (error) {
            throw error;
        }
    }
}