import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { Public } from '../auth/public.decorator'; // Add this import

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  @Public()
  create(@Body() dto: CreateDeliveryDto) {
    return this.deliveryService.create(dto);
  }

  @Get()
  @Public()
  findAll() {
    return this.deliveryService.findAll();
  }

  @Get(':id')
  @Public()
  findById(@Param('id') id: number) {
    return this.deliveryService.findById(id);
  }

  @Patch(':id')
  @Public()
  update(@Param('id') id: number, @Body() dto: UpdateDeliveryDto) {
    return this.deliveryService.update(id, dto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: number) {
    return this.deliveryService.remove(id);
  }
}
