import { model, Schema } from 'mongoose';

const userSchema : Schema = new Schema({
firstName:{
  type:String,
  required:true,
  trim:true
},
lastName:{
  type:String,
  trim:true
},
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default userSchema;
