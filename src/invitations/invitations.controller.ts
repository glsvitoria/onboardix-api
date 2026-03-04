import { Controller, Post, Body, Get, Query, HttpStatus } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/types/authenticated-user';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { UserRole } from '@/generated/prisma/enums';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { FindAllPaginationDto } from './dto/find-all-pagination.dto';
import { ProtectedRoles } from '@/common/decorators/protected-routes';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post('accept')
  async accept(@Body() acceptInvitationDto: AcceptInvitationDto) {
    return this.invitationsService.acceptInvitation(acceptInvitationDto);
  }

  @Post()
  @ProtectedRoles(UserRole.ADMIN, UserRole.OWNER)
  async invite(
    @Body() createInvitationDto: CreateInvitationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.invitationsService.createInvitation(
      user.sub,
      user.orgId,
      createInvitationDto,
    );
  }

  @Get()
  @ProtectedRoles(UserRole.ADMIN, UserRole.OWNER)
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() findAllPaginationDto: FindAllPaginationDto,
  ) {
    return this.invitationsService.list(user.orgId, findAllPaginationDto);
  }

  @Get('validate')
  async validate(@Query('token') token: string) {
    return this.invitationsService.validate(token);
  }
}
