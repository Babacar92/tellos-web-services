import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ALLOW_PUBLIC_KEY } from '../libs/auth/decorators/allow.public.decorator';

/**
 * Is Allow Public
 */
export const isAllowPublic = (
    reflector: Reflector,
    context: ExecutionContext,
) =>
    reflector.getAllAndOverride<boolean>(ALLOW_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
    ]);

/**
 * Create and return Request from context
 */
export const getRequestFromGraphqlContext = (context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext();
    const request = ctx.req;
    return request;
};
