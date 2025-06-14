import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from './delivery.entity';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { GrabController } from '../services/grab/grab.controller';
import { GrabService } from '../services/grab/grab.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery]), ConfigModule],
  providers: [DeliveryService, GrabService],
  controllers: [DeliveryController, GrabController],
  exports: [DeliveryService, GrabService],
})
export class DeliveryModule {}
