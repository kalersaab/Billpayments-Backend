import { Cash } from "@/interfaces/users.interface";
import { Document, model, Schema } from "mongoose";

const cashSchema: Schema = new Schema({
    amount:{
        type: String,
        required: true,
    },
    notes:{
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
        enum: ['credit', 'debit'],
    },
},{ timestamps: { createdAt: true, updatedAt: true } });  
export const CashManagement = model<Cash & Document>('cashManagement', cashSchema);