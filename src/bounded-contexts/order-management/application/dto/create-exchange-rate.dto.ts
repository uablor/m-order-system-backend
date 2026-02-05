import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateExchangeRateDto {
  @ApiProperty({ example: 'uuid-merchant' })
  @IsUUID()
  merchantId!: string;

  @ApiProperty({ example: 'THB' })
  @IsString()
  baseCurrency!: string;

  @ApiProperty({ example: 'LAK' })
  @IsString()
  targetCurrency!: string;

  @ApiProperty({ enum: ['BUY', 'SELL'] })
  @IsEnum(['BUY', 'SELL'])
  rateType!: 'BUY' | 'SELL';

  @ApiProperty({ example: 350 })
  @IsNumber()
  @Min(0.000001)
  rate!: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: '2025-02-05' })
  @IsDateString()
  rateDate!: string;

  @ApiProperty({ example: 'uuid-user' })
  @IsUUID()
  createdBy!: string;
}
