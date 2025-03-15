import mongoose from "mongoose";
import Counter from "./invoiceCounter.model";

const invoiceSchema = new mongoose.Schema({
    InvoiceNo: {
        type: String,
        required: true,
        unique: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true
    }],
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
    Quantity: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0  
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

invoiceSchema.pre("save", async function (next) {
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
