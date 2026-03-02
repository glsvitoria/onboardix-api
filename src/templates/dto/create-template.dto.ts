import { ErrorMessageClassValidator } from '@/common/helpers/error-message-class-validator';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateTaskDto {
  @IsString({
    message: ErrorMessageClassValidator.string('título da tarefa', 'f'),
  })
  @IsNotEmpty({
    message: ErrorMessageClassValidator.required('título da tarefa', 'f'),
  })
  title: string;

  @IsString({
    message: ErrorMessageClassValidator.required('conteúdo da tarefa', 'm'),
  })
  @IsOptional()
  content?: string;
}

export class CreateTemplateDto {
  @IsString({
    message: ErrorMessageClassValidator.string('título do roteiro', 'm'),
  })
  @IsNotEmpty({
    message: ErrorMessageClassValidator.required('título do roteiro', 'm'),
  })
  title: string;

  @IsString({
    message: ErrorMessageClassValidator.string('descrição do roteiro', 'm'),
  })
  @IsOptional()
  description?: string;

  @IsArray({ message: ErrorMessageClassValidator.array('tarefas') })
  @ArrayMinSize(1, {
    message: 'O roteiro deve ter pelo menos uma tarefa criada',
  })
  @ArrayUnique((o: CreateTaskDto) => o.title, {
    message:
      'O roteiro possui tarefas duplicadas, com títulos iguais para diferentes itens',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  tasks: CreateTaskDto[];
}
