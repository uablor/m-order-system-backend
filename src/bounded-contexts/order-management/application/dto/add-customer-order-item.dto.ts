import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID, Min } from 'class-validator';

export class AddCustomerOrderItemDto {
  @ApiProperty()
  @IsUUID()
  orderItemId!: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  sellingPriceForeign!: number;

  @ApiProperty({ description: 'Exchange rate for selling (e.g. THB to LAK)' })
  @IsNumber()
  @Min(0)
  sellingExchangeRate!: number;
}
