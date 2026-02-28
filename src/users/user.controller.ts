import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/types/authenticated-user';
import { Controller, Patch, Body } from '@nestjs/common';
import { UsersService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AccessTokenAuth } from '@/common/decorators/access-token.decorator';

@Controller('users')
@AccessTokenAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('/profile')
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.sub, user.orgId, dto);
  }

  @Patch('/profile/password')
  async updatePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(user.sub, user.orgId, dto);
  }
}
