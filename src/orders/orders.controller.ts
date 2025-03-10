import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto, StatusDto } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send({ cmd: 'create-order' }, createOrderDto).pipe(
      catchError((error) => {
        console.log('[ERROR]', error);
        throw new RpcException(error);
      }),
    );
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    console.log('🚀 ~ findAll ~ paginationDto:', orderPaginationDto);
    return this.client.send({ cmd: 'get-orders' }, orderPaginationDto).pipe(
      catchError((error) => {
        console.log('[ERRORX]', error);
        throw new RpcException(error);
      }),
    );
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    console.log('🚀 ~ findOne ~ id:', id);
    return this.client.send({ cmd: 'get-order-by-id' }, { id }).pipe(
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
    return this.client
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
    return this.client
      .send({ cmd: 'update-status' }, { id, ...statusDto })
      .pipe(
        catchError((error) => {
          console.log('[ERROR]', error);
          throw new RpcException(error);
        }),
      );
  }
}
