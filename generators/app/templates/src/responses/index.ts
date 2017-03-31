import { Router, Request, Response, NextFunction } from 'express';
import { ok } from './ok';
import { notFound } from './notFound';
import { badRequest } from './badRequest';
import { serverError } from './serverError';
import { unauthorized } from './unauthorized';

export interface MyResponse extends Response {
    // declare Responses here
    ok: (data?: any) => void;
    notFound: (data?: any) => void;
    badRequest: (data?: any) => void;
    serverError: (data?: any) => void;
    unauthorized: (data?: any) => void;
}

export function addResponses(req: any, res: MyResponse, next: NextFunction) {
    // set response functions here
    res.ok = ok;
    res.notFound = notFound;
    res.badRequest = badRequest;
    res.serverError = serverError;
    res.unauthorized = unauthorized;
    next();
}
