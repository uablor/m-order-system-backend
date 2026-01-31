import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class CreateMerchantDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  ownerUserId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shopName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  defaultCurrency: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shopLogoUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shopAddress?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contactEmail?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contactFacebook?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contactLine?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contactWhatsapp?: string;
}
