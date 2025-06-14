import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { GrabService } from '../services/grab/grab.service';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  create(@Body() dto: CreateDeliveryDto) {
    return this.deliveryService.create(dto);
  }

  @Get()
  findAll() {
    return this.deliveryService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.deliveryService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateDeliveryDto) {
    return this.deliveryService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.deliveryService.remove(id);
  }
}

@Controller('delivery/grab')
export class GrabController {
  constructor(private readonly grabService: GrabService) {}

  @Post('quote')
  getQuote(@Body() body: any) {
    // body: { pickup: {...}, dropoff: {...}, packageDetails: {...} }
    return this.grabService.getQuote(body.pickup, body.dropoff, body.packageDetails);
  }

  @Post('order')
  createOrder(@Body() body: any) {
    // body: { ...orderDetails }
    return this.grabService.createOrder(body);
  }
}
