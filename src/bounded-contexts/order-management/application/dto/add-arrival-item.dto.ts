import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class AddArrivalItemDto {
  @ApiProperty()
  @IsUUID()
  orderItemId!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  arrivedQuantity!: number;

  @ApiPropertyOptional({ enum: ['OK', 'DAMAGED', 'LOST'], default: 'OK' })
  @IsEnum(['OK', 'DAMAGED', 'LOST'])
  condition?: 'OK' | 'DAMAGED' | 'LOST';

  @ApiPropertyOptional()
  @IsString()
  notes?: string;
}
