export interface User {
  _id?: string;
  username: string;
  email: string;
  password: string;
}
export interface payments{
  _id?: string;
  products: string;
  quantity: string;
  rate: string;
  total: string;
  status?: string;
}
export interface Cash{
  _id?: string;
  amount: string;
  notes: string;
  type: string;
}
