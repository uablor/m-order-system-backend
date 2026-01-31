import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  merchantId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  customerId!: string;

  @ApiProperty({ enum: ['ORDER', 'PAYMENT', 'ARRIVAL', 'ALERT', 'SYSTEM'] })
  @IsString()
  type!: string;

  @ApiProperty({ enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP', 'WHATSAPP'] })
  @IsString()
  channel!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  body!: string;
}
