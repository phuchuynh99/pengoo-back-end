import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // e.g. 'Grab VN'

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'decimal', nullable: true })
  fee?: number;

  @Column({ nullable: true })
  estimatedTime?: string; // e.g. '30-45 mins'

  @Column({ default: true })
  isAvailable: boolean;
}