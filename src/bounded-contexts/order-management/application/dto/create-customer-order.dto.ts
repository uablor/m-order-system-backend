import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCustomerOrderDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  merchantId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  customerId!: string;

  @ApiProperty()
  @IsString()
  orderCode!: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  orderDate!: string;

  @ApiProperty()
  @IsNumber()
  totalAmount!: number;

  @ApiProperty({ enum: ['THB', 'CNY', 'USD', 'LAK'] })
  @IsString()
  currency!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  orderId?: string;
}
