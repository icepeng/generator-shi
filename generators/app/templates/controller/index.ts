import { Request, Response, NextFunction } from '../../yoshi';
import { Model, <%= interfaceName %> } from '../../model';
import { inputValidator } from './validator';

export const <%= modelName %>Controller = {

    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const <%= pluralName %> = await Model.<%= modelName %>.all();
            res.ok({
                message: 'Success',
                <%= pluralName %>,
            });
        } catch (err) {
            next(err);
        }
    },

    getOne: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.params.id;
            const <%= modelName %> = await Model.<%= modelName %>.find(query);
            if (<%= modelName %>) {
                res.ok({
                    message: 'Success',
                    <%= modelName %>,
                });
            } else {
                res.notFound({
                    message: 'No <%= modelName %> found with the given id.',
                });
            }
        } catch (err) {
            next(err);
        }
    },

    add: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const input = inputValidator(req.body);
            const <%= modelName %> = await Model.<%= modelName %>.add(input);
            res.ok({
                message: 'Success',
                <%= modelName %>,
            });
        } catch (err) {
            next(err);
        }
    },

    remove: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.params.id;
            if (await Model.<%= modelName %>.remove(query)) {
                res.ok({
                    message: 'Success',
                });
            } else {
                res.notFound({
                    message: 'No <%= modelName %> found with the given id.',
                });
            }
        } catch (err) {
            next(err);
        }
    },

    edit: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.params.id;
            const input = inputValidator(req.body);
            const <%= modelName %> = await Model.<%= modelName %>.edit(query, input);
            if (<%= modelName %>) {
                res.ok({
                    message: 'Success',
                    <%= modelName %>,
                });
            } else {
                res.notFound({
                    message: 'No <%= modelName %> found with the given id.',
                });
            }
        } catch (err) {
            next(err);
        }
    },

};
