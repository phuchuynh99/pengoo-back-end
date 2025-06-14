import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderDetail } from './order.entity';
import { CreateOrderDto } from './create-orders.dto';
import { UpdateOrderStatusDto } from './update-orders-status.dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Delivery } from '../delivery/delivery.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailsRepository: Repository<OrderDetail>,
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
    private usersService: UsersService,
    private productsService: ProductsService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const {
      userId,
      delivery_id, // <-- Use delivery_id as in your DTO
      coupon_id,
      payment_type,
      total_price,
      shipping_address,
      payment_status,
      discount,
      productStatus,
      details, // <-- Use details, not items
    } = createOrderDto;

    const userEntity = await this.usersService.findById(userId);
    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    const delivery = await this.deliveryRepository.findOne({ where: { id: delivery_id } });
    if (!delivery) throw new NotFoundException('Delivery method not found');

    const orderDetails: OrderDetail[] = [];
    for (const item of details) {
      const product = await this.productsService.findById(item.productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }
      const orderDetail = this.orderDetailsRepository.create({
        product,
        quantity: item.quantity,
        price: item.price,
      });
      orderDetails.push(orderDetail);
    }

    const order = this.ordersRepository.create({
      user: userEntity,
      delivery,
      coupon_id,
      payment_type,
      total_price,
      shipping_address,
      payment_status,
      discount,
      productStatus,
      details: orderDetails, // <-- Use details
    });

    const savedOrder = await this.ordersRepository.save(order);
    await this.notificationsService.sendOrderConfirmation(userEntity.email, savedOrder.id);
    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ relations: ['user', 'details', 'details.product', 'delivery'] });
  }

  async findById(orderId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'details', 'details.product', 'delivery'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.productStatus = updateOrderStatusDto.productStatus;
    return this.ordersRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    await this.ordersRepository.remove(order);
  }
}
