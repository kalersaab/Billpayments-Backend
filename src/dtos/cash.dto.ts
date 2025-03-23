import { IsNumber, IsString } from "class-validator";
export class CashManagementDto {
    @IsNumber()
    public amount: number;

    @IsString()
    public notes: string;

    @IsString()
    public type: string;
}
