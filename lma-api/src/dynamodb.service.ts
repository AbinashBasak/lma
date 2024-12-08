// src/dynamodb.service.ts
import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

@Injectable()
export class DynamoDBService {
  readonly client = new DynamoDBClient({ region: 'us-east-1' });
}
