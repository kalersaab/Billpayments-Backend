import { model, Schema } from 'mongoose';

const productSchema : Schema = new Schema({
name:{
  type:String,
  required:true,
  trim:true
},
categoryId:{
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true,
},
  price: {
    type: String,
    required: true,
  },
},{
    timestamps: true,
    versionKey: false,
});

export default productSchema;
