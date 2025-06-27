// src/posts/post-catalogue.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Admin } from '../admins/admin.entity';

@Entity('post_catalogues')
export class PostCatalogue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  canonical: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  meta_description: string;

  @Column({ nullable: true })
  meta_keyword: string;

  @Column({ nullable: true })
  meta_title: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  order: number;

  @Column({ default: true })
  publish: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Admin, admin => admin.id)
  admin: Admin;
}