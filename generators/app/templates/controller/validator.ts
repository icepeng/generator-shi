import { <%= interfaceName %> } from '../../model';
import * as Joi from 'joi';

export function inputValidator(role: any): <%= interfaceName %> {
    const schema = Joi.object().keys({
<%= inputSchema %>    });
    return Joi.attempt(role, schema);
}
