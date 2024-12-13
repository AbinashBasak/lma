import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCallDto } from './dto/update-call.dto';
import { DynamoDBService } from 'src/dynamodb.service';

@Injectable()
export class CallService {
  constructor(private readonly dynamoDBService: DynamoDBService) {}
  private TABLE_NAME = process.env.DYNAMO_DB_EVENT_SOURCING_TABLE;

  async update(id: string, updateCallDto: UpdateCallDto) {
    const callId = `c#${id}`;

    // Check if the item exists
    const existingItem = await this.dynamoDBService.getItem({
      TableName: this.TABLE_NAME,
      Key: {
        PK: { S: callId },
        SK: { S: callId },
      },
    });
    if (!existingItem.Item) {
      throw new NotFoundException(`Call with ID #${id} not found.`);
    }

    // Update the item
    const updateExpression =
      'SET UserName = :userName, MeetingTopic = :meetingTopic';
    const expressionAttributeValues = {
      ':userName': { S: updateCallDto.userName },
      ':meetingTopic': { S: updateCallDto.meetingTopic },
    };

    await this.dynamoDBService.updateItem({
      TableName: this.TABLE_NAME,
      Key: {
        PK: { S: callId },
        SK: { S: callId },
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    return {
      message: `Call with ID #${id} updated successfully.`,
      updatedFields: updateCallDto,
    };
  }
}
