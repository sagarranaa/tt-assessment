export declare class GetEmployeesQueryDto {
    page: number;
    limit: number;
    search?: string;
    department?: string;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
}
