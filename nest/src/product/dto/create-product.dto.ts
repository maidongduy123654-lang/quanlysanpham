import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString({ message: 'Tên sản phẩm phải là một chuỗi' })
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Giá phải là số' })
  @Min(0, { message: 'Giá không được nhỏ hơn 0' })
  @Type(() => Number)
  price: number;

  @IsNumber({}, { message: 'Số lượng phải là số nguyên' })
  @Min(0, { message: 'Số lượng không được nhỏ hơn 0' })
  @Type(() => Number)
  stock: number;
}
