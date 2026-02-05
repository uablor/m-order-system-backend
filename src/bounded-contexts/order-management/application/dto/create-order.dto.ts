import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsUUID()
  merchantId!: string;

  @ApiProperty()
  @IsUUID()
  createdBy!: string;

  @ApiProperty({ example: 'ORD-2025-001' })
  @IsString()
  orderCode!: string;

  @ApiProperty({ example: '2025-02-05' })
  @IsDateString()
  orderDate!: string;
}
