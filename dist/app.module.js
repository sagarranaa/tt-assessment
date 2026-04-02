"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const tenant_middleware_1 = require("./common/middleware/tenant.middleware");
const employees_module_1 = require("./employees/employees.module");
const employee_entity_1 = require("./employees/entities/employee.entity");
const leave_request_entity_1 = require("./employees/entities/leave-request.entity");
const app_controller_1 = require("./app.controller");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(tenant_middleware_1.TenantMiddleware)
            .exclude({ path: 'health', method: common_1.RequestMethod.GET })
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [app_controller_1.AppController],
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (cfg) => ({
                    type: 'postgres',
                    host: cfg.get('DB_HOST') ?? 'localhost',
                    port: +(cfg.get('DB_PORT') ?? '5432'),
                    username: cfg.get('DB_USERNAME') ?? 'postgres',
                    password: cfg.get('DB_PASSWORD') ?? 'root',
                    database: cfg.get('DB_NAME') ?? 'transforma_db',
                    entities: [employee_entity_1.Employee, leave_request_entity_1.LeaveRequest],
                    synchronize: true,
                }),
            }),
            employees_module_1.EmployeesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map