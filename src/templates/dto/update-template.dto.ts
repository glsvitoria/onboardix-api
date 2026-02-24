import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateTaskDto {
  @IsString({
    message: 'O título da atividade deve ser uma string',
  })
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;
}

export class UpdateTemplateDto {
  @IsString({
    message: 'O título do template deve ser uma string',
  })
  @IsOptional()
  title: string;

  @IsString({
    message: 'A descrição deve ser uma string',
  })
  @IsOptional()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTaskDto)
  tasks: UpdateTaskDto[];
}
