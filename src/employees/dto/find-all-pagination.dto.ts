import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';
import { Prisma } from '@/generated/prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

enum LogSortFieldEnum {
  CreatedAt = 'createdAt',
}

export class FindAllPaginationDto extends PaginationQueryDto<'createdAt'> {
  @IsEnum(LogSortFieldEnum)
  @IsOptional()
  sort: LogSortFieldEnum = LogSortFieldEnum.CreatedAt;

  @IsString()
  @IsNotEmpty()
  organizationId: string;

  where(): Prisma.UserWhereInput {
    const AND: Prisma.Enumerable<Prisma.UserWhereInput> = [];

    return {
      AND,
    };
  }
}
