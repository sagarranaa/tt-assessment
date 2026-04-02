import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';
import { LeaveRequest } from './entities/leave-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, LeaveRequest])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}