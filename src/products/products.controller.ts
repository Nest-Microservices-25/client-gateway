import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct() {
    return 'Create product';
  }

  @Get()
  getProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({ cmd: 'get-products' }, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Product ${id}`;
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return `Delete Product ${id}`;
  }
  @Patch(':id')
  updateProduct(@Param('id') id: string, @Body() body: any) {
    return `Update Product ${JSON.stringify(body)}`;
  }
}
