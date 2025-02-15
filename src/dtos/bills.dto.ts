import { IsString } from "class-validator";

export class createBillDto {
@IsString()
public products: string;

@IsString()
public quantity: string;

@IsString()
public rate: string;

@IsString()
public total: string;

@IsString()
public status: string;
}