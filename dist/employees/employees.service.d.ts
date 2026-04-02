import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { LeaveRequest } from './entities/leave-request.entity';
import { GetEmployeesQueryDto } from './dto/get-employees-query.dto';
export declare class EmployeesService {
    private readonly employeeRepo;
    private readonly leaveRequestRepo;
    constructor(employeeRepo: Repository<Employee>, leaveRequestRepo: Repository<LeaveRequest>);
    findAll(query: GetEmployeesQueryDto): Promise<{
        data: Employee[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getDepartmentEmployeeCounts(): Promise<any[]>;
    getEmployeesOnLeave(startDate: Date, endDate: Date): Promise<any[]>;
    getTopEarnersByDepartment(): Promise<any[]>;
}
