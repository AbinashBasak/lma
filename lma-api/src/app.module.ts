import { Module } from '@nestjs/common';
import { DynamoDBService } from './dynamodb.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [DynamoDBService, AuthService, JwtAuthGuard],
})
export class AppModule {}
