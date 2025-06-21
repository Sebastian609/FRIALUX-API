import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";

import { Configuration } from "./configuration.entity";
import { Notification } from "./notification.entity";

@Entity("tbl_readings")
export class Reading {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  value: number;

  @Column({ name: "configuration_id", type: "int" })
  configurationId: number;

  @ManyToOne(() => Configuration, (configuration) => configuration.readings)
  @JoinColumn({ name: "configuration_id" })
  configuration: Configuration;

  @OneToOne(() => Reading, (reading) => reading.notification)
  notification: Notification;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive: boolean;

  @Column({ name: "deleted", type: "boolean", default: false })
  deleted: boolean;
}
