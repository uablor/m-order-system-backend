import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Min } from 'class-validator';

export class AddOrderItemDto {
  @ApiProperty()
  @IsString()
  productName!: string;

  @ApiProperty({ default: '' })
  @IsString()
  variant?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ example: 'THB' })
  @IsString()
  purchaseCurrency!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  purchasePrice!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  purchaseExchangeRate!: number;

  @ApiProperty({ enum: ['PERCENT', 'FIX'], default: 'FIX' })
  @IsEnum(['PERCENT', 'FIX'])
  discountType?: 'PERCENT' | 'FIX';

  @ApiProperty({ default: 0 })
  @IsNumber()
  @Min(0)
  discountValue?: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @Min(0)
  sellingPriceForeign?: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @Min(0)
  sellingExchangeRate?: number;
}
