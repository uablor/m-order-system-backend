import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class UpdateOrderDto {
  @ApiPropertyOptional()
  @IsString()
  orderCode?: string;

  @ApiPropertyOptional()
  @IsDateString()
  orderDate?: string;
}
