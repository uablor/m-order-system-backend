import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePlatformRoleDto {
  @ApiPropertyOptional({ example: 'SUPPORT' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
