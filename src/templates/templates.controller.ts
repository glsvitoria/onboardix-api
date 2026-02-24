import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { UserRole } from '@/generated/prisma/enums';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/types/authenticated-user';
import { Roles } from '@/common/decorators/roles.decorator';
import { AccessTokenAuth } from '@/common/decorators/access-token.decorator';
import { FindAllPaginationDto } from './dto/find-all-pagination.dto';
import { ValidationUUID } from '@/common/pipes/validation-uuid.pipe';

@Controller('templates')
@AccessTokenAuth()
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateTemplateDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.templatesService.create(dto, user.orgId);
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() findAllPaginationDto: FindAllPaginationDto,
  ) {
    return this.templatesService.findAll(findAllPaginationDto, user.orgId);
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ValidationUUID()) id: string,
  ) {
    return this.templatesService.findOne(id, user.orgId);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async update(
    @Body() updateTemplateDto: UpdateTemplateDto,
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ValidationUUID()) id: string,
  ) {
    return this.templatesService.update(id, updateTemplateDto, user.orgId);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ValidationUUID()) id: string,
  ) {
    return this.templatesService.remove(id, user.orgId);
  }
}
