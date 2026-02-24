import { Controller, Post, Body } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { AccessTokenAuth } from '@/common/decorators/access-token.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/types/authenticated-user';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';

@Controller('invitations')
@AccessTokenAuth()
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  @Roles('ADMIN', 'OWNER')
  async invite(
    @Body('email') email: string,
    @Body('role') role: any,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.invitationsService.createInvitation(email, role, user.orgId);
  }

  @Post('accept')
  async accept(@Body() dto: AcceptInvitationDto) {
    return this.invitationsService.acceptInvitation(dto);
  }
}
