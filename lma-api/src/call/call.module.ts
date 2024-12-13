import { Module } from '@nestjs/common';
import { CallService } from './call.service';
import { CallController } from './call.controller';
import { AuthService } from 'src/auth/auth.service';
import { DynamoDBService } from 'src/dynamodb.service';

@Module({
  controllers: [CallController],
  providers: [CallService, AuthService, DynamoDBService],
})
export class CallModule {}
