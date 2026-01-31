import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  roleId: string;

  @ApiProperty()
  merchantId: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ required: false })
  lastLogin?: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
