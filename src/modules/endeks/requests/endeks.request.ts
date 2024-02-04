import { IsDate, IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class EndeksRequest {
  @IsNotEmpty()
  @IsDateString()
  issued_at: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
