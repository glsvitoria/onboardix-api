import { Controller, Body, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { VerificationRequestService } from './verification-request.service';
import { CreateVerificationRequestDto } from './dto/create-verification-request.dto';
import { ValidateVerificationRequestDto } from './dto/validate-verification-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('verification-request')
export class VerificationRequestController {
  constructor(
    private readonly verificationRequestService: VerificationRequestService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateVerificationRequestDto) {
    return this.verificationRequestService.create(data);
  }

  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordDto) {
    return this.verificationRequestService.resetPassword(
      data.token,
      data.newPassword,
    );
  }

  @Post('validate')
  async validate(@Body() data: ValidateVerificationRequestDto) {
    return this.verificationRequestService.validate(
      data.identifier,
      data.type,
      data.code,
    );
  }
}
