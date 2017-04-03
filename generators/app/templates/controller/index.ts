import { Request, Response, NextFunction } from '../../yoshi';
import { Model, <%= interfaceName %> } from '../../model';

export const <%= modelName %>Controller = {

    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const <%= pluralName %> = await Model.<%= modelName %>.all();
            return res.ok({
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
            if (!<%= modelName %>) {
                return res.notFound({
                    message: 'No <%= modelName %> found with the given id.',
                });
            }

            return res.ok({
                <%= modelName %>,
            });
        } catch (err) {
            next(err);
        }
    },

    add: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const input = req.body;
            const <%= modelName %> = await Model.<%= modelName %>.add(input);
            return res.ok({
                <%= modelName %>,
            });
        } catch (err) {
            next(err);
        }
    },

    remove: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.params.id;
            const result = await Model.<%= modelName %>.remove(query);
            if (!result) {
                return res.notFound({
                    message: 'No <%= modelName %> found with the given id.',
                });
            }

            return res.ok();
        } catch (err) {
            next(err);
        }
    },

    edit: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.params.id;
            const input = req.body;
            const <%= modelName %> = await Model.<%= modelName %>.edit(query, input);
            if (!<%= modelName %>) {
                return res.notFound({
                    message: 'No <%= modelName %> found with the given id.',
                });
            }

            return res.ok({
                <%= modelName %>,
            });
        } catch (err) {
            next(err);
        }
    },

};
