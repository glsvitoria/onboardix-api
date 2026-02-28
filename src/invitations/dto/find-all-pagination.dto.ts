import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';
import { Prisma } from '@/generated/prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

enum LogSortFieldEnum {
  CreatedAt = 'createdAt',
}

export class FindAllPaginationDto extends PaginationQueryDto<'createdAt'> {
  @IsEnum(LogSortFieldEnum)
  @IsOptional()
  sort: LogSortFieldEnum = LogSortFieldEnum.CreatedAt;

  @IsString()
  @IsOptional()
  organizationId: string;

  where(): Prisma.InvitationWhereInput {
    const AND: Prisma.Enumerable<Prisma.InvitationWhereInput> = [];

    return {
      AND,
    };
  }
}
