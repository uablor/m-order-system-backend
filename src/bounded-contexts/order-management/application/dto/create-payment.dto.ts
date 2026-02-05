import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsUUID()
  orderId!: string;

  @ApiProperty()
  @IsUUID()
  merchantId!: string;

  @ApiProperty()
  @IsUUID()
  customerId!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  paymentAmount!: number;

  @ApiProperty({ example: '2025-02-05' })
  @IsDateString()
  paymentDate!: string;

  @ApiProperty({ example: 'BANK_TRANSFER' })
  @IsString()
  paymentMethod!: string;

  @ApiPropertyOptional()
  @IsString()
  paymentProofUrl?: string;

  @ApiPropertyOptional()
  @IsDateString()
  paymentAt?: string;

  @ApiPropertyOptional()
  @IsString()
  customerMessage?: string;
}
