import { OrganizationEntity } from '@/organizations/entity/organization.entity';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UserEntity } from './user';
import { PickType } from '@nestjs/mapped-types';

export class UserWithOrganizationEntity extends PickType(UserEntity, [
  'createdAt',
  'email',
  'fullName',
  'id',
  'role',
  'updatedAt',
]) {
  @ValidateNested()
  @Type(() => OrganizationEntity)
  organization: OrganizationEntity;

  constructor(partial: Partial<UserWithOrganizationEntity>) {
    super();
    Object.assign(this, partial);

    if (partial.organization) {
      this.organization = new OrganizationEntity(partial.organization);
    }
  }
}
