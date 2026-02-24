import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateTaskDto {
  @IsString({
    message: 'O título da atividade deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O título da atividade não pode ser vazio',
  })
  title: string;

  @IsString()
  @IsOptional()
  content: string;
}

export class CreateTemplateDto {
  @IsString({
    message: 'O título do template deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O título do template não pode ser vazio',
  })
  title: string;

  @IsString({
    message: 'A descrição deve ser uma string',
  })
  @IsOptional()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  tasks: CreateTaskDto[];
}
