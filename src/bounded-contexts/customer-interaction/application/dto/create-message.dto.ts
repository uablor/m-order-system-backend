import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsUUID()
  customerId!: string;

  @ApiProperty()
  @IsUUID()
  merchantId!: string;

  @ApiPropertyOptional()
  @IsUUID()
  orderId?: string;

  @ApiProperty({ enum: ['TEXT', 'IMAGE'] })
  @IsEnum(['TEXT', 'IMAGE'])
  messageType!: 'TEXT' | 'IMAGE';

  @ApiProperty()
  @IsString()
  messageContent!: string;

  @ApiPropertyOptional()
  @IsString()
  fileUrl?: string;
}
