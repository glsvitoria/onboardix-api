import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTaskDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString({
    message: 'O título da atividade deve ser uma string',
  })
  @IsOptional()
  title: string;

  @IsString({
    message: 'O conteúdo deve ser uma string',
  })
  @IsOptional()
  content?: string;
}

export class UpdateTemplateDto {
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

  @IsArray({ message: 'As tarefas devem ser um array' })
  @ArrayMinSize(1, {
    message: 'O roteiro deve ter pelo menos uma tarefa criada',
  })
  @ArrayUnique((o: UpdateTaskDto) => o.id, {
    message:
      'O roteiro possui tarefas duplicadas, com IDs iguais para diferentes itens',
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateTaskDto)
  tasks: UpdateTaskDto[];
}
