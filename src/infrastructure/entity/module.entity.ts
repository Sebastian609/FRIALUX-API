import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Configuration } from './configuration.entity';

@Entity('tbl_modules')
export class Module {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', length: 40 })
  name: string;

  @Column({ name: 'web_socket_room', length: 10, unique: true })
  webSocketRoom: string;

  @OneToMany(()=>Configuration, configuration => configuration.readingType)
  configurations: Configuration[]

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'deleted', default: false })
  deleted: boolean;
}
