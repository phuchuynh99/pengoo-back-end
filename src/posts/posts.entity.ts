import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PostCatalogue } from './post-catalogue.entity';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  canonical: string;

  @Column({ nullable: true })
  description: string;

  @Column('text')
  content: string;

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

  @ManyToOne(() => PostCatalogue, catalogue => catalogue.id)
  catalogue: PostCatalogue;

  @Column({ nullable: true })
  textColor?: string;

  @Column({ nullable: true })
  bgColor?: string;

  @Column({ nullable: true })
  fontFamily?: string;

  @Column({ nullable: true })
  fontSize?: string;
}