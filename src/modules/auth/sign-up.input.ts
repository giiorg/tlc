import { InputType, Field } from 'type-graphql';
import { IsEmail, Min, Length } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(8)
  password: string;

  @Field()
  @Length(1, 500)
  firstName: string;

  @Field()
  @Length(1, 500)
  lastName: string;
}
