import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { getRequestFromGraphqlContext } from "../../../utils/guard.utils";

/**
 * User Decorator
 */
export const CurrentUser = createParamDecorator(async (data: string, ctx: ExecutionContext) => {
    const request = await getRequestFromGraphqlContext(ctx);
    const user = request.user;
    if(user) return data ? user[data] : user;
    return undefined;
});