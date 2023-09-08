import {
  JsonController,
  Get,
  Post,
  Body,
  Param,
  UseAfter,
} from "routing-controllers";
import { validate } from "class-validator";

import { IPerson } from "./Person.types";
import { CreatePerson } from "./CreatePerson.dto";

import { ApiResponse } from "helpers/ApiResponse";
import { ApiError } from "helpers/ApiError";
import { HTTPResponseLogger } from "app/middlewares/HTTPResponseLogger";

const storeData: IPerson[] = [];

@JsonController("/person")
export default class Person {
  @Get()
  @UseAfter(HTTPResponseLogger)
  async getAll() {
    return new ApiResponse(true, storeData);
  }

  @Get("/:id")
  async getOne(@Param("id") id: number): Promise<ApiResponse<IPerson | {}>> {
    const person = storeData.find((item) => {
      return item.id === id;
    });
    if (!person) {
      throw new ApiError(404, {
        code: "PERSON_NOT_FOUND",
        message: `Person with id ${id} not found`,
      });
    }

    return new ApiResponse(true, person);
  }

  @Post()
  async setPerson(@Body() body: CreatePerson) {
    // validate the body using class-validator
    const errors = await validate(body);

    if (errors.length > 0) {
      throw new ApiError(400, {
        message: "Validation failed",
        code: "PERSON_VALIDATION_ERROR",
        errors,
      });
    }

    const id = storeData.length;

    storeData.push({ ...body, id });
    return new ApiResponse(true, "Person successfully created");
  }
}
