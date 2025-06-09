import { InvoiceDto } from '@/dtos/invoice.dto';
import invoiceSchema from '@/models/invoice.model';
import Counter from '@/models/invoiceCounter.model';
import counterSchema from '@/models/invoiceCounter.model';
import { InferSchemaType, model, Model, Types } from 'mongoose';
import { Service } from 'typedi';
interface InvoiceWithBills {
  _id: Types.ObjectId;
  InvoiceNo: string;
  InvoiceDate: Date;
  paymentMode: string;
  CustomerName: string;
  discount: number;
  createdBy: string;
  bills: {
    productName: string;
    rate: number;
    quantity: number;
    total: number;
  }[];
}
@Service()
export class InvoiceService {
  private _invoice: Model<InferSchemaType<typeof invoiceSchema>>;
  constructor() {
    this._invoice = model('invoice', invoiceSchema);
  }
  public async createInvoice(invoice: InvoiceDto) {
    try {
       const counter = await Counter.findByIdAndUpdate(
            { _id: "invoice" }, 
            { $inc: { seq: 1 } }, 
            { new: true, upsert: true }
        );
      const createInvoice = new this._invoice({ ...invoice, InvoiceNo: `INV-${counter.seq}` });
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
 public async findInvoiceById(id: string): Promise<InvoiceWithBills[]> {
  return this._invoice.aggregate([
    { 
      $match: { 
        _id: new Types.ObjectId(id) 
      } 
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'invoiceId',
        as: 'bills'
      }
    },
    {
      $unwind: {
        path: '$bills',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: '$_id',
        InvoiceNo: { $first: '$InvoiceNo' },
        InvoiceDate: { $first: '$InvoiceDate' },
        paymentMode: { $first: '$paymentMode' },
        CustomerName: { $first: '$CustomerName' },
        discount: { $first: '$discount' },
        createdBy: { $first: '$createdBy' },
        bills: {
          $push: {
            productName: '$bills.productName',
            rate: '$bills.rate',
            quantity: '$bills.quantity',
            total: '$bills.total'
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        InvoiceNo: 1,
        InvoiceDate: 1,
        paymentMode: 1,
        CustomerName: 1,
        discount: 1,
        createdBy: 1,
        bills: {
          $cond: {
            if: { $eq: [{ $size: '$bills' }, 1] },
            then: '$bills',
            else: {
              $filter: {
                input: '$bills',
                as: 'bill',
                cond: { $ne: ['$$bill.productName', null] }
              }
            }
          }
        }
      }
    }
  ]);
}
  public updateInvoice(id: string, invoice: InvoiceDto) {
    return this._invoice.updateOne({ _id: id }, { $set: invoice });
  }
  public deleteInvoice(id: string) {
    return this._invoice.deleteOne({ _id: id });
  }
}
