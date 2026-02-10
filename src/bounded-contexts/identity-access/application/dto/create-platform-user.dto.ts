import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { PLATFORM_ROLES, type PlatformRole } from '../../domain/value-objects/platform-role.vo';

export class CreatePlatformUserDto {
  @ApiProperty({ example: 'admin@platform.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'SecureP@ss1' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'Platform Admin' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: 'SUPER_ADMIN', enum: PLATFORM_ROLES })
  @IsIn(PLATFORM_ROLES)
  role!: PlatformRole;
}
