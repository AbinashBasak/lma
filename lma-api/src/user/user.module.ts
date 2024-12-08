import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from 'src/auth/auth.service';
import { DynamoDBService } from 'src/dynamodb.service';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthService, DynamoDBService],
})
export class UserModule {}
