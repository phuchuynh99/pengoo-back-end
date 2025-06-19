import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './update-orders-status.dto';
import { CreateOrderDto } from './create-orders.dto';
import { Public } from '../auth/public.decorator'; // Add this import

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Public()
  @ApiBody({
    type: CreateOrderDto,
    examples: {
      default: {
        summary: 'Create a new order',
        value: {
          userId: 1,
          delivery_id: 2,
          payment_type: 'paypal',
          total_price: 100,
          shipping_address: '123 Main St, City, Country',
          payment_status: 'pending',
          productStatus: 'pending',
          couponCode: 'SUMMER2024',
          details: [
            {
              productId: 10,
              quantity: 2,
              price: 30
            },
            {
              productId: 12,
              quantity: 1,
              price: 40
            }
          ]
        }
      }
    }
  })
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Patch(':id/status')
  @Public()
  @ApiBody({
    type: UpdateOrderStatusDto,
    examples: {
      default: {
        summary: 'Update order status',
        value: {
          productStatus: 'shipped'
        }
      }
    }
  })
  updateOrderStatus(@Param('id') id: number, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }

  @Get()
  @Public()
  findAllOrders() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @Public()
  findOrderById(@Param('id') id: number) {
    return this.ordersService.findById(id);
  }

  @Delete(':id')
  @Public()
  removeOrder(@Param('id') id: number) {
    return this.ordersService.remove(id);
  }
}
