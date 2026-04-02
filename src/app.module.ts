import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { EmployeesModule } from './employees/employees.module';
import { Employee } from './employees/entities/employee.entity';
import { LeaveRequest } from './employees/entities/leave-request.entity';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    // Load .env globally
    ConfigModule.forRoot({ isGlobal: true }),

    // PostgreSQL connection using .env values
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get<string>('DB_HOST') ?? 'localhost',
        port: +(cfg.get<string>('DB_PORT') ?? '5432'),
        username: cfg.get<string>('DB_USERNAME') ?? 'postgres',
        password: cfg.get<string>('DB_PASSWORD') ?? 'root',
        database: cfg.get<string>('DB_NAME') ?? 'transforma_db',
        entities: [Employee, LeaveRequest],
        synchronize: true,
      }),
    }),

    EmployeesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'health', method: RequestMethod.GET }, // /health skipped
      )
      .forRoutes('*'); // apply to every other route
  }
}
