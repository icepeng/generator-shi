import { MyResponse } from './responses';
import { Request, NextFunction, Router } from 'express';

interface MyRequest extends Request {
    user: {
        id: string;
    };
};

export {
    MyResponse as Response,
    MyRequest as Request,
    NextFunction,
    Router,
};
