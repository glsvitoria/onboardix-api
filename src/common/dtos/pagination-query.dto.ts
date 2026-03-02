import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator'
import { PaginationResultDto } from './pagination-result.dto'
import { ErrorMessageClassValidator } from '../helpers/error-message-class-validator'

export interface IPaginationOptions {
	take: number
	skip: number
}

export abstract class PaginationQueryDto<T extends string = 'createdAt'> {
	abstract sort: T

	@IsNumber()
	@IsNotEmpty({
		message: ErrorMessageClassValidator.required('init', 'm'),
	})
	@Min(0, {
		message: ErrorMessageClassValidator.minValue('init', 0),
	})
	@Type(() => Number)
	init: number

	@IsNumber()
	@IsNotEmpty({
		message: ErrorMessageClassValidator.required('limit', 'm'),
	})
	@Min(1, {
		message: ErrorMessageClassValidator.minValue('limit', 1),
	})
	@Max(100, {
		message: ErrorMessageClassValidator.maxValue('limit', 100),
	})
	@Type(() => Number)
	limit: number

	pagination(): IPaginationOptions {
		return {
			take: this.limit,
			skip: this.init,
		}
	}

	createMetadata<T>(results: T[], total: number): PaginationResultDto<T> {
		return {
			results,
			total,
		}
	}
}
