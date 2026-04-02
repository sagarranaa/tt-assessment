import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { LeaveRequest } from './entities/leave-request.entity';
import { GetEmployeesQueryDto } from './dto/get-employees-query.dto';

const ALLOWED_SORT = ['name', 'email', 'department', 'salary', 'createdAt'];

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,

    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepo: Repository<LeaveRequest>,
  ) {}

  // ── Q5: Paginated employee listing ─────────────────────────────────
  async findAll(query: GetEmployeesQueryDto) {
    const { page, limit, search, department, sortBy, order } = query;
    const skip = (page - 1) * limit;

    // Sanitise sortBy to prevent SQL injection via column name
    const col = ALLOWED_SORT.includes(sortBy!) ? sortBy! : 'createdAt';

    const qb = this.employeeRepo.createQueryBuilder('emp');

    if (search) {
      qb.andWhere(
        '(LOWER(emp.name) LIKE :q OR LOWER(emp.email) LIKE :q)',
        { q: `%${search.toLowerCase()}%` },
      );
    }

    if (department) {
      qb.andWhere('emp.department = :department', { department });
    }

    const [data, total] = await qb
      .orderBy(`emp.${col}`, order as 'ASC' | 'DESC')
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

  // ── Q4A: Department employee counts (including zero-count depts) ────
  async getDepartmentEmployeeCounts(): Promise<any[]> {
    return this.employeeRepo
      .createQueryBuilder('emp')
      .select('emp.department', 'department_name')
      .addSelect(
        `SUM(CASE WHEN emp."isActive" = true THEN 1 ELSE 0 END)`,
        'active_count',
      )
      .groupBy('emp.department')
      .orderBy('emp.department', 'ASC')
      .getRawMany();
  }

  // ── Q4B: Employees with pending leave overlapping a date range ──────
  async getEmployeesOnLeave(startDate: Date, endDate: Date): Promise<any[]> {
    return this.employeeRepo
      .createQueryBuilder('emp')
      .innerJoin('emp.leaveRequests', 'lr')
      .where('lr.status = :status', { status: 'pending' })
      // Overlap: lr.startDate <= endDate AND lr.endDate >= startDate
      .andWhere('lr.startDate <= :endDate', { endDate })
      .andWhere('lr.endDate >= :startDate', { startDate })
      .select(['emp.id', 'emp.name', 'emp.email', 'emp.department'])
      .addSelect(['lr.startDate', 'lr.endDate', 'lr.leaveType'])
      .distinct(true)
      .getRawMany();
  }

  // ── Q4C: Top 3 highest-paid employees per department ────────────────
  async getTopEarnersByDepartment(): Promise<any[]> {
    // Use PostgreSQL window function RANK() for clean per-dept ranking
    const rows = await this.employeeRepo.query(`
      SELECT
        department  AS dept,
        name,
        salary,
        RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rank
      FROM employees
      WHERE "isActive" = true
    `);

    // Filter to only top 3 per department
    return rows.filter((r: any) => Number(r.rank) <= 3);
  }
}