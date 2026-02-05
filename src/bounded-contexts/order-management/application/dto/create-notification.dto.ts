import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty()
  @IsUUID()
  merchantId!: string;

  @ApiProperty()
  @IsUUID()
  customerId!: string;

  @ApiProperty({ enum: ['ARRIVAL', 'PAYMENT', 'REMINDER'] })
  @IsEnum(['ARRIVAL', 'PAYMENT', 'REMINDER'])
  notificationType!: 'ARRIVAL' | 'PAYMENT' | 'REMINDER';

  @ApiProperty({ enum: ['FB', 'LINE', 'WHATSAPP'] })
  @IsEnum(['FB', 'LINE', 'WHATSAPP'])
  channel!: 'FB' | 'LINE' | 'WHATSAPP';

  @ApiProperty()
  @IsString()
  recipientContact!: string;

  @ApiProperty()
  @IsString()
  messageContent!: string;

  @ApiPropertyOptional()
  @IsString()
  notificationLink?: string;

  @ApiPropertyOptional({ type: [String], description: 'Related order IDs' })
  @IsArray()
  @IsUUID('4', { each: true })
  relatedOrders?: string[];
}
