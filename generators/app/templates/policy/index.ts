import { Request, Response, NextFunction } from '../../yoshi';

export function <%= policyName %>(req: Request, res: Response, next: NextFunction) {
    // write policy here
    next();
}
