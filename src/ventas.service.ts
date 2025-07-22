import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
dotenv.config();

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  // Las credenciales se toman automáticamente de process.env
});
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
    // Usar UpdateItem para incrementar el total de forma atómica
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
      ReturnValues: 'UPDATED_NEW',
    };
    const result = await dynamoDb.update(params).promise();
    return result.Attributes?.total ?? 0;
  }

  async obtenerTotal(): Promise<number> {
    const params = {
      TableName: TABLE_NAME,
      Key: { id: TOTAL_ID },
    };
    const result = await dynamoDb.get(params).promise();
    return result.Item?.total ?? 0;
  }
} 