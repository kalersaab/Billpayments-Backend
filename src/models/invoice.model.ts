import mongoose from "mongoose";
import Counter from "./invoiceCounter.model";

const invoiceSchema = new mongoose.Schema({
    InvoiceNo: {
        type: String,
        unique: true
    },
    InvoiceDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    paymentMode: {
        type: String,
        required: true,
        enum: ['cash', 'online']
    },
    CustomerName: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        default: 0  
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },
}, { timestamps: true });

invoiceSchema.pre("validate", async function (next) {
    if (!this.InvoiceNo) { 
        const counter = await Counter.findByIdAndUpdate(
            { _id: "invoice" }, 
            { $inc: { seq: 1 } }, 
            { new: true, upsert: true }
        );
        this.InvoiceNo = `INV-${counter.seq}`;
    }
    next();
});

export default invoiceSchema
