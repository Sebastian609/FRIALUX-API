import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne
} from 'typeorm';
import { Reading } from './reading.entity';

@Entity('tbl_notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'sent_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sentAt: Date;

  @Column({ name: 'reading_id', type: 'int' })
  readingId: number;

  @OneToOne(() => Reading, reading => reading.notification)
  @JoinColumn({ name: 'reading_id' })
  reading: Reading;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'deleted', type: 'boolean', default: false })
  deleted: boolean;
}
