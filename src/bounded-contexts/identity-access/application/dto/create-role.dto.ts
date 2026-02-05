import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'STAFF' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'uuid-merchant-id' })
  @IsOptional()
  @IsUUID()
  merchantId?: string | null;

  @ApiProperty({ example: ['perm-id-1', 'perm-id-2'] })
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds!: string[];
}
