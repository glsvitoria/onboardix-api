import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/types/authenticated-user';
import { ProtectedRoles } from '@/common/decorators/protected-routes';
import { RefreshTokenProtected } from '@/common/decorators/refresh-token';
import { CurrentRefreshToken } from '@/common/decorators/current-refresh-token';
import type { RefreshTokenUser } from '@/common/types/refresh-token-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @ProtectedRoles()
  async profile(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.profile(user.sub, user.orgId);
  }

  @Post('/refresh')
  @RefreshTokenProtected()
  async refreshToken(@CurrentRefreshToken() user: RefreshTokenUser) {
    return this.authService.refresh(user.sub, user.refreshToken);
  }

  @Post('/validate')
  @ProtectedRoles()
  async validateSession(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.validate(user.sub, user.orgId);
  }
}
