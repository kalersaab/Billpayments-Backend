import { IsString } from "class-validator";

export class CashManagementDto {
    @IsString()
    public amount: string;
  
    @IsString()
    public notes: string;
  
    @IsString()
    public type: string;

}