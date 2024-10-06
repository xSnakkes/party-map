import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { Key } from '../models/keys.model';

export function ApiCreateKey() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a key',
      description: 'Create a key',
    }),
    ApiCreatedResponse({
      description: 'The key has been successfully created.',
      type: Key,
    }),
    ApiBadRequestResponse({
      description: 'Bad Request',
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
    }),
  );
}

export function ApiGetKey() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a key',
      description: 'Get a key',
    }),
    ApiCreatedResponse({
      description: 'The key has been successfully retrieved.',
      type: Key,
    }),
    ApiBadRequestResponse({
      description: 'Bad Request',
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
    }),
  );
}
