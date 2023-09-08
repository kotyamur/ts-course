import { IsEmail, Length, IsInt, Min, Max } from "class-validator";

import type { IPerson } from "./Person.types";

export class CreatePerson implements Omit<IPerson, "id"> {
  @Length(2, 20)
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(18)
  @Max(99)
  age: number;
}
