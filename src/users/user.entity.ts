import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true, nullable: false })
  username: string;

  @Column({ length: 100, nullable: false })
  full_name: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ length: 100, unique: true, nullable: false })
  email: string;

  @Column({ length: 50, nullable: false, default: 'USER' })
  role: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @Column({ nullable: false, default: true })
  status: boolean;

  @Column({ type: 'text', nullable: true })
  address: string;

 

  // constructor(userData: Partial<User>) {
  //   this.username = userData.username || '';
  //   this.full_name = userData.full_name || '';
  //   this.password = userData.password || '';
  //   this.phone_number = userData.phone_number || '';
  //   this.avatar_url = userData.avatar_url || '';
  //   this.status = userData.status !== undefined ? userData.status : true;
  //   this.address = userData.address || '';
  //   this.role = userData.role || 'USER';
  // }
}