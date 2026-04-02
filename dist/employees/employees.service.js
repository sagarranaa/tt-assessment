"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("./entities/employee.entity");
const leave_request_entity_1 = require("./entities/leave-request.entity");
const ALLOWED_SORT = ['name', 'email', 'department', 'salary', 'createdAt'];
let EmployeesService = class EmployeesService {
    employeeRepo;
    leaveRequestRepo;
    constructor(employeeRepo, leaveRequestRepo) {
        this.employeeRepo = employeeRepo;
        this.leaveRequestRepo = leaveRequestRepo;
    }
    async findAll(query) {
        const { page, limit, search, department, sortBy, order } = query;
        const skip = (page - 1) * limit;
        const col = ALLOWED_SORT.includes(sortBy) ? sortBy : 'createdAt';
        const qb = this.employeeRepo.createQueryBuilder('emp');
        if (search) {
            qb.andWhere('(LOWER(emp.name) LIKE :q OR LOWER(emp.email) LIKE :q)', { q: `%${search.toLowerCase()}%` });
        }
        if (department) {
            qb.andWhere('emp.department = :department', { department });
        }
        const [data, total] = await qb
            .orderBy(`emp.${col}`, order)
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getDepartmentEmployeeCounts() {
        return this.employeeRepo
            .createQueryBuilder('emp')
            .select('emp.department', 'department_name')
            .addSelect(`SUM(CASE WHEN emp."isActive" = true THEN 1 ELSE 0 END)`, 'active_count')
            .groupBy('emp.department')
            .orderBy('emp.department', 'ASC')
            .getRawMany();
    }
    async getEmployeesOnLeave(startDate, endDate) {
        return this.employeeRepo
            .createQueryBuilder('emp')
            .innerJoin('emp.leaveRequests', 'lr')
            .where('lr.status = :status', { status: 'pending' })
            .andWhere('lr.startDate <= :endDate', { endDate })
            .andWhere('lr.endDate >= :startDate', { startDate })
            .select(['emp.id', 'emp.name', 'emp.email', 'emp.department'])
            .addSelect(['lr.startDate', 'lr.endDate', 'lr.leaveType'])
            .distinct(true)
            .getRawMany();
    }
    async getTopEarnersByDepartment() {
        const rows = await this.employeeRepo.query(`
      SELECT
        department  AS dept,
        name,
        salary,
        RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rank
      FROM employees
      WHERE "isActive" = true
    `);
        return rows.filter((r) => Number(r.rank) <= 3);
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(1, (0, typeorm_1.InjectRepository)(leave_request_entity_1.LeaveRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map