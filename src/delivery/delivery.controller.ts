import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { Public } from '../auth/public.decorator';
import { ApiTags, ApiBody, ApiParam, ApiOperation } from '@nestjs/swagger';

@ApiTags('Delivery')
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new delivery method' })
  @ApiBody({
    type: CreateDeliveryDto,
    examples: {
      default: {
        summary: 'Create delivery',
        value: {
          name: 'Grab VN',
          description: 'Fast delivery with Grab',
          fee: 30000,
          estimatedTime: '30-45 mins',
          isAvailable: true,
        },
      },
    },
  })
  create(@Body() dto: CreateDeliveryDto) {
    return this.deliveryService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all delivery methods' })
  findAll() {
    return this.deliveryService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get delivery method by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  findById(@Param('id') id: number) {
    return this.deliveryService.findById(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update delivery method by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({
    type: UpdateDeliveryDto,
    examples: {
      default: {
        summary: 'Update delivery',
        value: {
          name: 'Grab Express',
          description: 'Express delivery',
          fee: 40000,
          estimatedTime: '20-30 mins',
          isAvailable: false,
        },
      },
    },
  })
  update(@Param('id') id: number, @Body() dto: UpdateDeliveryDto) {
    return this.deliveryService.update(id, dto);
  }

  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Delete delivery method by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  remove(@Param('id') id: number) {
    return this.deliveryService.remove(id);
  }
}
