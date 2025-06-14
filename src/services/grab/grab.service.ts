import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GrabService {
  private apiUrl: string;
  private clientId: string;
  private clientSecret: string;
  private partnerId: string;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('GRAB_API_URL') ?? (() => { throw new Error('GRAB_API_URL is not defined'); })();
    this.clientId = this.configService.get<string>('GRAB_CLIENT_ID') ?? (() => { throw new Error('GRAB_CLIENT_ID is not defined'); })();
    this.clientSecret = this.configService.get<string>('GRAB_CLIENT_SECRET') ?? (() => { throw new Error('GRAB_CLIENT_SECRET is not defined'); })();
    this.partnerId = this.configService.get<string>('GRAB_PARTNER_ID') ?? (() => { throw new Error('GRAB_PARTNER_ID is not defined'); })();
  }

  // Example: Get delivery quote
  async getQuote(pickup: any, dropoff: any, packageDetails: any) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/deliveries/quotes`,
        {
          origin: pickup,
          destination: dropoff,
          package: packageDetails,
          serviceType: 'INSTANT', // or 'SCHEDULED'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Client-Id': this.clientId,
            'X-Client-Secret': this.clientSecret,
            'X-Partner-Id': this.partnerId,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || error.message, error.response?.status || 500);
    }
  }

  // Example: Create delivery order
  async createOrder(orderDetails: any) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/deliveries`,
        orderDetails,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Client-Id': this.clientId,
            'X-Client-Secret': this.clientSecret,
            'X-Partner-Id': this.partnerId,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || error.message, error.response?.status || 500);
    }
  }
}