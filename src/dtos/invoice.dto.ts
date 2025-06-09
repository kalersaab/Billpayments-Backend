import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class InvoiceDto {
    @IsString()
    paymentMode: string;
    @IsString()
    CustomerName: string;
    @IsNumber()
    @IsOptional()
    discount: number;
    @IsString({each:true})
    products: string[];
} 