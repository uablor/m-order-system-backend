import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsString, IsUUID } from 'class-validator';

export class CreateArrivalDto {
  @ApiProperty()
  @IsUUID()
  orderId!: string;

  @ApiProperty()
  @IsUUID()
  merchantId!: string;

  @ApiProperty({ example: '2025-02-05' })
  @IsDateString()
  arrivedDate!: string;

  @ApiPropertyOptional({ example: '14:30:00' })
  @IsString()
  arrivedTime?: string;

  @ApiProperty()
  @IsUUID()
  recordedBy!: string;

  @ApiPropertyOptional()
  @IsString()
  notes?: string;
}
