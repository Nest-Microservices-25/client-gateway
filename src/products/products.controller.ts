import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}
  @Get()
  getProducts() {
    return this.productsClient.send({ cmd: 'get-products' }, {});
  }
  @Post()
  createProduct() {
    return 'Create product';
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
