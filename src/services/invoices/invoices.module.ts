import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoice.service';
import { InvoicesController } from './invoice.controller';
import { Order } from '../../orders/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [InvoicesService],
  controllers: [InvoicesController],
  exports: [InvoicesService],
})
export class InvoicesModule {}