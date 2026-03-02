import { StrategiesHelper } from '@/common/helpers/strategies.helper'
import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
@Injectable()
export class RefreshTokenGuard extends AuthGuard(
	StrategiesHelper.REFRESH_TOKEN_STRATEGY
) {}
