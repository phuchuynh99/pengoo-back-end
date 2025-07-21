import { Repository } from 'typeorm';
import { Delivery } from './delivery.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
export declare class DeliveryService {
    private deliveryRepository;
    constructor(deliveryRepository: Repository<Delivery>);
    create(dto: CreateDeliveryDto): Promise<Delivery>;
    findAll(): Promise<Delivery[]>;
    findById(id: number): Promise<Delivery>;
    update(id: number, dto: UpdateDeliveryDto): Promise<Delivery>;
    remove(id: number): Promise<Delivery>;
}
