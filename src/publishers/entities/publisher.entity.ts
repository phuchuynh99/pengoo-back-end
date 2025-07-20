import { Product } from "../../products/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('publisher')
export class Publisher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Product, (product: Product) => product.publisher_ID)
    products: Product[];
}
