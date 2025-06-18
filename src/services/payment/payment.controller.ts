import { Controller, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { PaymentsService } from './payment.service';
import { PaymentMethod } from './payment.types';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('pay/:orderId')
  @ApiBody({
    schema: {
      example: {
        method: 'paypal' // or 'on_delivery'
      }
    }
  })
  async pay(
    @Param('orderId') orderId: number,
    @Body('method') method: PaymentMethod,
    @Req() req,
  ) {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    return this.paymentsService.pay(orderId, method, userId, userRole);
  }

  @Post('refund/:orderId')
  @ApiBody({
    schema: {
      example: {}
    }
  })
  async refundOrder(@Param('orderId') orderId: number, @Req() req) {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    return this.paymentsService.refundOrder(orderId, userId, userRole);
  }

  @Post('cancel/:orderId')
  @ApiBody({
    schema: {
      example: {}
    }
  })
  async cancelOrder(@Param('orderId') orderId: number, @Req() req) {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    return this.paymentsService.cancelOrder(orderId, userId, userRole);
  }

  @Post('paypal/capture/:orderId')
  @ApiBody({
    schema: {
      example: {}
    }
  })
  async capturePaypal(@Param('orderId') orderId: number, @Req() req) {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    return this.paymentsService.handlePaypalCapture(orderId, userId, userRole);
  }
}