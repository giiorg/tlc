import { ObjectType, Field, ID } from 'type-graphql';
import { Expose } from 'class-transformer';

@ObjectType()
export class User {
  @Field(type => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  @Expose({ name: 'first_name' })
  firstName: string;

  @Field()
  @Expose({ name: 'last_name' })
  lastName: string;

  password: string;

  verified: boolean;

  @Expose({ name: 'blocked_until' })
  blockedUntil: number;
}
