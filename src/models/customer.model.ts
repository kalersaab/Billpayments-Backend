import { model, Schema } from 'mongoose';

const customerSchema : Schema = new Schema({
name:{
  type:String,
  required:true,
  trim:true
},
  mobile: {
    type: String,
    maxLength: 10,
    minLength: 10,
    required: true,
  },
},{
    timestamps: true,
    versionKey: false,
});

export default customerSchema;
