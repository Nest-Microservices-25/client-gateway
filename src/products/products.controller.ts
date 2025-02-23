import {
  BadRequestException,
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
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
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
    console.log('🚀 ~ findOne ~ id:', id);
    return this.productsClient.send({ cmd: 'get-product-by-id' }, { id }).pipe(
      catchError((error) => {
        console.log('🚀 ~ findOne ~ error:', error);
        throw new RpcException(error);
      }),
    );
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
