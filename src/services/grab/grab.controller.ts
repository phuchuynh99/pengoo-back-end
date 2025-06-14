import { Controller, Post, Body } from '@nestjs/common';
import { GrabService } from './grab.service';

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