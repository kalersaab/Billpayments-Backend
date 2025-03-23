import { IsNumber, IsOptional, IsString } from "class-validator";

export class createBillDto {
@IsString()
@IsOptional()
public products: string;

@IsNumber()
public quantity: number;

@IsNumber()
public rate: number;

@IsNumber()
public total: number;
}