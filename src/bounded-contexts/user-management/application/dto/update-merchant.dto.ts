import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class UpdateMerchantDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  ownerUserId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shopName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  defaultCurrency?: string;

  @ApiPropertyOptional()
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
