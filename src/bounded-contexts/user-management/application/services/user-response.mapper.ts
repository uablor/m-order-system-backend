import type { UserEntity } from '../../domain/entities/user.entity';
import type { UserResponseDto } from '../dto/user-response.dto';

export function userToResponseDto(user: UserEntity): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    roleId: user.roleId ?? '',
    merchantId: user.merchantId ?? '',
    isActive: user.isActive,
    lastLogin: user.lastLogin?.toISOString(),
    createdAt: user.createdAt?.toISOString() ?? '',
    updatedAt: user.updatedAt?.toISOString() ?? '',
  };
}
