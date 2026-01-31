import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ArrivalItemDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  orderItemId!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  quantityReceived!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  condition!: string;
}

export class RecordArrivalDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  orderId!: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  arrivalDate!: string;

  @ApiProperty({ type: [ArrivalItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArrivalItemDto)
  items!: ArrivalItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
