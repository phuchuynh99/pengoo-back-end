import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;
  private from: string;

  constructor(private configService: ConfigService) {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    if (!emailUser) {
      throw new Error('EMAIL_USER environment variable is not set');
    }
    this.from = emailUser;
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.from,
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendOrderConfirmation(email: string, orderId: number) {
    const mailOptions = {
      from: this.from,
      to: email,
      subject: 'Order Confirmation',
      text: `Your order with ID ${orderId} has been confirmed.`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendShippingUpdate(email: string, orderId: number, status: string) {
    const mailOptions = {
      from: this.from,
      to: email,
      subject: 'Shipping Update',
      text: `Your order with ID ${orderId} is now ${status}.`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
