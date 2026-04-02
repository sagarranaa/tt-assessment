import { Employee } from './employee.entity';
export declare enum LeaveType {
    ANNUAL = "annual",
    SICK = "sick",
    UNPAID = "unpaid"
}
export declare enum LeaveStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class LeaveRequest {
    id: number;
    employee: Employee;
    employeeId: number;
    leaveType: LeaveType;
    status: LeaveStatus;
    startDate: string;
    endDate: string;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
}
