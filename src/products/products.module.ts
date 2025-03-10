import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { envs } from 'src/config';
import { NatsModule } from 'src/transports/nats.module';
console.log('🚀 ~ envs.natsServers:', envs.natsServers);

@Module({
  controllers: [ProductsController],
  imports: [NatsModule],
})
export class ProductsModule {}
