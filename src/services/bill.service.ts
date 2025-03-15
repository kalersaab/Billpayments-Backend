import { createBillDto } from '@/dtos/bills.dto';
import { HttpException } from '@/exceptions/httpException';
import { PaymentModel } from '@/models/bill.model';
import { InferSchemaType, Model } from 'mongoose';
import { Service } from 'typedi';
@Service()
export class BillService {
  private _payments: Model<InferSchemaType<typeof PaymentModel>> = PaymentModel;
  public async createBill(payment: createBillDto) {
    try {
      const payments = await this._payments.create(payment);
      return payments;
    } catch (error) {
      throw error;
    }
  }
  public async findAllBills(query: { page: string; limit: string; keyword?: string }) {
    const pageIndex = parseInt(query.page, 10) || 0;
    const pageSize = parseInt(query.limit, 10) || 10;
    const searchCriteria: {} = {};

    if (query.keyword) {
      searchCriteria['$or'] = [
        {
          products: { $regex: `${query.keyword?.trim()}`, $options: 'i' },
        },
      ];
    }

    const payment = await this._payments.aggregate([
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
    return { data: payment[0]?.data, count: payment[0]?.count[0]?.total };
  }

  public async findBillById(id: string) {
    const payment = await this._payments.findById(id);
    return payment;
  }
  public async updateBill(userId: string, body: createBillDto) {
    if (!userId) throw new HttpException(409, 'Bill Id be empty');
    const updatepayment = await this._payments.findByIdAndUpdate({ _id: userId }, body, { new: true });
    if (!updatepayment) throw new HttpException(404, 'Bill not found');
    return updatepayment;
  }
  public async deleteBill(userId: string) {
    if (!userId) throw new HttpException(409, 'bill Id be empty');
    const deletepayment = await this._payments.findByIdAndDelete(userId);
    if (!deletepayment) throw new HttpException(404, 'bill not found');
    return deletepayment;
  }
}
