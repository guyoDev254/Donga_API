import { IsDecimal, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
  @IsOptional()
  @IsDecimal()
  balance?: number;
  @IsOptional()
  @IsString()
  currency?: string;
}
