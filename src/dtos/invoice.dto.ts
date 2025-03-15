import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class InvoiceDto {
    @IsString()
    paymentMode: string;
    @IsString()
    CustomerName: string;
    @IsNumber()
    Quantity: number;
    @IsNumber()
    total: number;
    @IsNumber()
    @IsOptional()
    discount: number;
} 