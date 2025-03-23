import { product } from '@/interfaces/users.interface';
import { model, Schema, Document } from 'mongoose';
const productSchema: Schema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      trim: true,
    },
    rate: {
      type: Number,
      required: true,
      trim: true,
    },
    total: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);
export const PaymentModel = model<product & Document>('Product', productSchema);
