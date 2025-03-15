import { InvoiceDto } from '@/dtos/invoice.dto';
import invoiceSchema from '@/models/invoice.model';
import { InferSchemaType, model, Model } from 'mongoose';
import { Service } from 'typedi';

@Service()
export class InvoiceService {
  private _invoice: Model<InferSchemaType<typeof invoiceSchema>>;
  constructor() {
    this._invoice = model('invoice', invoiceSchema);
  }
  public async createInvoice(invoice: InvoiceDto) {
    try {
      const createInvoice = new this._invoice({ ...invoice });
      await createInvoice.save();
      return createInvoice;
    } catch (error) {
      throw error;
    }
  }
  public async findAllInvoice(query: { page: string; limit: string; keyword?: string }) {
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
      const findAllInvoice = await this._invoice.aggregate([
        {
          $sort: { lastActiveDate: -1 },
        },
        {
          $facet: {
            data: [{ $skip: 0 }, { $limit: 10 }],
            count: [{ $count: 'total' }],
          },
        },
      ]);
      return { data: findAllInvoice[0]?.data, count: findAllInvoice[0]?.count[0]?.total };
    } catch (error) {
      throw error;
    }
  }
  public findInvoiceById(id: string) {
    return this._invoice.findById(id);
  }
  public updateInvoice(id: string, invoice: InvoiceDto) {
    return this._invoice.updateOne({ _id: id }, { $set: invoice });
  }
  public deleteInvoice(id: string) {
    return this._invoice.deleteOne({ _id: id });
  }
}
