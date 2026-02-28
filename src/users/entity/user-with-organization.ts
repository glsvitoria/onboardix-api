import { OrganizationEntity } from '@/organizations/entity/organization.entity';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UserEntity } from './user';

export class UserWithOrganizationEntity extends UserEntity {
  @ValidateNested()
  @Type(() => OrganizationEntity)
  organization: OrganizationEntity;

  constructor(partial: Partial<UserWithOrganizationEntity>) {
    super(partial);

    if (partial.organization) {
      this.organization = new OrganizationEntity(partial.organization);
    }
  }
}
