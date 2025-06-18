import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderDetail, PaymentStatus, ProductStatus } from './order.entity'; // Import PaymentStatus and ProductStatus
import { CreateOrderDto } from './create-orders.dto';
import { UpdateOrderStatusDto } from './update-orders-status.dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Delivery } from '../delivery/delivery.entity';
import { CouponsService } from '../coupons/coupons.service'; // <-- Add this import
import { PayosService } from 'src/payos/payos.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly payosService: PayosService,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailsRepository: Repository<OrderDetail>,
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
    private usersService: UsersService,
    private productsService: ProductsService,
    private notificationsService: NotificationsService,
    private couponsService: CouponsService,
  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const {
      userId,
      delivery_id,
      payment_type,
      shipping_address,
      payment_status,
      productStatus,
      details,
      couponCode,
    } = createOrderDto;

    let total_price = createOrderDto.total_price;

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

    let coupon_id: number | null = null;
    let coupon_code: string | null = null;

    if (couponCode) {
      const { coupon, discount } = await this.couponsService.validateAndApply(
        couponCode,
        total_price,
        userId,
        details.map(d => d.productId)
      );
      total_price = total_price - discount;
      coupon_id = coupon.id;
      coupon_code = coupon.code;
    }

    const order = this.ordersRepository.create({
      user: userEntity,
      delivery,
      coupon_id,
      coupon_code,
      payment_type,
      total_price,
      shipping_address,
      payment_status: payment_status as PaymentStatus,
      productStatus: productStatus as ProductStatus,
      details: orderDetails,
    });
    const savedOrder = await this.ordersRepository.save(order);
    if (payment_type === "payos") {
      const checkout_url = this.createOrderPayOS(2000)
      return checkout_url
    }
    // await this.notificationsService.sendOrderConfirmation(userEntity.email, savedOrder.id); 
    return savedOrder;
  }
  generateSafeOrderCode = (): number => {
    const min = 1000000000000;
    const max = 9007199254740991;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  async createOrderPayOS(amount: number) {

    const checkout = {
      orderCode: +(this.generateSafeOrderCode()),
      amount: 2000,
      description: "VQRIO123",
      cancelUrl: "https://your-cancel-url.com",
      returnUrl: "https://your-success-url.com"
    }
    const result = await this.payosService.createInvoice(checkout);
    return result.data.checkoutUrl;

  }
  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ relations: ['user', 'details', 'details.product', 'delivery'] });
  }

  async findById(orderId: number): Promise<Order | null> {
    return this.ordersRepository.findOne({ where: { id: orderId } });
  }

  async updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.productStatus = updateOrderStatusDto.productStatus as ProductStatus;
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
