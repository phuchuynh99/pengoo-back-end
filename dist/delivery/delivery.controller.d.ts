import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
export declare class DeliveryController {
    private readonly deliveryService;
    constructor(deliveryService: DeliveryService);
    create(dto: CreateDeliveryDto): Promise<import("./delivery.entity").Delivery>;
    findAll(): Promise<import("./delivery.entity").Delivery[]>;
    findById(id: number): Promise<import("./delivery.entity").Delivery>;
    update(id: number, dto: UpdateDeliveryDto): Promise<import("./delivery.entity").Delivery>;
    remove(id: number): Promise<import("./delivery.entity").Delivery>;
}
