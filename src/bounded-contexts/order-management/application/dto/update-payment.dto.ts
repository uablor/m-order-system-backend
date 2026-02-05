import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePaymentDto {
  @ApiPropertyOptional()
  @IsString()
  notes?: string;
}
