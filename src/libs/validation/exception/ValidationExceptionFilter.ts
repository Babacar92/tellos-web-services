import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from "@nestjs/common";
import { Request, Response } from 'express';
import { GqlArgumentsHost } from "@nestjs/graphql";
import { dateToTimestamp, dump } from "../../../utils/utils";

@Catch()
export class ValidationExceptionFilter implements ExceptionFilter {

    public catch(exception: any, host: ArgumentsHost) {
        const type: string = host.getType();
        const timestamp = dateToTimestamp(new Date(), 'H:i:s d/m/Y');

        if (type === 'http') {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse<Response>();
            const request = ctx.getRequest<Request>();
            const status = exception.getStatus ? exception.getStatus() : 500;

            const query = request.query;
            const body = request.body;

            response
                .status(status)
                .json({
                    error: exception?.response?.error || exception.constructor.name,
                    statusCode: status,
                    message: exception?.message || exception?.response?.message,
                    timestamp: timestamp,
                    path: request?.url,
                });

        }
        else if (type === 'graphql') {
            const gqlHost = GqlArgumentsHost.create(host);
            const { req, res } = gqlHost.getContext();
            const data: any = {
                timestamp: timestamp,
                path: req?.url,
            };

            if (exception.response) {
                Object.assign(data, exception.response);
            }

            if (exception.message) {
                if (typeof data.message === 'object') {
                    data.message._default = exception.message;
                } else if (typeof data.message === 'string') {
                    if (data.message !== exception.message) {
                        data.message = [
                            data.message,
                            exception.message,
                        ];
                    }
                } else if (data.message instanceof Array) {
                    if (!data.message.includes(exception.message)) data.message.push(exception.message);
                } else {
                    data.message = exception.message;
                }
            }

            return new BadRequestException(data);
        }
    }
}