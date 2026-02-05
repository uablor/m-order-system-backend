import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, Min } from 'class-validator';

export class UpdateExchangeRateDto {
  @ApiPropertyOptional({ example: 352 })
  @IsNumber()
  @Min(0.000001)
  rate?: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  isActive?: boolean;
}
