import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AuthenticatedUser } from '../types/authenticated-user'
import { Request } from 'express'

/**
 * Decorator de parâmetro que extrai o usuário autenticado do objeto da Requisição (Request).
 * * - Utilizado em conjunto com o `AccessTokenGuard`.
 * - Retorna os dados do payload do JWT (id, orgId, role, etc.) já tipados.
 * - Evita o acesso direto ao objeto `req.user` do Express nos Controllers.
 */
export const CurrentUser = createParamDecorator(
	(_: never, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<Request>()

		return request.user as AuthenticatedUser
	}
)
