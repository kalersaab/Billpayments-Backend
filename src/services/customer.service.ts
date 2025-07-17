import { CustomerDto } from "@/dtos/customer.dto";
import customerSchema from "@/models/customer.model";
import { InferSchemaType, model, Model } from "mongoose";
import { Service } from "typedi";

@Service()
export class CustomerService{
    private _customer: Model<InferSchemaType<typeof customerSchema>>
    constructor(){
        this._customer = model('customer', customerSchema);
    }
    public async createCustomers(customer: CustomerDto){
        try {
            const createCustomer = new this._customer({...customer});
            await createCustomer.save();
            return createCustomer
        } catch (error) {
            throw error;
        }
    }
}