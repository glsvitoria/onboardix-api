import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';
import { Prisma } from '@/generated/prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

enum EmployeesResumeSortFieldEnum {
  CreatedAt = 'createdAt',
}

export class EmployeesResumePaginationDto extends PaginationQueryDto<'createdAt'> {
  @IsEnum(EmployeesResumeSortFieldEnum)
  @IsOptional()
  sort: EmployeesResumeSortFieldEnum = EmployeesResumeSortFieldEnum.CreatedAt;

  @IsString()
  @IsOptional()
  organizationId: string;

  where(): Prisma.UserWhereInput {
    const AND: Prisma.Enumerable<Prisma.UserWhereInput> = [];

    if (this.organizationId) {
      AND.push({
        organizationId: this.organizationId,
      });
    }

    return {
      AND,
    };
  }
}
