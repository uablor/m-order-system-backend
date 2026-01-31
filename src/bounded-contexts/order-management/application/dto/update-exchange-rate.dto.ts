import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateExchangeRateDto {
  @ApiProperty({ example: 1.52 })
  @IsNumber()
  @IsPositive()
  rate!: number;
}
