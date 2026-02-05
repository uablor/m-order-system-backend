import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Min } from 'class-validator';

export class UpdateOrderItemDto {
  @ApiPropertyOptional()
  @IsString()
  productName?: string;

  @ApiPropertyOptional()
  @IsString()
  variant?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  purchasePrice?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  purchaseExchangeRate?: number;

  @ApiPropertyOptional({ enum: ['PERCENT', 'FIX'] })
  @IsEnum(['PERCENT', 'FIX'])
  discountType?: 'PERCENT' | 'FIX';

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  discountValue?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  sellingPriceForeign?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  sellingExchangeRate?: number;
}
