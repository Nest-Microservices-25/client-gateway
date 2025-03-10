import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE, PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send({ cmd: 'create-product' }, createProductDto).pipe(
      catchError((error) => {
        console.log('[ERROR]', error);
        throw new RpcException(error);
      }),
    );
  }

  @Get()
  getProducts(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'get-products' }, paginationDto).pipe(
      catchError((error) => {
        console.log('[ERROR]', error);
        throw new RpcException(error);
      }),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('🚀 ~ findOne ~ id:', id);
    return this.client.send({ cmd: 'get-product-by-id' }, { id }).pipe(
      catchError((error) => {
        console.log('[ERROR]', error);
        throw new RpcException(error);
      }),
    );
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.client.send({ cmd: 'delete-product' }, { id }).pipe(
      catchError((error) => {
        console.log('[ERROR]', error);
        throw new RpcException(error);
      }),
    );
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.client
      .send({ cmd: 'update-product-by-id' }, { id, ...updateProductDto })
      .pipe(
        catchError((error) => {
          console.log('[ERROR]', error);
          throw new RpcException(error);
        }),
      );
  }
}
