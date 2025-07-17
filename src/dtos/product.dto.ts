import { IsString } from "class-validator";

export class productDto {
    @IsString()
    name: string;
    @IsString()
    price: string;
    @IsString()
    categoryId: string;
}