// src/dynamodb.service.ts
import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';

@Injectable()
export class DynamoDBService {
  readonly client = new DynamoDBClient({ region: 'us-east-1' });

  async getItem(params: { TableName: string; Key: Record<string, any> }) {
    const command = new GetItemCommand(params);
    return await this.client.send(command);
  }

  async updateItem(params: {
    TableName: string;
    Key: Record<string, any>;
    UpdateExpression: string;
    ExpressionAttributeValues: Record<string, any>;
  }) {
    const command = new UpdateItemCommand(params);
    return await this.client.send(command);
  }
}
