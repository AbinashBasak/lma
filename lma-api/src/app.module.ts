import { Module } from '@nestjs/common';
import { DynamoDBService } from './dynamodb.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserModule } from './user/user.module';
import { CallModule } from './call/call.module';

@Module({
  imports: [UserModule, CallModule],
  controllers: [],
  providers: [DynamoDBService, AuthService, JwtAuthGuard],
})
export class AppModule {}
