import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @ApiProperty({
    description: 'The ID of the customer placing the order',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  customerId: string;

  @IsUUID()
  @ApiProperty({
    description: 'The ID of the product being ordered',
    example: 'b1fc2d1a-f500-4e4b-b5a2-85999c97e3c8',
  })
  productId: string;

  @IsPositive()
  @ApiProperty({
    description: 'The quantity of the product being ordered',
    example: 2,
  })
  quantity: number;
}
