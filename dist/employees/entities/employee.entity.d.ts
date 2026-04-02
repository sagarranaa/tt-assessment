import { LeaveRequest } from './leave-request.entity';
export declare class Employee {
    id: number;
    name: string;
    email: string;
    department: string;
    salary: number;
    isActive: boolean;
    leaveRequests: LeaveRequest[];
    createdAt: Date;
    updatedAt: Date;
}
