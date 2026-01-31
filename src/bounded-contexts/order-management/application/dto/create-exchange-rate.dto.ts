import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateExchangeRateDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  merchantId!: string;

  @ApiProperty({ enum: ['THB', 'CNY', 'USD', 'LAK'] })
  @IsString()
  baseCurrency!: string;

  @ApiProperty({ enum: ['THB', 'CNY', 'USD', 'LAK'] })
  @IsString()
  targetCurrency!: string;

  @ApiProperty({ enum: ['BUY', 'SELL'] })
  @IsEnum(['BUY', 'SELL'])
  rateType!: 'BUY' | 'SELL';

  @ApiProperty({ example: 1.5 })
  @IsNumber()
  @IsPositive()
  rate!: number;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  rateDate!: string;
}
