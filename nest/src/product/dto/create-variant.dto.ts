import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateVariantDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsNumber()
  @IsOptional()
  priceAdjustment?: number;
}