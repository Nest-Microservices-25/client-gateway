import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  // De este lado no se necesita el id en el DTO porque viene por query params
  // @IsPositive()
  // @IsNumber()
  // id: number;
}
