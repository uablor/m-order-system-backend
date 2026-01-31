import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class RecordPaymentDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  merchantId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  orderId!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiProperty({ enum: ['THB', 'CNY', 'USD', 'LAK'] })
  @IsString()
  currency!: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  @IsDateString()
  paymentDate!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  customerOrderId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reference?: string;
}
