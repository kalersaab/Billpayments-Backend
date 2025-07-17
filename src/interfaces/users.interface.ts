export interface User {
  _id?: string;
  firstName:string;
  lastName:string
  email: string;
  password: string;
}
export interface product{
  _id?: string;
  productName: string;
  quantity: string;
  rate: string;
  total: string;
  status?: string;
}
export interface Cash{
  _id?: string;
  amount: number;
  notes: string;
  type: string;
}
