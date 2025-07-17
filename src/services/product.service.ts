import { CustomerDto } from "@/dtos/customer.dto";
import customerSchema from "@/models/customer.model";
import productSchema from "@/models/product.model";
import { InferSchemaType, model, Model } from "mongoose";
import { Service } from "typedi";

@Service()
export class ProductService{
    private _product: Model<InferSchemaType<typeof customerSchema>>
    constructor(){
        this._product = model('product', productSchema);
    }
    public async createProduct(product: CustomerDto){
        try {
            const createProduct = new this._product({...product});
            await createProduct.save();
            return createProduct
        } catch (error) {
            throw error;
        }
    }
}