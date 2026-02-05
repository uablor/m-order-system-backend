import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateMerchantDto {
  @ApiProperty({ example: 'My Shop' })
  @IsString()
  @IsNotEmpty()
  shopName!: string;

  @ApiProperty({ example: 'LAK' })
  @IsString()
  @IsNotEmpty()
  defaultCurrency!: string;

  @ApiProperty({ example: 'owner@shop.com' })
  @IsEmail()
  @IsNotEmpty()
  ownerEmail!: string;

  @ApiProperty({ example: 'SecureP@ss1' })
  @IsString()
  @MinLength(6)
  ownerPassword!: string;

  @ApiProperty({ example: 'Owner Name' })
  @IsString()
  @IsNotEmpty()
  ownerFullName!: string;
}
