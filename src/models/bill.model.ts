import { payments } from '@/interfaces/users.interface';
import { model, Schema, Document } from 'mongoose';
const paymentSchema: Schema = new Schema(
  {
    products: {
      type: String,
      require: true,
      trim: true,
    },
    quantity: {
      type: String,
      require: true,
      trim: true,
    },
    rate: {
      type: String,
      require: true,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
    },
    total: {
      type: String,
      require: true,
      trim: true,
    },
  },
  { timestamps: true },
);
export const PaymentModel = model<payments & Document>('Payment', paymentSchema);
