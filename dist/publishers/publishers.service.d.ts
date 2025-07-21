import { Repository } from 'typeorm';
import { Publisher } from './entities/publisher.entity';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
export declare class PublishersService {
    private readonly publishersRepository;
    constructor(publishersRepository: Repository<Publisher>);
    create(createPublisherDto: CreatePublisherDto): Promise<Publisher>;
    findAll(): Promise<Publisher[]>;
    findOne(id: number): Promise<Publisher>;
    update(id: number, updateDto: UpdatePublisherDto): Promise<Publisher>;
    remove(id: number): Promise<void>;
}
