import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Product } from 'src/products/product.entity';

@Entity()
export class CreateCollectionDto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ length: 255, nullable: true })
    image_url: string;

    @CreateDateColumn({ default: new Date() })
    createdAt: Date;

    @UpdateDateColumn({ default: new Date() })
    updatedAt: Date;

    @OneToMany(() => Product, product => product.collection)
    products: Product[];
}
