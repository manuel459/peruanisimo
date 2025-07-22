import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { ReturnValue } from '@aws-sdk/client-dynamodb';
import * as dotenv from 'dotenv';
dotenv.config();

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const dynamoDb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'TotalesVentas';
const TOTAL_ID = 'total';

@Injectable()
export class VentasService {
  async procesarVenta(monto: number): Promise<number> {
    // Sumar el monto al total actual en DynamoDB
    const total = await this.actualizarTotal(monto);
    return monto;
  }

  private async actualizarTotal(monto: number): Promise<number> {
    const params = {
      TableName: TABLE_NAME,
      Key: { id: TOTAL_ID },
      UpdateExpression: 'SET #total = if_not_exists(#total, :zero) + :monto',
      ExpressionAttributeNames: {
        '#total': 'total',
      },
      ExpressionAttributeValues: {
        ':monto': monto,
        ':zero': 0,
      },
      ReturnValues: 'UPDATED_NEW' as ReturnValue,
    };
    const result = await dynamoDb.send(new UpdateCommand(params));
    return result.Attributes?.total ?? 0;
  }

  async obtenerTotal(): Promise<number> {
    const params = {
      TableName: TABLE_NAME,
      Key: { id: TOTAL_ID },
    };
    const result = await dynamoDb.send(new GetCommand(params));
    return result.Item?.total ?? 0;
  }
} 