import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from './delivery.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
  ) {}

  create(dto: CreateDeliveryDto) {
    const delivery = this.deliveryRepository.create(dto);
    return this.deliveryRepository.save(delivery);
  }

  findAll() {
    return this.deliveryRepository.find();
  }

  async findById(id: number) {
    const delivery = await this.deliveryRepository.findOne({ where: { id } });
    if (!delivery) throw new NotFoundException('Delivery method not found');
    return delivery;
  }

  async update(id: number, dto: UpdateDeliveryDto) {
    const delivery = await this.findById(id);
    Object.assign(delivery, dto);
    return this.deliveryRepository.save(delivery);
  }

  async remove(id: number) {
    const delivery = await this.findById(id);
    return this.deliveryRepository.remove(delivery);
  }
}
