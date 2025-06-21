import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ReadingType } from './readingType.entity';
import { Module } from './module.entity';
import { Reading } from './reading.entity';

@Entity('tbl_configurations')
export class Configuration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'min_value', type: 'decimal', precision: 10, scale: 2, default: 0 })
  minValue: number;

  @Column({ name: 'max_value', type: 'decimal', precision: 10, scale: 2, default: 0 })
  maxValue: number;

  @Column({ name: 'module_id'})
  moduleId: number;

  @Column({ name: 'reading_type_id'})
  readingTypeId: number;

  @ManyToOne(() => ReadingType, (readingType) => readingType.configurations)
  @JoinColumn({ name: 'reading_type_id' })
  readingType: ReadingType;

  @ManyToOne(() => Module, (module) => module.configurations)
  @JoinColumn({ name: 'module_id' })
  module: Module;

  @OneToMany(()=>Reading, reading => reading.configuration)
  readings: Reading[]
  
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'deleted', type: 'boolean', default: false })
  deleted: boolean;
}
