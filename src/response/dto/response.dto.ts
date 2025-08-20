import { IsEnum, IsNumber } from 'class-validator';
import { ResponseStatus } from '../response.entity';

export class CreateResponseDto {
  @IsNumber()
  vacancyId: number;
}

export class UpdateResponseDto {
  @IsEnum(ResponseStatus)
  status: ResponseStatus;
}
