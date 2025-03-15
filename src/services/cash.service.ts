import { CashManagementDto } from "@/dtos/cash.dto";
import { HttpException } from "@/exceptions/httpException";
import { CashManagement } from "@/models/cash.model";
import { InferSchemaType, Model } from "mongoose";
import { Service } from "typedi";
@Service()
export class CashService {
   private _cash: Model<InferSchemaType<typeof CashManagement>> = CashManagement;
     public async createCash(cash: CashManagementDto){
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
       public async findAllCash() {
         const payment = await this._cash.aggregate([
           {
             $sort: { lastActiveDate: -1 },
           },
           {
             $facet: {
               data: [{ $skip: 0 }, { $limit: 10 }],
               count: [{ $count: 'total' }],
             },
           }
         ])
         if(!payment) throw new HttpException(404, 'Cash not found');
         return payment[0];
       }
     public async deleteCash(id: string) {
       if (!id) throw new HttpException(409, 'Cash Id be empty');
       const deletepayment = await this._cash.findByIdAndDelete(id);
       if (!deletepayment) throw new HttpException(404, 'Cash not found');
       return deletepayment;
     }
  }