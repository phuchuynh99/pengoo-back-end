import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // e.g. 'Grab VN'

  @Column({ nullable: true })
  apiKey?: string;

  @Column({ nullable: true })
  apiSecret?: string;

  @Column({ nullable: true })
  description?: string;
}