import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Configuration } from './configuration.entity';

@Entity('tbl_reading_types')
export class ReadingType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length:20})
  name: string;

  @Column({length:10})
  simbol: string;

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
