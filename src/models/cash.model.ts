import { Cash } from "@/interfaces/users.interface";
import { Document, model, Schema } from "mongoose";

const cashSchema: Schema = new Schema({
    amount:{
        type: Number,
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
export default  cashSchema