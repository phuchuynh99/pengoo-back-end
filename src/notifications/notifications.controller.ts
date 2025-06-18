import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send-email')
  @ApiBody({
    schema: {
      example: {
        to: 'recipient@example.com',
        subject: 'Test Email',
        message: 'This is a test email sent from the API.',
      },
    },
  })
  async sendEmail(
    @Body() body: { to: string; subject: string; message: string },
  ) {
    if (!body.to || !body.subject || !body.message) {
      throw new BadRequestException('Missing required fields: to, subject, message');
    }
    await this.notificationsService.sendEmail(body.to, body.subject, body.message);
    return { message: 'Email sent.' };
  }

  @Post('order-confirmation')
  @ApiBody({
    schema: {
      example: {
        email: 'customer@example.com',
        orderId: 1234,
      },
    },
  })
  async sendOrderConfirmation(
    @Body() body: { email: string; orderId: number },
  ) {
    if (!body.email || !body.orderId) {
      throw new BadRequestException('Missing required fields: email, orderId');
    }
    await this.notificationsService.sendOrderConfirmation(body.email, body.orderId);
    return { message: 'Order confirmation email sent.' };
  }

  @Post('shipping-update')
  @ApiBody({
    schema: {
      example: {
        email: 'customer@example.com',
        orderId: 1234,
        status: 'shipped',
      },
    },
  })
  async sendShippingUpdate(
    @Body() body: { email: string; orderId: number; status: string },
  ) {
    if (!body.email || !body.orderId || !body.status) {
      throw new BadRequestException('Missing required fields: email, orderId, status');
    }
    await this.notificationsService.sendShippingUpdate(body.email, body.orderId, body.status);
    return { message: 'Shipping update email sent.' };
  }

  @Post('password-reset')
  @ApiBody({
    schema: {
      example: {
        email: 'user@example.com',
        token: 'reset-token-from-email',
      },
    },
  })
  async sendPasswordReset(
    @Body() body: { email: string; token: string },
  ) {
    if (!body.email || !body.token) {
      throw new BadRequestException('Missing required fields: email, token');
    }
    await this.notificationsService.sendPasswordReset(body.email, body.token);
    return { message: 'Password reset email sent.' };
  }
}
