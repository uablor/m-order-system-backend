import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePlatformRoleDto {
  @ApiProperty({ example: 'SUPPORT' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
}
