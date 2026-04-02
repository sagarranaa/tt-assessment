import { EmployeesService } from './employees.service';
import { GetEmployeesQueryDto } from './dto/get-employees-query.dto';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    findAll(query: GetEmployeesQueryDto): Promise<{
        data: import("./entities/employee.entity").Employee[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getDepartmentCounts(): Promise<any[]>;
    getOnLeave(startDate: string, endDate: string): Promise<any[]>;
    getTopEarners(): Promise<any[]>;
    findOne(id: number, tenantId: string): {
        id: number;
        tenantId: string;
        message: string;
    };
}
