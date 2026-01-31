import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class AddCustomerOrderItemDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  merchantId!: string;

  @ApiProperty()
  @IsString()
  productRef!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  quantity!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  unitPrice!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  totalPrice!: number;

  @ApiProperty({ enum: ['THB', 'CNY', 'USD', 'LAK'] })
  @IsString()
  currency!: string;
}
