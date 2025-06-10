import { Injectable } from '@nestjs/common';
import { Order } from '../../orders/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import easyinvoice from 'easyinvoice';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async generateInvoice(orderId: number): Promise<string> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const invoiceData = {
      documentTitle: 'Invoice',
      sender: {
        company: 'Your Company Name',
        address: 'Your Address',
        zip: 'Your Zip',
        city: 'Your City',
        country: 'Your Country',
      },
      client: {
        company: order.user.full_name,
        address: order.user.address || '',
        zip: '',
        city: '',
        country: '',
        email: order.user.email,
      },
      invoiceNumber: order.id.toString(),
      invoiceDate: order.order_date.toISOString().split('T')[0],
      products: order.items.map(item => ({
        quantity: item.quantity.toString(),
        description: item.product.product_name,
        price: item.price,
        tax: 0,
      })),
      bottomNotice: 'Thank you for your purchase!',
    };

    const invoicesDir = path.join(process.cwd(), 'invoices');
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    const result = await easyinvoice.createInvoice(invoiceData);
    const invoicePath = path.join(invoicesDir, `invoice_${order.id}.pdf`);
    fs.writeFileSync(invoicePath, result.pdf, 'base64');

    return invoicePath;
  }
}
