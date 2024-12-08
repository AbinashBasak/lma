import { Injectable } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { DynamoDBService } from 'src/dynamodb.service';
import { ICognitoTokenUser } from 'src/auth/types';
import {
  GetItemCommand,
  PutItemCommand,
  PutItemCommandInput,
} from '@aws-sdk/client-dynamodb';

@Injectable()
export class UserService {
  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async userDetails(user: ICognitoTokenUser) {
    const params = {
      TableName: process.env.DYNAMO_DB_USER_TABLE,
      Key: {
        PK: { S: user.username },
      },
    };
    const command = new GetItemCommand(params);
    const result = await this.dynamoDBService.client.send(command);
    if (!result.Item) {
      return null;
    }

    return {
      userName: result.Item.PK.S,
      role: result.Item.role.S,
      meetingCredit: result.Item.meetingCredit.N,
      department: (result.Item.department || { L: [] }).L.map((e) => e.S),
    };
  }

  async create(user: ICognitoTokenUser, updateUserDto: UpdateUserDto) {
    const existsUser = await this.userDetails(user);

    const params: PutItemCommandInput = {
      TableName: process.env.DYNAMO_DB_USER_TABLE,
      Item: {
        PK: { S: user.username },
      },
    };

    if (updateUserDto.department) {
      params.Item.department = {
        L: updateUserDto.department.map((e) => ({ S: e })),
      };
    }
    if (updateUserDto.role) {
      params.Item.role = {
        S: updateUserDto.role,
      };
    }
    if (!existsUser) {
      params.Item.meetingCredit = {
        N: '10',
      };
    }
    const command = new PutItemCommand(params);
    await this.dynamoDBService.client.send(command);
    return {
      success: true,
    };
  }
}
