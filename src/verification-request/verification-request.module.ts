import { Module } from '@nestjs/common';
import { VerificationRequestService } from './verification-request.service';
import { VerificationRequestController } from './verification-request.controller';

@Module({
  providers: [VerificationRequestService],
  controllers: [VerificationRequestController],
})
export class VerificationRequestModule {}
