import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform, ValidationError } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class BackandValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToClass(metadata.metatype, value);

    if (typeof object !== 'object') return value;

    const errors = await validate(object);

    if (errors.length === 0) return value;

    throw new HttpException({ errors: this.formattingErrors(errors) }, HttpStatus.UNPROCESSABLE_ENTITY);
  }

  formattingErrors(errors: ValidationError[]) {
    return errors.reduce((acc, err) => {
      acc[err.property] = Object.values(err.constraints);

      return acc;
    }, {});
  }
}