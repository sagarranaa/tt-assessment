import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { GetEmployeesQueryDto } from './dto/get-employees-query.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // Q5: Paginated listing with search / filter / sort
  @Get()
  findAll(@Query() query: GetEmployeesQueryDto) {
    return this.employeesService.findAll(query);
  }

  // Q4A: Department counts
  @Get('stats/departments')
  getDepartmentCounts() {
    return this.employeesService.getDepartmentEmployeeCounts();
  }

  // Q4B: Employees on leave in a date range
  // e.g. GET /employees/stats/on-leave?startDate=2025-04-01&endDate=2025-04-07
  @Get('stats/on-leave')
  getOnLeave(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.employeesService.getEmployeesOnLeave(
      new Date(startDate),
      new Date(endDate),
    );
  }

  // Q4C: Top earners per department
  @Get('stats/top-earners')
  getTopEarners() {
    return this.employeesService.getTopEarnersByDepartment();
  }

  // Demo: shows how @Param and @Headers work (Q10)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return { id, tenantId, message: 'Single employee endpoint' };
  }
}