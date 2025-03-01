import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto, StatusDto } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send({ cmd: 'create-order' }, createOrderDto).pipe(
      catchError((error) => {
        console.log('[ERROR]', error);
        throw new RpcException(error);
      }),
    );
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    console.log('🚀 ~ findAll ~ paginationDto:', orderPaginationDto);
    return this.ordersClient
      .send({ cmd: 'get-orders' }, orderPaginationDto)
      .pipe(
        catchError((error) => {
          console.log('[ERRORX]', error);
          throw new RpcException(error);
        }),
      );
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersClient.send({ cmd: 'get-order-by-id' }, { id }).pipe(
      catchError((error) => {
        console.log('[ERROR]', error);
        throw new RpcException(error);
      }),
    );
  }
  @Get(':status')
  findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.ordersClient
      .send(
        { cmd: 'get-orders' },
        { ...paginationDto, status: statusDto.status },
      )
      .pipe(
        catchError((error) => {
          console.log('[ERRORX]', error);
          throw new RpcException(error);
        }),
      );
  }
  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    return this.ordersClient
      .send({ cmd: 'update-status' }, { id, ...statusDto })
      .pipe(
        catchError((error) => {
          console.log('[ERROR]', error);
          throw new RpcException(error);
        }),
      );
  }
}
