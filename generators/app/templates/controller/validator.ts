import { Request, Response, NextFunction } from '../../yoshi';
import * as Joi from 'joi';

export function <%= modelName %>Validator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object().keys({
<%= inputSchema %>    });

    const { error, value } = Joi.validate(req.body, schema);
    if (error) {
        return res.badRequest({
            message: error.message,
        });
    }

    req.body = value;
    next();
}
