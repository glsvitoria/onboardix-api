import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { AccessTokenAuth } from '@/common/decorators/access-token.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/types/authenticated-user';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { UserRole } from '@/generated/prisma/enums';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { FindAllPaginationDto } from './dto/find-all-pagination.dto';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post('accept')
  async accept(@Body() acceptInvitationDto: AcceptInvitationDto) {
    return this.invitationsService.acceptInvitation(acceptInvitationDto);
  }

  @Post()
  @AccessTokenAuth()
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async invite(
    @Body() createInvitationDto: CreateInvitationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.invitationsService.createInvitation(
      createInvitationDto,
      user.orgId,
    );
  }

  @Get()
  @AccessTokenAuth()
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() findAllPaginationDto: FindAllPaginationDto,
  ) {
    return this.invitationsService.list(user.orgId, findAllPaginationDto);
  }
}
