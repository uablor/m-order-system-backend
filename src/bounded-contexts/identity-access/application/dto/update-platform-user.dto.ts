import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { PLATFORM_ROLES, type PlatformRole } from '../../domain/value-objects/platform-role.vo';

export class UpdatePlatformUserDto {
  @ApiPropertyOptional({ example: 'Platform Admin' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: 'SUPPORT', enum: PLATFORM_ROLES })
  @IsOptional()
  @IsIn(PLATFORM_ROLES)
  role?: PlatformRole;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'NewSecureP@ss1' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
