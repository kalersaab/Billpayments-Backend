import { CashManagementDto } from '@/dtos/cash.dto';
import { HttpException } from '@/exceptions/HttpException';
import cashSchema from '@/models/cash.model';
import { InferSchemaType, model, Model } from 'mongoose';
import { Service } from 'typedi';
@Service()
export class CashService {
  private _cash: Model<InferSchemaType<typeof cashSchema>>;
  constructor() {
    this._cash = model('cashManagement', cashSchema);
  }
  public async createCash(cash: CashManagementDto) {
    try {
      const payments = await this._cash.create(cash);
      return payments;
    } catch (error) {
      throw error;
    }
  }
  public async updateCash(userId: string, body: CashManagementDto) {
    if (!userId) throw new HttpException(409, 'Cash Id be empty');
    const updatepayment = await this._cash.findByIdAndUpdate({ _id: userId }, body, { new: true });
    if (!updatepayment) throw new HttpException(404, 'Cash not found');
    return updatepayment;
  }
  public async findAllCash(query: { page: string; limit: string; keyword?: string; type: string }) {
    const pageIndex = parseInt(query.page) || 0;
    const pageSize = parseInt(query.limit) || 10;
    const searchCriteria: {} = {};

    if (query.keyword) {
      searchCriteria['$or'] = [
        {
          notes: { $regex: `${query.keyword?.trim()}`, $options: 'i' },
        },
      ];
    }
    if (query.type) {
      const types = query.type.split(',').map(t => t.trim());
      searchCriteria['$or'] = [
        ...(searchCriteria['$or'] || []),
        {
          type: { $in: types },
        },
      ];
    }
    const payment = await this._cash.aggregate([
      { $match: searchCriteria },
      {
        $sort: { createdAt: -1 },
      },
      {
        $facet: {
          data: [{ $skip: pageIndex }, { $limit: pageSize }],
          count: [{ $count: 'total' }],
        },
      },
    ]);
    return { cash: payment[0]?.data, count: payment[0]?.count[0]?.total };
  }
  public async deleteCash(id: string) {
    if (!id) throw new HttpException(409, 'Cash Id be empty');
    const deletepayment = await this._cash.findByIdAndDelete(id, { new: true });
    if (!deletepayment) throw new HttpException(404, 'Cash not found');
    return deletepayment;
  }
}
