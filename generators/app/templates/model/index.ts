/* tslint:disable:max-line-length */
import { Shared } from '../';
import { IDatabase, IMain } from 'pg-promise';

export interface <%= interfaceName %> {
    <%= properties %>
}

export class <%= interfaceName %>Repo {
    db: IDatabase<any>;
    pgp: IMain;

    constructor(db: IDatabase<any>, pgp: IMain) {
        this.db = db;
        this.pgp = pgp;
    }

    empty = () =>
        this.db.none('TRUNCATE TABLE "<%= tableName %>" CASCADE');

    add = (params: <%= interfaceName %>): Promise<<%= interfaceName %> & Shared> =>
        this.db.one('INSERT INTO "<%= tableName %>"(<%= columns %> '
            + 'VALUES(<%= values %>) '
            + 'RETURNING *', params, (role: <%= interfaceName %>) => role)

    remove = (id: string): Promise<any> =>
        this.db.result('DELETE FROM "<%= tableName %>" WHERE id = $1', id, (r: any) => r.rowCount);

    edit = (id: string, params: <%= interfaceName %>): Promise<<%= interfaceName %> & Shared> => {
        params.id = id;
        return this.db.oneOrNone('UPDATE "<%= tableName %>" '
            + 'SET (<%= columns %>) = '
            + '(<%= values %>) '
            + 'WHERE id = ${id} RETURNING *' , params, (<%= modelName %>: <%= interfaceName %>) => <%= modelName %>);
    }

    find = (id: string): Promise<<%= interfaceName %> & Shared> =>
        this.db.oneOrNone('SELECT * FROM "<%= tableName %>" WHERE id = $1', id);

    all = (): Promise<(<%= interfaceName %> & Shared)[]> =>
        this.db.any('SELECT * FROM "<%= tableName %>"');

    total = (): Promise<number> =>
        this.db.one('SELECT count(*) FROM "<%= tableName %>"', [], (a: any) => +a.count);
}
