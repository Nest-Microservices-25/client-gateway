import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor() {}
  @Get()
  getProducts() {
    return 'All products';
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
