import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { LeaveRequest } from './leave-request.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column({ unique: true, length: 180 })
  email: string;

  @Column({ length: 100 })
  department: string;

  @Column('decimal', { precision: 12, scale: 2 })
  salary: number;

  @Column({ default: true })
  isActive: boolean;

  // CASCADE: deleting an employee removes all their leave requests
  @OneToMany(() => LeaveRequest, (lr) => lr.employee, { cascade: true })
  leaveRequests: LeaveRequest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}