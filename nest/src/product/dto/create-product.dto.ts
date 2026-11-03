import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  // 📝 [CẦN DB] Bỏ comment SAU KHI có cột category
  // @IsString()
  // @IsOptional()
  // category?: string;
}
