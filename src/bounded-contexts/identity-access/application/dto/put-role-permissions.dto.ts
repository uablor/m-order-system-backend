import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class PutRolePermissionsDto {
  @ApiProperty({ example: ['perm-id-1', 'perm-id-2'] })
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds!: string[];
}
